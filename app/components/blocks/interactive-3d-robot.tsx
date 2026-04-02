'use client';

import { Suspense, lazy } from 'react';
const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  return (
    <Suspense
      fallback={
        <div className={`w-full h-full flex items-center justify-center bg-gray-950 text-white ${className}`}>
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
             <p className="text-xs font-mono text-green-500/50 uppercase tracking-widest">Waking Whobee...</p>
          </div>
        </div>
      }
    >
      <div className="hidden lg:block w-full h-full">
        <Spline
          scene={scene}
          className={className} 
        />
      </div>
      <div className="lg:hidden w-full h-full flex items-center justify-center">
         <div className="relative w-48 h-48">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-[60px] animate-pulse"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
               <div className="w-16 h-16 border border-green-500/30 rounded-2xl bg-white/5 backdrop-blur-xl flex items-center justify-center">
                  <span className="text-2xl font-black text-green-500">WB</span>
               </div>
            </div>
         </div>
      </div>

    </Suspense>
  );
}
