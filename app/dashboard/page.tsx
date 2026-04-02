import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../lib/prisma";
import { redirect } from "next/navigation";
import { FuelTank } from "../components/ui/fuel-tank";
import { ShieldCheck, TrendingUp, Zap, Activity } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as any).id;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      analyses: {
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }
    }
  });

  if (!user) return null;

  // Simple parser function
  const parseMetric = (text: string, key: string) => {
    const regex = new RegExp(`${key}:\\s*(?:[^\\d]*?\\s*)?(\\d+)`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1]) : 0;
  };

  const todayTotals = user.analyses.reduce((acc: any, curr: any) => {
    acc.calories += parseMetric(curr.resultText, "CALORIES");
    acc.protein += parseMetric(curr.resultText, "PROTEIN");
    acc.carbs += parseMetric(curr.resultText, "CARBS");
    acc.fats += parseMetric(curr.resultText, "FATS");
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

  // Baseline targets (could be dynamic based on biometrics)
  const targets = {
    calories: 2200,
    protein: 60,
    carbs: 250,
    fats: 70
  };

  return (
    <div className="min-h-screen bg-[#050505] py-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full w-fit">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Biological OS Online</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter">Bio-Intelligence Command</h1>
          </div>
          <div className="text-right">
             <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Target Persona</p>
             <p className="text-xl font-black text-white italic">{user.name || "System Operator"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Visual: The Fuel Tanks */}
          <div className="lg:col-span-8 glass-card p-10 rounded-[3rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Activity size={200} />
             </div>

             <div className="flex justify-between items-center mb-16">
                <h2 className="text-xs font-black text-green-500 uppercase tracking-[0.4em] flex items-center gap-3">
                   <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
                   Daily Intake Matrix
                </h2>
                <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   Reset in 4h 12m
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                <FuelTank current={todayTotals.calories} target={targets.calories} label="Energy" unit="kcal" color="#22c55e" />
                <FuelTank current={todayTotals.protein} target={targets.protein} label="Growth" unit="g" color="#3b82f6" />
                <FuelTank current={todayTotals.carbs} target={targets.carbs} label="Focus" unit="g" color="#eab308" />
                <FuelTank current={todayTotals.fats} target={targets.fats} label="Reserve" unit="g" color="#ef4444" />
             </div>
          </div>

          {/* Side Module: Insights */}
          <div className="lg:col-span-4 space-y-8">
             <div className="glass-card p-8 rounded-[2.5rem] border-green-500/20">
                <h3 className="text-xs font-black text-green-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   <ShieldCheck size={16} />
                   System Verdict
                </h3>
                <div className="space-y-4">
                   <p className="text-gray-400 text-sm leading-relaxed font-medium">
                      "Primary caloric threshold is stable. Protein integration has increased by 14% since yesterday. Predictive model suggests adding 500ml H2O to optimize synthesis."
                   </p>
                   <div className="pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500">
                         <span>Compliance</span>
                         <span className="text-green-500">92%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                         <div className="w-[92%] h-full bg-green-500" />
                      </div>
                   </div>
                </div>
             </div>

             <Link href="/analyze" className="block p-8 glass-card rounded-[2.5rem] bg-gradient-to-br from-green-500/10 to-transparent border-green-500/30 group hover:scale-[1.02] transition-all">
                <div className="flex justify-between items-center mb-4">
                   <div className="w-10 h-10 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-center">
                      <Zap className="text-green-400" />
                   </div>
                   <TrendingUp className="text-gray-600 group-hover:text-green-500 transition-colors" />
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-tighter">New Assessment</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Initiate Scan Protocol</p>
             </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
