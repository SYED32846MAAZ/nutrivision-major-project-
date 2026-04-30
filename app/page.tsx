"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/neon-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Dna, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  BrainCircuit,
  PieChart,
  Activity,
  Sparkles
} from "lucide-react";
import { BiologicalFeed } from "@/app/components/ui/biological-feed";
import { InteractiveBackground } from "@/app/components/ui/interactive-background";
import { SplineScene } from "@/app/components/ui/splite";
import { Spotlight } from "@/app/components/ui/spotlight";
import { ActivityPanel } from "@/app/components/ui/activity-panel";
import { ParallaxComponent } from "@/app/components/ui/parallax-scrolling";

const QUOTES = [
  "Let food be thy medicine, and medicine be thy food. — Hippocrates",
  "Health is a resource for everyday life, not the objective of living.",
  "The groundwork of all happiness is exactly health.",
  "To eat is a necessity, but to eat intelligently is an art."
];

const SPLINE_MODEL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function Home() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [quote, setQuote] = useState(QUOTES[0]);
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  useEffect(() => {
    setMounted(true);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full text-white overflow-x-hidden selection:bg-green-500/30">
      <InteractiveBackground />
      
      {/* 1. HERO SECTION (Premium 3D Experience) */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(34, 197, 94, 0.2)" />
        
        <motion.div 
          style={{ opacity, scale }}
          className="absolute inset-0 z-0"
        >
          <SplineScene 
            scene={SPLINE_MODEL}
            className="w-full h-full"
          />
        </motion.div>

        {/* Hero Overlay Gradient */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-20 text-center max-w-5xl mx-auto space-y-10 mt-[10vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-xl"
          >
            <Sparkles className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-green-400">
              Neural Engine v4.0 Active
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1 }}
            className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] drop-shadow-[0_0_50px_rgba(34,197,94,0.3)] italic uppercase"
          >
            Bio <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-green-600">
              Command.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed"
          >
            Decode your biology. Our neural food scanner identifies every high-risk nutrient in sub-second inference. 
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-8 items-center"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={status === "authenticated" ? "/analyze" : "/register"}>
                <Button size="lg" className="h-16 px-10 text-xl font-black tracking-widest uppercase italic shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                  {status === "authenticated" ? "Execute Scan" : "Begin Protocol"}
                </Button>
              </Link>
              <Link href="/analyze">
                <Button variant="ghost" size="lg" className="h-16 px-10 border-white/10 hover:bg-white/5 backdrop-blur-md">
                  View demo
                </Button>
              </Link>
            </div>
            
            <BiologicalFeed />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 z-20 flex flex-col items-center gap-2 opacity-50"
        >
          <div className="w-px h-16 bg-gradient-to-b from-green-500 to-transparent" />
        </motion.div>
      </section>

      {/* 2. ACTIVITY DASHBOARD (Premium Panel) */}
      <section className="relative py-20">
        <ActivityPanel />
      </section>

      {/* 3. PARALLAX EXPERIENCE */}
      <section className="relative border-y border-white/5">
        <ParallaxComponent />
      </section>

      {/* 4. FEATURE GRID (Atomic Design) */}
      <section className="relative py-32 px-6 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "Computer Vision", desc: "Instantly identify 2,500+ food variants with 99.2% accuracy.", icon: Camera },
             { title: "Biometric Matrix", desc: "Analysis adjusts specifically to your metabolic baseline.", icon: Dna },
             { title: "Risk Prediction", desc: "Maps months of data to predict cardiovascular variance.", icon: TrendingUp }
           ].map((feature, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
             >
                <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[3rem] p-4 group transition-all hover:bg-white/[0.05] shadow-none">
                  <CardHeader className="space-y-6 p-8">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 flex items-center justify-center">
                       <feature.icon className="w-8 h-8 text-green-400" />
                    </div>
                    <CardTitle className="text-3xl font-black text-white italic uppercase tracking-tighter">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-lg font-medium leading-relaxed">{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
             </motion.div>
           ))}
        </div>
      </section>

      {/* 5. WORKFLOW SECTION */}
      <section className="relative py-32 bg-green-500/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="w-full lg:w-1/2 relative group"
             >
                <div className="absolute -inset-10 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all duration-700" />
                <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                   <img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200" 
                    alt="AI Food Analysis" 
                    className="w-full h-[600px] object-cover hover:scale-110 transition-all duration-700" 
                  />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="p-8 bg-black/60 backdrop-blur-2xl border border-white/20 rounded-[2rem] flex items-center gap-6 animate-pulse">
                         <BrainCircuit className="w-12 h-12 text-green-400" />
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Neural Stream</p>
                            <p className="text-2xl font-black italic tracking-tighter">Scanning Core...</p>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>

             <div className="w-full lg:w-1/2 space-y-12">
                <div className="space-y-4">
                  <h2 className="text-sm font-black text-green-500 uppercase tracking-[0.5em] italic">Neural Workflow</h2>
                  <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">Zero Latency <br /> Protocol.</h3>
                </div>

                <div className="space-y-8">
                   {[
                     { step: "01", title: "Visual Capture", desc: "Upload a frame of your meal. Our neural core identifies ingredients layer-by-layer.", icon: Camera },
                     { step: "02", title: "Biometric Sync", desc: "Macros are cross-referenced with your personal biometric profile for extreme precision.", icon: PieChart },
                     { step: "03", title: "Metabolic Map", desc: "AI generates a predictive report on long-term risks and health adjustments.", icon: Activity }
                   ].map((step, idx) => (
                     <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-8 group"
                      >
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-green-500 text-xl italic group-hover:bg-green-500 group-hover:text-black transition-all">
                           {step.step}
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                             {step.title}
                           </h4>
                           <p className="text-gray-400 text-lg font-medium leading-relaxed">{step.desc}</p>
                        </div>
                     </motion.div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-40 overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1)_0%,transparent_70%)] pointer-events-none" />
         <div className="container mx-auto px-6 relative z-10 text-center space-y-12">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">
              Ready to meet <br /> <span className="text-green-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]">Your Better Self?</span>
            </h2>
            <p className="text-gray-400 text-2xl font-medium max-w-2xl mx-auto">
               Join 50,000+ humans evolving their biology with neural dietetics.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/register">
                 <Button size="lg" className="h-16 px-12 text-xl font-black tracking-widest uppercase italic">
                   Begin Evolution
                 </Button>
              </Link>
              <Link href="/analyze">
                 <Button variant="ghost" size="lg" className="h-16 px-12 border-white/20 text-xl font-black tracking-widest uppercase italic">
                   View Demo
                 </Button>
              </Link>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5 bg-black">
         <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
               <span className="text-3xl font-black tracking-tighter italic uppercase bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">Balanced Bites</span>
               <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em] italic">Neural Dietetics Protocol v4.2.1</p>
            </div>
            <div className="flex gap-12 text-xs font-black uppercase tracking-widest text-gray-500">
               <Link href="/" className="hover:text-green-500 transition-colors italic">Privacy</Link>
               <Link href="/" className="hover:text-green-500 transition-colors italic">Security</Link>
               <Link href="/" className="hover:text-green-500 transition-colors italic">Neural Latency</Link>
            </div>
            <div className="flex gap-6">
               <div className="p-4 border border-white/10 rounded-2xl hover:border-green-500/30 transition-all cursor-pointer bg-white/5">
                  <ShieldCheck className="w-6 h-6 text-gray-500" />
               </div>
               <div className="p-4 border border-white/10 rounded-2xl hover:border-green-500/30 transition-all cursor-pointer bg-white/5">
                  <Users className="w-6 h-6 text-gray-500" />
               </div>
            </div>
         </div>
         <div className="mt-20 text-center">
            <p className="text-[10px] text-gray-800 font-mono italic">"{quote}"</p>
         </div>
      </footer>
    </div>
  );
}

}