"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ResultContextType {
  result: string | null;
  imageUrl: string | null;
  setResult: (result: string | null) => void;
  setImageUrl: (url: string | null) => void;
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export function ResultProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <ResultContext.Provider value={{ result, imageUrl, setResult, setImageUrl }}>
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
