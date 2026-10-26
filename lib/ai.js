import { forbrugPrKategori, samletForbrug, genererRaad, kr } from './analyse';
import { budgetStatus } from './budget';

const GROQ_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const ANTHROPIC_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
const TIMEOUT_MS = 20000;

// Hvilken udbyder bruges? Afgøres af, hvilken nøgle der er sat.
const UDBYDER = GROQ_KEY ? 'groq' : ANTHROPIC_KEY ? 'anthropic' : null;

export const aiErSatOp = () => UDBYDER !== null;
export const aiUdbyderNavn = () =>
  UDBYDER === 'groq' ? 'Groq' : UDBYDER === 'anthropic' ? 'Anthropic' : 'ingen';

// Bygger den tekst, modellen får. Kun summer og de hyppigste steder sendes —
// ikke hele listen med datoer. Mindre data ud af telefonen, og kortere prompt.
export function lavOpsummering(udgifter, budget) {
  const total = samletForbrug(udgifter);
  const kategorier = forbrugPrKategori(udgifter)
    .map((k) => `- ${k.kategori}: ${kr(k.beloeb)} kr`)
    .join('\n');

  // De steder, brugeren handler oftest.
  const steder = {};
  udgifter.forEach((u) => {
    const navn = u.tekst.trim();
    steder[navn] = steder[navn] || { antal: 0, sum: 0 };
    steder[navn].antal += 1;
    steder[navn].sum += u.beloeb;
  });
  const topSteder = Object.entries(steder)
    .sort((a, b) => b[1].sum - a[1].sum)
    .slice(0, 5)
    .map(([navn, s]) => `- ${navn}: ${s.antal} køb, ${kr(s.sum)} kr`)
    .join('\n');

  const s = budgetStatus(udgifter, budget);
  const budgetLinje = s.harBudget
    ? `Månedsbudget: ${kr(s.budget)} kr. Brugt denne måned: ${kr(s.brugt)} kr. Dage tilbage: ${s.dageTilbage}.`
    : 'Brugeren har ikke sat et månedsbudget.';

  return `Samlet forbrug: ${kr(total)} kr fordelt på ${udgifter.length} udgifter.

Forbrug pr. kategori:
${kategorier}

Hyppigste steder:
${topSteder}

${budgetLinje}`;
}

const SYSTEM_PROMPT = `Du er Finora, en rådgiver i en privatøkonomi-app for almene danskere.
Du får en opsummering af brugerens variable udgifter. Skriv præcis 3 korte, konkrete råd på dansk.
Hvert råd skal tage udgangspunkt i tallene, nævne et beløb, og være noget brugeren kan gøre i denne uge.
Vær venlig og direkte, ikke belærende. Opfind ikke tal, der ikke står i opsummeringen.
Svar KUN med JSON i dette format, uden anden tekst:
[{"titel": "max 60 tegn", "tekst": "1-2 sætninger"}, ...]`;

// Finder JSON-listen i modellens svar, også hvis der er tekst omkring den.
export function parseRaad(tekst) {
  const start = tekst.indexOf('[');
  const slut = tekst.lastIndexOf(']');
  if (start === -1 || slut === -1) throw new Error('Intet JSON i svaret');
  const liste = JSON.parse(tekst.slice(start, slut + 1));
  if (!Array.isArray(liste) || liste.length === 0) throw new Error('Tom liste');
  return liste.slice(0, 3).map((r, i) => ({
    id: `ai-${i}`,
    titel: String(r.titel || '').slice(0, 80),
    tekst: String(r.tekst || ''),
    type: 'info',
  }));
}

// --- Udbyder 1: Groq (gratis tier, OpenAI-kompatibelt API) ---
async function kaldGroq(opsummering, signal) {
  const svar = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    signal,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.EXPO_PUBLIC_AI_MODEL || 'openai/gpt-oss-120b',
      // gpt-oss tænker, før den svarer — giv plads til både tænkning og svar.
      max_tokens: 2000,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: opsummering },
      ],
    }),
  });
  if (!svar.ok) {
    const detaljer = await svar.text();
    throw new Error(`API svarede ${svar.status}: ${detaljer.slice(0, 120)}`);
  }
  const data = await svar.json();
  return data.choices?.[0]?.message?.content || '';
}

// --- Udbyder 2: Anthropic (Claude) ---
async function kaldAnthropic(opsummering, signal) {
  const svar = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      // Kræves kun, hvis appen køres i en browser (expo web).
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: process.env.EXPO_PUBLIC_AI_MODEL || 'claude-haiku-5-5',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: opsummering }],
    }),
  });
  if (!svar.ok) {
    const detaljer = await svar.text();
    throw new Error(`API svarede ${svar.status}: ${detaljer.slice(0, 120)}`);
  }
  const data = await svar.json();
  // Svaret kan indeholde flere blokke (fx tænkning) — vi vil kun have teksten.
  return (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
}

// Hovedfunktionen, som IndsigtScreen kalder.
// Returnerer altid { raad, kilde, fejl } — kilde er 'ai' eller 'regler'.
export async function hentAiRaad(udgifter, budget) {
  const reserve = (fejl) => ({ raad: genererRaad(udgifter), kilde: 'regler', fejl });

  if (!UDBYDER) return reserve('AI er ikke sat op (mangler API-nøgle).');
  if (udgifter.length < 3) return reserve('For få udgifter til AI-råd.');

  // Afbryd kaldet, hvis det tager for lang tid — ellers hænger knappen.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const opsummering = lavOpsummering(udgifter, budget);

  try {
    const tekst =
      UDBYDER === 'groq'
        ? await kaldGroq(opsummering, controller.signal)
        : await kaldAnthropic(opsummering, controller.signal);

    return { raad: parseRaad(tekst), kilde: 'ai', fejl: null };
  } catch (e) {
    const besked = e.name === 'AbortError' ? 'AI svarede ikke i tide.' : e.message;
    console.warn('AI-kald fejlede:', besked);
    return reserve(besked);
  } finally {
    clearTimeout(timer);
  }
}
