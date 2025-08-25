import React, { createContext, useContext, useMemo, useState } from 'react';

type LayoutEvents = {
  version: number;
  bump: () => void;
};

const LayoutEventsContext = createContext<LayoutEvents>({ version: 0, bump: () => {} });

export function LayoutEventsProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);
  const value = useMemo<LayoutEvents>(() => ({
    version,
    bump: () => setVersion((v) => (v + 1) % 1_000_000),
  }), [version]);
  return (
    <LayoutEventsContext.Provider value={value}>{children}</LayoutEventsContext.Provider>
  );
}

export function useLayoutEvents() {
  return useContext(LayoutEventsContext);
}


