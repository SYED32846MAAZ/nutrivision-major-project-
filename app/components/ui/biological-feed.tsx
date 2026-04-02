'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MESSAGES = [
  "Inference Node #721: Protein optimization detected.",
  "Neural Matrix: Decoding complex lipid structures...",
  "Biometric Sync: Baseline caloric threshold matched.",
  "Predictive Engine: Mapping metabolic pathways...",
  "AI Core: Fiber density within optimal range.",
  "Bio-Sensor: Glucose variance minimal.",
  "System: Neutralizing dietary inflammatory markers..."
];

export function BiologicalFeed() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 px-6 py-3 glass-panel rounded-full border-green-500/20 max-w-fit mx-auto lg:mx-0">
      <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
      <motion.p
        key={index}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        className="text-[10px] font-black text-green-400 uppercase tracking-widest font-mono"
      >
        {MESSAGES[index]}
      </motion.p>
    </div>
  );
}
