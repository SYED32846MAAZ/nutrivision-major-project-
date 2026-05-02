"use client";

import { useResult } from "../context/ResultContext";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileDown, 
  RefreshCcw, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Dna, 
  ChevronRight,
  Sparkles,
  MessageSquare
} from "lucide-react";

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

function CommandCard({ title, content, icon: Icon, color }: { title: string, content: string, icon: any, color: 'green' | 'blue' | 'yellow' }) {
  const colorMap = {
    green: 'border-green-500/20 bg-green-500/5 text-green-400 icon-green-500',
    blue: 'border-blue-500/20 bg-blue-500/5 text-blue-400 icon-blue-500',
    yellow: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400 icon-yellow-500',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-6 rounded-3xl border ${colorMap[color].split(' ')[0]} ${colorMap[color].split(' ')[1]} backdrop-blur-xl relative overflow-hidden group`}
    >
      <div className="relative z-10 flex gap-5 items-start">
        <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${colorMap[color].split(' ')[2]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{title}</h4>
          <p className="text-sm font-bold text-white leading-relaxed italic">{content}</p>
        </div>
      </div>
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-20 h-20 -mr-8 -mt-8" />
      </div>
    </motion.div>
  );
}

export default function ResultsPage() {
  const { result, imageUrl } = useResult();
  const router = useRouter();
  const [isDemo, setIsDemo] = useState(false);
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

    setIsDemo(result.includes("DEMO_MODE: TRUE"));

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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center py-12 px-6 font-sans selection:bg-green-500/30 overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl space-y-8">
        
        {/* HEADER / VERDICT */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className={`flex items-center gap-4 px-6 py-3 glass-panel rounded-full border-white/5 ${isDemo ? 'border-yellow-500/30' : ''}`}
           >
              <div className={`w-2 h-2 rounded-full ${isDemo ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-green-500 shadow-[0_0_10px_#22c55e]'} animate-pulse`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDemo ? 'text-yellow-500' : 'text-green-500'}`}>
                {isDemo ? 'Neural Core Overloaded - Demo Mode Active' : 'Neural Sync Active'}
              </span>
           </motion.div>

           <div className="flex gap-4">
              <button 
                onClick={() => router.push('/coach')}
                className="flex items-center gap-2 px-6 py-3 glass-panel rounded-full border-white/5 hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest text-emerald-400 group"
              >
                <MessageSquare className="w-4 h-4" />
                Consult AI Coach
              </button>
              <button 
                onClick={() => window.print()}
                className="p-3 glass-panel rounded-full border-white/5 hover:bg-white/5 transition-all"
              >
                <FileDown className="w-5 h-5 text-gray-400" />
              </button>
           </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: IMAGE & CORE STATS */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Image Preview Card */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="relative group h-[400px] rounded-[3rem] overflow-hidden border border-white/10 glass-panel"
               >
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="Scanned Food" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                       <Zap className="w-12 h-12 text-white/20 animate-pulse" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                     <div className="space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-green-500">Source Capture</span>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Input Frame #721</h3>
                     </div>
                     <div className="p-3 glass-panel rounded-2xl border-white/10 backdrop-blur-md">
                        <Sparkles className="w-5 h-5 text-green-400" />
                     </div>
                  </div>
               </motion.div>

               {/* Health Score & Stats Matrix */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="glass-card p-10 rounded-[3rem] flex flex-col justify-between"
               >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <h2 className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em]">Biometric Grade</h2>
                          <div className="flex items-center gap-2">
                             <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">{stats.foodName}</h1>
                          </div>
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <span>Health Index</span>
                          <span className="text-white">{stats.healthScore * 10}%</span>
                       </div>
                       <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.healthScore * 10}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-8">
                     <div className="p-5 glass-panel rounded-3xl border-white/5 flex flex-col items-center">
                        <span className="text-2xl font-black text-white italic">{stats.calories}</span>
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">Calories</span>
                     </div>
                     <div className="p-5 glass-panel rounded-3xl border-white/5 flex flex-col items-center">
                        <span className="text-2xl font-black text-white italic">{stats.protein}g</span>
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">Protein</span>
                     </div>
                     <div className="p-5 glass-panel rounded-3xl border-white/5 flex flex-col items-center">
                        <span className="text-2xl font-black text-white italic">{stats.carbs}g</span>
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">Carbs</span>
                     </div>
                     <div className="p-5 glass-panel rounded-3xl border-white/5 flex flex-col items-center">
                        <span className="text-2xl font-black text-white italic">{stats.fats}g</span>
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">Fats</span>
                     </div>
                  </div>
               </motion.div>
            </div>

            {/* COMMAND CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <CommandCard 
                 title="Modified Formula" 
                 content={stats.modifiedFormula} 
                 icon={ShieldCheck} 
                 color="green" 
               />
               <CommandCard 
                 title="Metabolic Window" 
                 content={stats.metabolicWindow} 
                 icon={Clock} 
                 color="blue" 
               />
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILED ANALYSIS */}
          <div className="lg:col-span-4 space-y-8">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="glass-card p-10 rounded-[3rem] h-full flex flex-col"
             >
                <div className="flex items-center justify-between mb-10">
                   <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Protocol Output</h2>
                   <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                      <Dna className="w-3 h-3 text-green-400" />
                      <span className="text-[8px] font-black text-green-400 uppercase tracking-widest italic">Biometrics Synced</span>
                   </div>
                </div>

                <div className="flex-1 space-y-8">
                   <div className="prose prose-invert prose-sm max-w-none">
                     <ReactMarkdown components={{
                       h3: ({node, ...props}) => <h3 className="text-lg font-black italic uppercase tracking-tighter text-white mb-4 mt-8 flex items-center gap-2" {...props} />,
                       p: ({node, ...props}) => <p className="text-gray-400 font-medium leading-relaxed mb-4" {...props} />,
                       li: ({node, ...props}) => <li className="text-gray-400 font-medium leading-relaxed mb-2 list-none flex items-start gap-3" {...props}>
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                         {props.children}
                       </li>
                     }}>
                        {result.split('\n').filter(line => !/^(FOOD_NAME|CALORIES|PROTEIN|CARBS|FATS|HEALTH_SCORE|MODIFIED_FORMULA|METABOLIC_WINDOW):/i.test(line)).join('\n')}
                     </ReactMarkdown>
                   </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 space-y-6">
                   <button 
                     onClick={() => router.push('/analyze')}
                     className="w-full py-5 glass-panel rounded-3xl border-white/10 text-white text-xs font-black uppercase tracking-[0.3em] italic hover:bg-white/5 transition-all flex items-center justify-center gap-3 group"
                   >
                     <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                     New Scan Sequence
                   </button>
                   <p className="text-[8px] text-gray-700 font-black uppercase text-center tracking-[0.5em]">Neural Encryption Key: 0x721_AF_99</p>
                </div>
             </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
}