"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/app/components/ui/neon-button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Biometrics
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, age, weight, height, gender }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Automatically log them in after
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] py-10 bg-green-50 px-4">
      <div className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-green-950/5 border border-green-100">
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-2">Create Account</h1>
        <p className="text-center text-sm text-gray-500 mb-8 max-w-md mx-auto">
          We need your basic biological metrics to allow the AI to accurately predict long-term health constraints from your food.
        </p>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-sm font-medium border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Top Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 pl-1">Display Name (Optional)</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 pl-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none" required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1 pl-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none" required />
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-green-100 to-transparent my-1" />

          {/* Biometrics Section */}
          <div className="space-y-4">
             <h2 className="text-xl font-bold text-green-800 tracking-tight">Biological Profile</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-semibold text-green-900/70 mb-1 pl-1">Age</label>
                 <input type="number" min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-3 bg-green-50/30 border border-green-100 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none shadow-sm" placeholder="Years" required />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-green-900/70 mb-1 pl-1">Gender</label>
                 <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 bg-green-50/30 border border-green-100 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none shadow-sm" required>
                   <option value="" disabled>Select Gender</option>
                   <option value="Male">Male</option>
                   <option value="Female">Female</option>
                   <option value="Other">Other</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-semibold text-green-900/70 mb-1 pl-1">Weight (kg)</label>
                 <input type="number" step="0.1" min="1" max="500" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-3 bg-green-50/30 border border-green-100 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none shadow-sm" placeholder="e.g. 70" required />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-green-900/70 mb-1 pl-1">Height (cm)</label>
                 <input type="number" min="1" max="300" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-4 py-3 bg-green-50/30 border border-green-100 text-gray-900 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none shadow-sm" placeholder="e.g. 175" required />
               </div>
             </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            neon={!loading}
            size="full"
            className="mt-4 tracking-wide shadow-green-600/30 disabled:opacity-50"
          >
            {loading ? "INITIALIZING AI PROFILE..." : "CREATE ACCOUNT"}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-8">
          Already have an account? <Link href="/login" className="text-green-600 font-bold hover:underline">Log in securely</Link>
        </p>
      </div>
    </div>
  );
}
