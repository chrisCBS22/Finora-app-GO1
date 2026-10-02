const kr = (n) =>
  n.toLocaleString('da-DK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// Summerer forbrug pr. kategori og sorterer faldende.
export function forbrugPrKategori(udgifter) {
  const sum = {};
  udgifter.forEach((u) => {
    sum[u.kategori] = (sum[u.kategori] || 0) + u.beloeb;
  });
  return Object.entries(sum)
    .map(([kategori, beloeb]) => ({ kategori, beloeb }))
    .sort((a, b) => b.beloeb - a.beloeb);
}

export function samletForbrug(udgifter) {
  return udgifter.reduce((sum, u) => sum + u.beloeb, 0);
}

// Genererer op til 3 råd, rangeret efter hvor meget der er at hente.
export function genererRaad(udgifter) {
  if (udgifter.length < 3) {
    return [
      {
        id: 'for-lidt-data',
        titel: 'Tilføj et par udgifter mere',
        tekst: 'Jeg kan give dig råd, når der er mindst 3 registrerede udgifter at regne på.',
        type: 'info',
      },
    ];
  }

  const total = samletForbrug(udgifter);
  const perKategori = forbrugPrKategori(udgifter);
  const raad = [];

  // Regel 1: den kategori der fylder mest.
  const stoerste = perKategori[0];
  const andel = Math.round((stoerste.beloeb / total) * 100);
  raad.push({
    id: 'stoerste-kategori',
    vaegt: stoerste.beloeb,
    titel: `${stoerste.kategori} fylder ${andel}% af dit forbrug`,
    tekst: `Du har brugt ${kr(stoerste.beloeb)} kr på ${stoerste.kategori.toLowerCase()} ud af ${kr(total)} kr i alt. Skærer du 20% her, sparer du ca. ${kr(stoerste.beloeb * 0.2)} kr om måneden.`,
    // Dagligvarer er en nødvendighed — den markeres aldrig som advarsel,
    // selv når den fylder mest. Råd skal være brugbare, ikke bare korrekte.
    type: andel > 40 && stoerste.kategori !== 'Dagligvarer' ? 'advarsel' : 'info',
  });

  // Regel 2: mange små køb — det klassiske "hvor blev pengene af".
  const smaakoeb = udgifter.filter((u) => u.beloeb < 100);
  const smaakoebSum = samletForbrug(smaakoeb);
  if (smaakoeb.length >= 3) {
    raad.push({
      id: 'smaakoeb',
      vaegt: smaakoebSum,
      titel: `${smaakoeb.length} småkøb er blevet til ${kr(smaakoebSum)} kr`,
      tekst: `Køb under 100 kr føles ubetydelige enkeltvis, men udgør ${Math.round((smaakoebSum / total) * 100)}% af dit forbrug. Det er typisk det letteste sted at spare uden at ændre livsstil.`,
      type: 'info',
    });
  }

  // Regel 3: abonnementer — penge der løber, uanset om de bruges.
  const abo = udgifter.filter((u) => u.kategori === 'Abonnementer');
  const aboSum = samletForbrug(abo);
  if (aboSum > 0) {
    raad.push({
      id: 'abonnementer',
      vaegt: aboSum * 12,
      titel: `Dine abonnementer koster ${kr(aboSum * 12)} kr om året`,
      tekst: `${abo.length} abonnementer trækker ${kr(aboSum)} kr hver måned (${abo.map((a) => a.tekst).join(', ')}). Gennemgå om du bruger dem alle — opsigelse er en engangsbeslutning med varig effekt.`,
      type: 'info',
    });
  }

  // Regel 4: gentagne køb samme sted.
  const antalPrTekst = {};
  udgifter.forEach((u) => {
    const n = u.tekst.trim().toLowerCase();
    antalPrTekst[n] = antalPrTekst[n] || { antal: 0, sum: 0, navn: u.tekst };
    antalPrTekst[n].antal += 1;
    antalPrTekst[n].sum += u.beloeb;
  });
  const gentagelse = Object.values(antalPrTekst)
    .filter((x) => x.antal >= 3)
    .sort((a, b) => b.sum - a.sum)[0];
  if (gentagelse) {
    raad.push({
      id: 'gentagelse',
      vaegt: gentagelse.sum,
      titel: `"${gentagelse.navn}" ${gentagelse.antal} gange = ${kr(gentagelse.sum)} kr`,
      tekst: `Det er en vane, ikke en enkeltbeslutning. Halverer du antallet, sparer du ca. ${kr(gentagelse.sum / 2)} kr om måneden.`,
      type: 'info',
    });
  }

  // Rangér efter hvor meget der er at hente, og vis de tre vigtigste.
  return raad.sort((a, b) => (b.vaegt || 0) - (a.vaegt || 0)).slice(0, 3);
}

export { kr };
