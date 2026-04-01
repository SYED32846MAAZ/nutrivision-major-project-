"use client";

import { useResult } from "../context/ResultContext";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResultsPage() {
  const { result } = useResult();
  const router = useRouter();

  // If there's no result, instantly redirect back to the analyze page
  useEffect(() => {
    if (!result) {
      router.replace("/analyze");
    }
  }, [result, router]);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mb-4"></div>
        <p className="text-gray-500">Retrieving result...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-green-50 to-green-100">
      <h1 className="text-4xl font-extrabold text-green-700 mb-8 drop-shadow-sm">
        Nutrition Breakdown
      </h1>

      <div className="bg-white text-gray-800 p-8 rounded-3xl shadow-xl shadow-green-900/5 max-w-xl w-full border border-green-100">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 text-green-800" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-6 mb-3 text-green-700 border-b pb-2" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-green-600" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-600" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2 text-gray-600" {...props} />,
            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
            p: ({ node, ...props }) => <p className="mb-4 text-gray-600 leading-relaxed" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
          }}
        >
          {result}
        </ReactMarkdown>
      </div>

      <Link
        href="/analyze"
        className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-green-600/30 transform hover:-translate-y-1"
      >
        Analyze Another Meal
      </Link>
    </div>
  );
}