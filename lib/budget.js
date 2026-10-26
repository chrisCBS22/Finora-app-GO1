import { samletForbrug, kr } from './analyse';

// Udgifter der hører til den måned, vi er i nu (datoformat 'ÅÅÅÅ-MM-DD').
export function denneMaaned(udgifter, nu = new Date()) {
  const prefix = nu.toISOString().slice(0, 7); // fx '2026-10'
  return udgifter.filter((u) => u.dato && u.dato.startsWith(prefix));
}

// Status for budgettet: hvor meget er brugt, hvor meget er tilbage, og
// hvor meget kan man bruge pr. dag resten af måneden.
export function budgetStatus(udgifter, budget, nu = new Date()) {
  const brugt = samletForbrug(denneMaaned(udgifter, nu));
  const dageIMaaned = new Date(nu.getFullYear(), nu.getMonth() + 1, 0).getDate();
  const dagNr = nu.getDate();
  const dageTilbage = dageIMaaned - dagNr + 1; // inkl. i dag

  if (!budget || budget <= 0) {
    return { harBudget: false, brugt, dageTilbage };
  }

  const rest = budget - brugt;
  return {
    harBudget: true,
    budget,
    brugt,
    rest,
    andelBrugt: brugt / budget,
    andelAfMaaned: dagNr / dageIMaaned,
    prDag: rest > 0 ? rest / dageTilbage : 0,
    dageTilbage,
  };
}

// Ét råd om budgettet, i samme format som rådene fra analyse.js,
// så det kan vises i samme liste. Returnerer null uden budget.
export function budgetRaad(udgifter, budget, nu = new Date()) {
  const s = budgetStatus(udgifter, budget, nu);
  if (!s.harBudget) return null;

  if (s.rest < 0) {
    return {
      id: 'budget-over',
      titel: `Du er ${kr(-s.rest)} kr over budget`,
      tekst: `Du har brugt ${kr(s.brugt)} kr af et budget på ${kr(s.budget)} kr. Der er ${s.dageTilbage} dage tilbage af måneden.`,
      type: 'advarsel',
    };
  }

  const procentBrugt = Math.round(s.andelBrugt * 100);
  const procentMaaned = Math.round(s.andelAfMaaned * 100);

  // Bruger man hurtigere, end måneden går, er det værd at advare tidligt.
  if (s.andelBrugt > s.andelAfMaaned + 0.1) {
    return {
      id: 'budget-tempo',
      titel: `${procentBrugt}% af budgettet er brugt — men kun ${procentMaaned}% af måneden`,
      tekst: `Holder du tempoet, rammer du loftet før månedens udgang. Du har ${kr(s.rest)} kr tilbage, svarende til ca. ${kr(s.prDag)} kr om dagen.`,
      type: 'advarsel',
    };
  }

  return {
    id: 'budget-ok',
    titel: `Du er på sporet: ${kr(s.rest)} kr tilbage`,
    tekst: `Du har brugt ${procentBrugt}% af budgettet, og ${procentMaaned}% af måneden er gået. Du kan bruge ca. ${kr(s.prDag)} kr om dagen resten af måneden.`,
    type: 'info',
  };
}
