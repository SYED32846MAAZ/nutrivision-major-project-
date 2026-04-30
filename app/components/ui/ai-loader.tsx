'use client'

import { motion, AnimatePresence } from "framer-motion"
import { SplineScene } from "./splite"

interface AILoaderProps {
  isLoading: boolean
  text?: string
}

export function AILoader({ isLoading, text = "Analyzing your food with AI..." }: AILoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          <div className="relative w-full h-[300px] md:h-[500px]">
             <SplineScene 
               scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
               className="w-full h-full"
             />
          </div>
          
          <div className="absolute bottom-20 text-center">
            <motion.h2 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-2xl md:text-3xl font-black text-green-500 tracking-tighter uppercase italic drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
            >
              {text}
            </motion.h2>
            <p className="mt-2 text-white/40 text-sm font-mono tracking-widest uppercase">
              Neural Engine Running...
            </p>
          </div>
          
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_70%)]" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
