// En fælles liste af udgifter, som alle screens kan læse og skrive til.
import React, { createContext, useContext, useState } from 'react';
import seed from '../data/seed';

const UdgiftContext = createContext(null);

export function UdgiftProvider({ children }) {
  const [udgifter, setUdgifter] = useState(seed);

  const tilfoejUdgift = (udgift) => {
    setUdgifter((gamle) => [
      { ...udgift, id: Date.now().toString() },
      ...gamle,
    ]);
  };

  const sletUdgift = (id) => {
    setUdgifter((gamle) => gamle.filter((u) => u.id !== id));
  };

  return (
    <UdgiftContext.Provider value={{ udgifter, tilfoejUdgift, sletUdgift }}>
      {children}
    </UdgiftContext.Provider>
  );
}

export function useUdgifter() {
  const ctx = useContext(UdgiftContext);
  if (!ctx) throw new Error('useUdgifter skal bruges inde i en UdgiftProvider');
  return ctx;
}
