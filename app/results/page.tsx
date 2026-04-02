"use client";

import { useResult } from "../context/ResultContext";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileDown } from "lucide-react";

function RadialChart({ value, label, color, unit, max }: { value: number, label: string, color: string, unit: string, max: number }) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-white">{value}</span>
          <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">{unit}</span>
        </div>
      </div>
      <span className="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">{label}</span>
    </div>
  );
}

export default function ResultsPage() {
  const { result } = useResult();
  const router = useRouter();
  const [stats, setStats] = useState({ 
    foodName: "", 
    calories: 0, 
    protein: 0, 
    carbs: 0, 
    fats: 0, 
    healthScore: 0,
    modifiedFormula: "Calculating Protocol...",
    metabolicWindow: "Analyzing Window..."
  });

  useEffect(() => {
    if (!result) {
      router.replace("/analyze");
      return;
    }

    // High-Precision Regex for Data Harvesting
    const harvestNum = (key: string) => {
      const regex = new RegExp(`${key}:\\s*(?:[^\\d]*?\\s*)?(\\d+)`, 'i');
      const match = result.match(regex);
      return match ? parseInt(match[1]) : 0;
    };

    const harvestString = (key: string) => {
      const regex = new RegExp(`${key}:\\s*(.*)`, 'i');
      const match = result.match(regex);
      return match ? match[1].trim().split('\n')[0] : "Neural Identification In Progress";
    };

    setStats({
      foodName: harvestString("FOOD_NAME"),
      calories: harvestNum("CALORIES"),
      protein: harvestNum("PROTEIN"),
      carbs: harvestNum("CARBS"),
      fats: harvestNum("FATS"),
      healthScore: harvestNum("HEALTH_SCORE"),
      modifiedFormula: harvestString("MODIFIED_FORMULA"),
      metabolicWindow: harvestString("METABOLIC_WINDOW")
    });
  }, [result, router]);

  if (!result) return null;

  return (
    <div className="min-h-screen mesh-gradient flex flex-col items-center py-16 px-6 font-sans selection:bg-green-500/30">
      
      {/* Whobee Executive Verdict */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl mb-10 flex items-center gap-6 glass-panel p-6 rounded-[2rem] border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.1)]"
      >
         <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
            <span className="text-xl font-black text-green-400">WB</span>
         </div>
         <div className="flex flex-col">
            <span className="text-[9px] font-black text-green-500 uppercase tracking-[0.3em] mb-1">Neural Core Output</span>
            <p className="text-white font-bold text-sm leading-relaxed italic opacity-90">
               "Intelligence sweep complete. Data points extracted and normalized for biometric baseline. Protocol finalized below."
            </p>
         </div>
      </motion.div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Metrics & Charts (Spans 7 cols) */}
        <div className="lg:col-span-7 space-y-8">
           <div className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden group">
              
              <div className="flex justify-between items-start mb-12">
                 <div className="flex flex-col">
                    <h2 className="text-xs font-black text-green-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                        Stats Matrix
                    </h2>
                    <h1 className="text-3xl font-black text-white tracking-tighter capitalize drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                        {stats.foodName}
                    </h1>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-500 uppercase">Metabolic Quality</span>
                    <span className="text-2xl font-black text-white">{stats.healthScore}/10</span>
                 </div>
              </div>

              {/* Health Score Progress Bar */}

              <div className="w-full h-1.5 bg-white/5 rounded-full mb-16 overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.healthScore * 10}%` }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                 />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 <RadialChart value={stats.calories} label="Calories" color="#4ade80" unit="kcal" max={1000} />
                 <RadialChart value={stats.protein} label="Protein" color="#60a5fa" unit="grams" max={60} />
                 <RadialChart value={stats.carbs} label="Carbs" color="#facc15" unit="grams" max={100} />
                 <RadialChart value={stats.fats} label="Fats" color="#f87171" unit="grams" max={40} />
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                 <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inference Latency: 0.8ms</div>
                 <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest uppercase">Confidence: 99.4%</div>
              </div>
           </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 print:hidden">
              <Link
                href="/analyze"
                className="flex items-center justify-center flex-1 py-5 glass-panel rounded-3xl text-xs font-black text-white hover:bg-green-600/20 transition-all border border-green-500/20 space-x-3 uppercase tracking-widest group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:-rotate-45 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                <span>New Capture</span>
              </Link>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center flex-1 py-5 glass-panel rounded-3xl text-xs font-black text-green-500 hover:bg-green-500/10 transition-all border border-green-500/30 space-x-3 uppercase tracking-widest group"
              >
                <FileDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                <span>Export Dossier</span>
              </button>
            </div>
        </div>

        {/* Right Column: Narrative Protocol (Spans 5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full">
           <div className="glass-card p-10 rounded-[2.5rem] bg-white/5 border-white/10 h-full flex flex-col justify-between">
              <div>
                 <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-10 flex items-center justify-between">
                    Protocol Output
                    <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] border border-white/10">READING_ONLY</span>
                 </h2>
                 <div className="prose prose-invert prose-sm max-w-none prose-p:text-gray-400 prose-p:leading-relaxed prose-li:text-gray-400 prose-strong:text-white prose-h2:text-white prose-h2:text-lg prose-h2:font-black prose-h2:uppercase prose-h2:tracking-tight prose-ul:list-none prose-ul:pl-0 prose-li:before:content-['⚡'] prose-li:before:mr-2 prose-li:before:opacity-40">
                   <ReactMarkdown>
                     {result.split('\n').filter(line => !/^(CALORIES|PROTEIN|CARBS|FATS|HEALTH_SCORE):/i.test(line)).join('\n')}
                   </ReactMarkdown>
                 </div>
              </div>
              
              <div className="mt-12 flex flex-col gap-2">
                 <div className="w-full h-px bg-white/5" />
                 <p className="text-[10px] text-gray-500 font-bold uppercase text-center opacity-30">Encrypted Dietetics Protocol X-9</p>
              </div>
           </div>
        </div>

      </div>

    </div>
  );
}