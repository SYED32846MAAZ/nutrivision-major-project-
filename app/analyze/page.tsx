"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResult } from "../context/ResultContext";
import { Button } from "@/app/components/ui/neon-button";
import { AILoader } from "@/app/components/ui/ai-loader";

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
      <AILoader isLoading={isLoading} text={loadingPhrases[loadingTextIdx]} />
      
      {/* Dynamic Background Noise & Gradient Glow */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] mix-blend-screen mix-blend-mode"></div>
         <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-900/40 rounded-full blur-[150px] mix-blend-screen mix-blend-mode"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4 py-12 flex flex-col items-center">
        
        <div className="text-center mb-10 space-y-4">
           <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-green-100 to-green-600 tracking-tight italic uppercase">
             Neural Engine
           </h1>
           <p className="text-gray-400 font-medium max-w-md mx-auto text-sm md:text-base">
             Upload a clear image of your meal to activate the predictive health engine.
           </p>
        </div>

        <div className={`w-full bg-white/5 backdrop-blur-2xl border ${error ? 'border-red-500/50' : 'border-white/10'} p-8 rounded-[3rem] shadow-2xl transition-all duration-500`}>
          
          <div className="relative border-2 border-dashed border-white/20 rounded-[2rem] p-8 flex flex-col items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group group-hover:border-green-500/50 cursor-pointer overflow-hidden min-h-[400px]">
            
            <input
              type="file"
              accept="image/*"
              disabled={isLoading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50 disabled:cursor-not-allowed"
              onChange={handleFile}
            />

            {preview ? (
              <div className="absolute inset-0 w-full h-full z-10 p-4">
                 <img 
                    src={preview} 
                    alt="Upload Preview" 
                    className="w-full h-full object-cover rounded-[1.5rem] shadow-md transition-all duration-1000" 
                  />
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-4 z-10 pointer-events-none">
                <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-transform duration-500">
                   <Camera className="w-10 h-10 text-green-400" />
                </div>
                <div>
                   <span className="text-white font-black text-xl block tracking-tighter italic uppercase">Select Frame</span>
                   <span className="text-gray-400 text-xs mt-1 font-mono uppercase tracking-widest">PNG, JPG, WEBP // MAX 4MB</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-5 bg-red-950/40 rounded-2xl w-full border border-red-500/30 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/40">
                    <span className="text-red-400 font-black text-[10px]">!</span>
                 </div>
                 <span className="text-red-400 font-black text-[10px] uppercase tracking-[0.2em]">Engine Failure Detected</span>
              </div>
              <p className="text-red-200/80 text-sm font-medium leading-relaxed italic">
                "{error}"
              </p>
            </div>
          )}

          <div className="mt-6 flex gap-4">
             {preview && !isLoading && (
               <Button 
                  onClick={() => { setFile(null); setPreview(null); }}
                  variant="ghost"
                  className="text-white border-white/20 hover:text-white rounded-[1.5rem]"
               >
                 Cancel
               </Button>
             )}
             
             <Button
               onClick={handleSubmit}
               disabled={!file || isLoading}
               neon={!isLoading}
               size="lg"
               className="flex-1 tracking-widest uppercase italic font-black rounded-[1.5rem] disabled:opacity-50"
             >
               {isLoading ? "Neural Processing..." : "Activate Analysis"}
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
  );
}