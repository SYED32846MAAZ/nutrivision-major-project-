"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResult } from "../context/ResultContext";
import { Button } from "@/app/components/ui/neon-button";

const loadingPhrases = [
  "Initializing AI vision matrix...",
  "Scanning food architecture...",
  "Calculating macromolecular structures...",
  "Predicting long-term health constraints...",
  "Structuring preventative lifepaths...",
  "Finalizing nutritional assessment..."
];

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  
  const router = useRouter();
  const { setResult } = useResult();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTextIdx((prev) => (prev + 1 < loadingPhrases.length ? prev + 1 : prev));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setLoadingTextIdx(0);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data?.error || `Analysis failed. Support Code: ${res.status}`);
      }

      setResult(data.result);
      router.push("/results");
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Something went extremely wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex items-center justify-center bg-gray-950 overflow-hidden">
      
      {/* Dynamic Background Noise & Gradient Glow */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] mix-blend-screen mix-blend-mode"></div>
         <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-900/40 rounded-full blur-[150px] mix-blend-screen mix-blend-mode"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4 py-12 flex flex-col items-center">
        
        <div className="text-center mb-10 space-y-4">
           <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-green-100 to-green-600 tracking-tight">
             Neural Food Scanner
           </h1>
           <p className="text-gray-400 font-medium max-w-md mx-auto text-sm md:text-base">
             Upload a clear image of your meal to activate the predictive health engine and extract exact macronutrients.
           </p>
        </div>

        <div className={`w-full bg-white/5 backdrop-blur-2xl border ${error ? 'border-red-500/50' : 'border-white/10'} p-8 rounded-[2rem] shadow-2xl transition-all duration-500`}>
          
          {/* Internal Upload Box */}
          <div className="relative border-2 border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group group-hover:border-green-500/50 cursor-pointer overflow-hidden min-h-[300px]">
            
            <input
              type="file"
              accept="image/*"
              disabled={isLoading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50 disabled:cursor-not-allowed"
              onChange={handleFile}
            />

            {preview ? (
              <div className="absolute inset-0 w-full h-full z-10 p-2">
                 <img src={preview} alt="Upload Preview" className={`w-full h-full object-cover rounded-xl shadow-md transition-all duration-700 ${isLoading ? 'opacity-30 blur-sm scale-110' : 'opacity-100'}`} />
                 
                 {/* Scanning Animation Layer */}
                 {isLoading && (
                   <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                      <div className="w-24 h-24 border-4 border-green-500/30 border-t-green-400 rounded-full animate-spin shadow-[0_0_15px_rgba(74,222,128,0.5)]"></div>
                      <div className="mt-6 text-green-400 font-bold bg-black/60 px-4 py-2 rounded-lg text-sm tracking-widest uppercase animate-pulse backdrop-blur-md border border-green-500/30 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                         {loadingPhrases[loadingTextIdx]}
                      </div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-green-400/80 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                   </div>
                 )}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-4 z-10 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(74,222,128,0.1)]">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-400">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                   </svg>
                </div>
                <div>
                   <span className="text-white font-bold text-lg block">Select an image to analyze</span>
                   <span className="text-gray-400 text-sm mt-1">PNG, JPG or WEBP (Max 4MB)</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-400 text-sm mt-4 p-4 bg-red-950/40 rounded-xl w-full text-center border border-red-500/20 font-medium">
              ⚠️ {error}
            </div>
          )}

          <div className="mt-6 flex gap-4">
             {preview && !isLoading && (
               <Button 
                  onClick={() => { setFile(null); setPreview(null); }}
                  variant="ghost"
                  className="text-white border-white/20 hover:text-white"
               >
                 Cancel
               </Button>
             )}
             
             <Button
               onClick={handleSubmit}
               disabled={!file || isLoading}
               neon={!isLoading}
               size="lg"
               className="flex-1 tracking-wide uppercase disabled:opacity-50"
             >
               {isLoading ? "ENGINE RUNNING" : "ACTIVATE AI ANALYSIS"}
             </Button>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}