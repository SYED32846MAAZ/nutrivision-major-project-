"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [result, setResult] = useState("Loading...");

  useEffect(() => {
    const stored = localStorage.getItem("result");

    console.log("STORED:", stored); // 👈 this helps debug

    if (stored) {
      const data = JSON.parse(stored);
      console.log("PARSED:", data);

      setResult(data.result || "No result found");
    } else {
      setResult("No data found");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Analysis Results</h1>

      <div className="bg-white text-black p-6 rounded-lg shadow-md max-w-md text-center">
        {result}
      </div>
    </div>
  );
}