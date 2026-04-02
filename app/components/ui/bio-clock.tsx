'use client';

import { useEffect, useState } from 'react';

export function BioClock() {
  const [time, setTime] = useState('');
  const [status, setStatus] = useState('NOMINAL');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    
    update();
    const interval = setInterval(update, 1000);
    
    // Cycle statuses
    const statusInterval = setInterval(() => {
      const statuses = ['NOMINAL', 'SYNCED', 'WAITING', 'ACTIVE', 'DECODING'];
      setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <div className="flex flex-col gap-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl group hover:border-green-500/30 transition-all">
      <div className="flex items-center justify-between gap-8">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Neural Time</span>
        <span className="text-[9px] font-bold text-green-500/80 uppercase px-1.5 py-0.5 bg-green-500/10 rounded tracking-tighter">
           {status}
        </span>
      </div>
      <span className="text-xl font-black text-white font-mono tracking-tighter leading-none italic">
        {time}
      </span>
    </div>
  );
}
