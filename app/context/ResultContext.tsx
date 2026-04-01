"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ResultContextType {
  result: string | null;
  setResult: (result: string | null) => void;
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export function ResultProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<string | null>(null);

  return (
    <ResultContext.Provider value={{ result, setResult }}>
      {children}
    </ResultContext.Provider>
  );
}

export function useResult() {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error("useResult must be used within a ResultProvider");
  }
  return context;
}
