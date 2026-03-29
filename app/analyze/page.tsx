"use client";

import { useState } from "react";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // ✅ Save result properly
      localStorage.setItem("result", JSON.stringify(data));

      // ✅ Redirect to results page
      window.location.href = "/results";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Upload Food Image</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Analyze
      </button>
    </div>
  );
}