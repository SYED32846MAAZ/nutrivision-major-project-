'use client';

import { motion } from 'framer-motion';
import { Activity, Cpu, Zap, Activity as Pulse, Target, Shield } from 'lucide-react';

interface HudStatProps {
  label: string;
  value: string;
  icon: any;
  color: string;
}

function HudStat({ label, value, icon: Icon, color }: HudStatProps) {
  return (
    <div className="flex items-center gap-3 group">
      <div className={`p-2 rounded-lg ${
        color === 'green' ? 'bg-green-500/10 border-green-500/20 group-hover:bg-green-500/20' : 
        'bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20'
      } border transition-all`}>
        <Icon className={`w-4 h-4 ${color === 'green' ? 'text-green-400' : 'text-emerald-400'}`} />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black text-white italic tracking-tighter uppercase">{value}</p>
      </div>
    </div>
  );
}

export function BiometricHud({ side }: { side: 'left' | 'right' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -100 : 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`hidden lg:flex flex-col gap-8 p-8 glass-panel rounded-[2rem] border-white/5 backdrop-blur-3xl fixed ${
        side === 'left' ? 'left-10' : 'right-10'
      } top-1/2 -translate-y-1/2 z-30 w-64`}
    >
      <div className="space-y-1">
        <h3 className="text-xs font-black text-green-500 uppercase tracking-[0.3em] italic">
          {side === 'left' ? 'Metabolic Matrix' : 'Neural Analysis'}
        </h3>
        <div className="h-1 w-12 bg-green-500" />
      </div>

      <div className="space-y-6">
        {side === 'left' ? (
          <>
            <HudStat label="Metabolic Age" value="22 Years" icon={Zap} color="green" />
            <HudStat label="Vitality Sync" value="98.4%" icon={Pulse} color="emerald" />
            <HudStat label="Glucose Var" value="Optimal" icon={Shield} color="green" />
            
            {/* Pulsing Vital Sign Visualization */}
            <div className="pt-4 border-t border-white/5">
              <div className="flex items-end gap-1 h-12">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: [10, Math.random() * 40 + 10, 10],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: i * 0.1 
                    }}
                    className="w-full bg-green-500/40 rounded-full"
                  />
                ))}
              </div>
              <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-2 text-center">Real-time Bio-Stream</p>
            </div>
          </>
        ) : (
          <>
            <HudStat label="Neural Load" value="14.2%" icon={Cpu} color="green" />
            <HudStat label="Scan Precision" value="99.98%" icon={Target} color="emerald" />
            <HudStat label="Active Nodes" value="1,024" icon={Activity} color="green" />

            {/* Radar/Scanning Visualization */}
            <div className="pt-4 border-t border-white/5 flex flex-col items-center">
              <div className="relative w-20 h-20 rounded-full border border-green-500/20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-t-2 border-green-500/50"
                />
                <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`absolute w-full h-full border border-green-500/10 rounded-full scale-${(i+1)*25}`} />
                ))}
              </div>
              <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-2 text-center">Neural Core Tracking</p>
            </div>
          </>
        )}
      </div>

      <div className="pt-4 border-t border-white/5">
        <div className="flex justify-between items-center text-[8px] font-black text-gray-500 uppercase tracking-widest">
          <span>Status</span>
          <span className="text-green-500 animate-pulse">Operational</span>
        </div>
      </div>
    </motion.div>
  );
}
