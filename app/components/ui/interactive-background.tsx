'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

export function InteractiveBackground() {
  const mouseX = useSpring(0, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to percentages
      mouseX.set((e.clientX / window.innerWidth) * 100);
      mouseY.set((e.clientY / window.innerHeight) * 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div 
      className="fixed inset-0 z-0 pointer-events-none opacity-40 blur-[120px]"
      style={{
        background: `
          radial-gradient(at 0% 0%, hsla(142, 69%, 58%, 0.15) 0px, transparent 50%),
          radial-gradient(at var(--x, 50%) var(--y, 0%), hsla(160, 100%, 35%, 0.1) 0px, transparent 50%),
          radial-gradient(at 100% 0%, hsla(142, 69%, 58%, 0.15) 0px, transparent 50%),
          radial-gradient(at 0% 100%, hsla(160, 100%, 35%, 0.1) 0px, transparent 50%),
          radial-gradient(at 50% 100%, hsla(142, 69%, 58%, 0.15) 0px, transparent 50%),
          radial-gradient(at 100% 100%, hsla(160, 100%, 35%, 0.1) 0px, transparent 50%)
        `,
      } as any}
    >
      <motion.div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at var(--x) var(--y), hsla(142, 69%, 58%, 0.2) 0%, transparent 60%)`,
          '--x': mouseX.to(v => `${v}%`),
          '--y': mouseY.to(v => `${v}%`),
        } as any}
      />
    </motion.div>
  );
}
