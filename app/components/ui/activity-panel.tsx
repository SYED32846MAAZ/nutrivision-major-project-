'use client'

import { motion } from "framer-motion"
import { Activity, Flame, Target, Trophy } from "lucide-react"
import { Card, CardContent } from "./card"

export function ActivityPanel() {
  const stats = [
    { label: "Calories today", value: "1,840", icon: Flame, color: "text-orange-500" },
    { label: "Scan Accuracy", value: "99.2%", icon: Target, color: "text-blue-500" },
    { label: "Goal Progress", value: "82%", icon: Activity, color: "text-green-500" },
    { label: "Daily Streak", value: "12 days", icon: Trophy, color: "text-yellow-500" },
  ]

  const recentScans = [
    { name: "Grilled Salmon Salad", time: "2h ago", cals: "450 kcal", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=150" },
    { name: "Avocado Toast", time: "5h ago", cals: "320 kcal", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=150" },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
      >
        {stats.map((stat, i) => (
          <Card key={i} className="bg-white/[0.02] border-white/5 backdrop-blur-xl group hover:bg-white/[0.05] transition-all">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tighter uppercase italic text-white">Recent Neural Scans</h3>
            <button className="text-xs font-bold text-green-500 uppercase tracking-widest hover:underline">View History</button>
          </div>
          <div className="space-y-4">
            {recentScans.map((scan, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 p-4 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all"
              >
                <img src={scan.img} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-white">{scan.name}</h4>
                  <p className="text-xs text-gray-500">{scan.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-green-500">{scan.cals}</p>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">Verified AI</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-green-500/10 border border-green-500/20 rounded-[3rem] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.2)_0%,transparent_70%)] animate-pulse" />
          <div className="relative z-10 space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-10 h-10 text-green-400" />
            </div>
            <h4 className="text-2xl font-black text-white tracking-tighter uppercase italic">Neural Performance</h4>
            <p className="text-sm text-gray-400 font-medium">Your metabolic engine is running at 94% efficiency today.</p>
            <div className="pt-4">
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: "94%" }}
                   className="h-full bg-green-500 shadow-[0_0_15px_#22c55e]" 
                 />
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
