// UdgiftContext.js — én fælles liste af udgifter, som alle screens kan læse og skrive til.

import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import seed from '../data/seed';
import { NOEGLER, hent, gem, sletAlt } from '../lib/lager';
import { colors } from '../styles/theme';
import v2 from '../styles/v2Styles';

const UdgiftContext = createContext(null);

// Flytter startdata ind i indeværende måned, så Oversigt og Budget ikke er
// tomme første gang appen åbnes. Dag i måneden bevares (men aldrig i fremtiden).
function startdataDenneMaaned() {
  const nu = new Date();
  const aarMaaned = nu.toISOString().slice(0, 7);
  return seed.map((u) => {
    const dag = Math.min(parseInt(u.dato.slice(8, 10), 10), nu.getDate());
    return { ...u, dato: `${aarMaaned}-${String(dag).padStart(2, '0')}` };
  });
}

export function UdgiftProvider({ children }) {
  const [udgifter, setUdgifter] = useState([]);
  const [budget, setBudget] = useState(null);
  const [indlaest, setIndlaest] = useState(false);

  // 1) Hent gemte data én gang, når appen starter.
  useEffect(() => {
    (async () => {
      const gemteUdgifter = await hent(NOEGLER.udgifter);
      const gemtBudget = await hent(NOEGLER.budget);
      setUdgifter(gemteUdgifter ?? startdataDenneMaaned());
      setBudget(gemtBudget);
      setIndlaest(true);
    })();
  }, []);

  // 2) Gem hver gang listen eller budgettet ændrer sig.
  //    Vi venter til data er indlæst, ellers ville den tomme startliste
  //    overskrive det, der allerede var gemt.
  useEffect(() => {
    if (indlaest) gem(NOEGLER.udgifter, udgifter);
  }, [udgifter, indlaest]);

  useEffect(() => {
    if (indlaest) gem(NOEGLER.budget, budget);
  }, [budget, indlaest]);

  const tilfoejUdgift = (udgift) => {
    setUdgifter((gamle) => [
      { ...udgift, id: Date.now().toString() },
      ...gamle,
    ]);
  };

  const sletUdgift = (id) => {
    setUdgifter((gamle) => gamle.filter((u) => u.id !== id));
  };


  const gemBudget = (beloeb) => setBudget(beloeb);

  //sletter alt gemt og starter forfra med startdata.
  const nulstilData = async () => {
    await sletAlt();
    setUdgifter(startdataDenneMaaned());
    setBudget(null);
  };

  // Vis en spinner, til data er hentet — ellers blinker tomme screens.
  if (!indlaest) {
    return (
      <View style={v2.loader}>
        <ActivityIndicator size="large" color={colors.primaer} />
      </View>
    );
  }

  return (
    <UdgiftContext.Provider
      value={{ udgifter, tilfoejUdgift, sletUdgift, budget, gemBudget, nulstilData }}
    >
      {children}
    </UdgiftContext.Provider>
  );
}

export function useUdgifter() {
  const ctx = useContext(UdgiftContext);
  if (!ctx) throw new Error('useUdgifter skal bruges inde i en UdgiftProvider');
  return ctx;
}
