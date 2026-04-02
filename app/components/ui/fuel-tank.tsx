'use client';

import { motion } from 'framer-motion';

interface FuelTankProps {
  current: number;
  target: number;
  label: string;
  unit: string;
  color: string;
}

export function FuelTank({ current, target, label, unit, color }: FuelTankProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className="relative w-24 h-64 bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Liquid Fill */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 2, ease: "circOut" }}
          className="absolute bottom-0 left-0 right-0"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 40px ${color}44`
          }}
        >
          {/* Wave Effect */}
          <motion.div 
            animate={{ x: [-100, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-[200%] h-4 opacity-30"
            style={{ 
              background: `linear-gradient(90deg, transparent, white, transparent)`,
              transform: 'translateY(-50%)'
            }}
          />
        </motion.div>

        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
        
        {/* Measurement Marks */}
        <div className="absolute inset-y-4 right-2 flex flex-col justify-between opacity-20 text-[8px] font-bold text-white">
          <span>MAX</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>MIN</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-xl font-black text-white leading-none">
          {current}
          <span className="text-[10px] text-gray-400 ml-1 font-bold">{unit}</span>
        </p>
        <div className="mt-2 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
          Target: {target}
        </div>
      </div>
    </div>
  );
}
