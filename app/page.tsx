"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/neon-button";
import { InteractiveRobotSpline } from "@/app/components/blocks/interactive-3d-robot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Activity
} from "lucide-react";
import { BiologicalFeed } from "@/app/components/ui/biological-feed";


const QUOTES = [
  "Let food be thy medicine, and medicine be thy food. — Hippocrates",
  "Health is a resource for everyday life, not the objective of living.",
  "The groundwork of all happiness is exactly health.",
  "To eat is a necessity, but to eat intelligently is an art."
];

const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

export default function Home() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [quote, setQuote] = useState(QUOTES[0]);
  
  const { scrollYProgress } = useScroll();
  const robotOpacity = useTransform(scrollYProgress, [0, 0.2], [0.4, 0]);
  const robotScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);

  useEffect(() => {
    setMounted(true);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full mesh-gradient text-white overflow-x-hidden selection:bg-green-500/30">
      
      {/* 1. HERO SECTION (3D Whobee Interactivity) */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        
        {/* Floating Particles / Data Noise */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping shadow-[0_0_15px_#4ade80]"></div>
           <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_#10b981] delay-700"></div>
           <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-white rounded-full animate-ping shadow-[0_0_10px_#fff] delay-500"></div>
        </div>

        {/* Floating Robot Whobee - Background Dynamic Element */}
        <motion.div 
          style={{ opacity: robotOpacity, scale: robotScale }}
          className="absolute inset-x-0 inset-y-0 z-0 pointer-events-auto"
        >
          <InteractiveRobotSpline
            scene={ROBOT_SCENE_URL}
            className="w-full h-full" 
          />
        </motion.div>

        {/* Hero Overlay Gradient */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/50 pointer-events-none" />


        {/* Hero Content */}
        <div className="relative z-20 text-center max-w-4xl mx-auto space-y-8 mt-[-10vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-green-400">
              Personalized Intelligence v2.0
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] drop-shadow-2xl"
          >
            Evolve Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-green-600">
              Biology.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed text-center"
          >
            Balanced Bites utilizes advanced neural computer vision to decode every calorie, micro-nutrient, and long-term health risk lurking in your daily meals.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col gap-6 justify-center items-center text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {status === "authenticated" ? (
                <Link href="/analyze">
                  <Button size="lg" className="w-[200px] font-extrabold tracking-widest uppercase">
                    Launch Scan
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button size="lg" className="w-[200px] font-extrabold tracking-widest uppercase shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    Join Whobee
                  </Button>
                </Link>
              )}
              <Link href="/analyze">
                <Button variant="ghost" size="lg" className="w-[200px] border-white/10 hover:bg-white/5 backdrop-blur-md">
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
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-500">Scroll Down</span>
          <div className="w-px h-12 bg-gradient-to-b from-green-500 to-transparent" />
        </motion.div>
      </section>

      {/* 2. FEATURE SHOWCASE (Atomic Grid) */}
      <section className="relative py-32 px-6 container mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-sm font-bold text-green-500 uppercase tracking-[0.4em]">Integrated Capabilities</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">The Neural Architecture</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "Computer Vision", desc: "Instantly identify 2,500+ food variants with 99.2% accuracy in sub-second inference.", icon: Camera, color: "green" },
             { title: "Biometric Matrix", desc: "Analysis context adjusts specifically to your age, weight, and metabolic baseline.", icon: Dna, color: "emerald" },
             { title: "Risk Prediction", desc: "Long-term metabolic forecast maps months of data to predict cardiovascular variance.", icon: TrendingUp, color: "lime" }
           ].map((feature, idx) => (
             <motion.div
               key={idx}
               whileHover={{ y: -10 }}
               transition={{ duration: 0.3 }}
             >
                <Card className="bg-white/[0.03] border-white/10 backdrop-blur-md h-full rounded-[2.5rem] p-4 group transition-all hover:bg-white/5 shadow-none hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
                  <CardHeader className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 flex items-center justify-center">
                       <feature.icon className="w-8 h-8 text-green-400" />
                    </div>
                    <CardTitle className="text-2xl font-extrabold text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-400 font-medium leading-relaxed">{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
             </motion.div>
           ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS (Vertical Experience) */}
      <section className="relative py-32 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
             
             {/* Left: Interactive Image/Graphic */}
             <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -inset-4 bg-green-500/20 rounded-3xl blur-2xl group-hover:bg-green-500/30 transition-all duration-700" />
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                   <img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c" 
                    alt="AI Food Analysis" 
                    className="w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100" 
                  />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                      <div className="p-6 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center gap-4 animate-pulse">
                         <BrainCircuit className="w-10 h-10 text-green-400" />
                         <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Processing Node</p>
                            <p className="text-xl font-extrabold">Active Analysis...</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right: Steps */}
             <div className="w-full lg:w-1/2 space-y-12">
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-green-500 uppercase tracking-[0.4em]">Operational Workflow</h2>
                  <h3 className="text-4xl font-bold tracking-tight">Three Seconds to Clarity.</h3>
                </div>

                <div className="space-y-10">
                   {[
                     { step: "01", title: "Visual Capture", desc: "Upload a single frame of your meal. Our Whobee core identifies ingredients layer-by-layer.", icon: Camera },
                     { step: "02", title: "Neural Synthesis", desc: "Macros are cross-referenced with your personal biometric profile for extreme precision.", icon: PieChart },
                     { step: "03", title: "LifePath Mapping", desc: "AI generates a predictive report on long-term risks and specific health adjustments.", icon: Activity }
                   ].map((step, idx) => (
                     <div key={idx} className="flex gap-6 group">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all">
                           {step.step}
                        </div>
                        <div className="space-y-1 mt-1">
                           <h4 className="text-xl font-bold text-white flex items-center gap-2">
                             {step.title}
                           </h4>
                           <p className="text-gray-400 leading-relaxed font-medium">{step.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS (Human Connection) */}
      <section className="relative py-32 container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold text-green-500 uppercase tracking-[0.4em] mb-4">Social Matrix</h2>
          <h3 className="text-4xl font-bold tracking-tight">The Bio-Feedback Loop</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { name: "Sarah Johnson", role: "Athlete", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80", text: "Balanced Bites decoded my recurring fatigue by tracing it back to simple breakfast imbalances I never noticed." },
             { name: "David Smith", role: "Data Scientist", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", text: "The predictive health risk engine is a game changer. It's like having a nutritionist and a cardiologist in my pocket." },
             { name: "Elena Rodriguez", role: "Yoga Instructor", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", text: "The UI feels so futuristic and smooth. It makes tracking health feel like playing an advanced dashboard." }
           ].map((user, idx) => (
             <Card key={idx} className="bg-white/[0.02] border-white/5 rounded-[2rem] p-8 flex flex-col gap-6 hover:bg-white/[0.04] transition-all">
               <div className="flex items-center gap-4">
                  <img src={user.img} alt={user.name} className="w-14 h-14 rounded-full object-cover border-2 border-green-500/30" />
                  <div>
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-xs text-green-500 font-bold uppercase tracking-wider">{user.role}</p>
                  </div>
               </div>
               <p className="text-gray-400 italic leading-relaxed">"{user.text}"</p>
               <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => <Zap key={s} className="w-4 h-4 fill-green-500 text-green-500" />)}
               </div>
             </Card>
           ))}
        </div>
      </section>

      {/* 5. FINAL CTA (Conversion) */}
      <section className="relative py-40 overflow-hidden">
         <div className="absolute inset-0 bg-green-500/5 mix-blend-screen pointer-events-none" />
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
         
         <div className="container mx-auto px-6 relative z-10 text-center space-y-10">
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
              Ready to meet <br /> <span className="text-green-500">Your Better Self?</span>
            </h2>
            <p className="text-gray-400 text-xl font-medium max-w-xl mx-auto">
               Join 50,000+ humans evolving their biology with Whobee AI. Start your neural scan journey now.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                 <Button size="lg" className="w-[200px] font-extrabold tracking-widest uppercase">
                   Begin Evolution
                 </Button>
              </Link>
              <Link href="/analyze">
                 <Button variant="ghost" size="lg" className="w-[200px] border-white/20">
                   View Demo
                 </Button>
              </Link>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-black">
         <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
               <span className="text-2xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">Balanced Bites</span>
               <p className="text-xs text-gray-600 font-bold uppercase tracking-widest leading-loose">Automated Neural Dietetics Protocol v2.4.9</p>
            </div>
            <div className="flex gap-8 text-sm font-bold text-gray-500">
               <Link href="/" className="hover:text-green-500 transition-colors">Privacy</Link>
               <Link href="/" className="hover:text-green-500 transition-colors">Security</Link>
               <Link href="/" className="hover:text-green-500 transition-colors">Neural Latency</Link>
            </div>
            <div className="flex gap-4">
               <div className="p-2 border border-white/10 rounded-lg hover:border-green-500/30 transition-all cursor-pointer">
                  <ShieldCheck className="w-5 h-5 text-gray-500" />
               </div>
               <div className="p-2 border border-white/10 rounded-lg hover:border-green-500/30 transition-all cursor-pointer">
                  <Users className="w-5 h-5 text-gray-500" />
               </div>
            </div>
         </div>
         <div className="mt-12 text-center">
            <p className="text-xs text-gray-700 font-mono italic">"{quote}"</p>
         </div>
      </footer>

    </div>
  );
}