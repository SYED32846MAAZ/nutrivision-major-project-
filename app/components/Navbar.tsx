"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/app/components/ui/neon-button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center p-4 px-6 md:px-12 bg-black/60 backdrop-blur-xl shadow-2xl border-b border-white/5 sticky top-0 z-[100] transition-all">
      <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent italic tracking-tighter">
        Balanced Bites
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex gap-8 items-center">
        {status === "authenticated" && session?.user && (
          <>
            <Link href="/analyze" className="text-sm font-bold text-gray-400 hover:text-green-500 transition-colors uppercase tracking-widest">Analyze</Link>
            <Link href="/history" className="text-sm font-bold text-gray-400 hover:text-green-500 transition-colors uppercase tracking-widest">History</Link>
            <Link href="/profile" className="text-sm font-bold text-gray-400 hover:text-green-500 transition-colors uppercase tracking-widest">Profile</Link>
            {(session.user as any).isAdmin && (
              <Link href="/admin" className="text-xs font-black bg-violet-600/20 text-violet-400 border border-violet-500/30 px-3 py-1.5 rounded-full hover:bg-violet-600 hover:text-white transition-all uppercase tracking-tighter">
                 Admin Logic
              </Link>
            )}
            <Button onClick={() => signOut({ callbackUrl: '/' })} variant="destructive" size="sm" className="font-bold uppercase tracking-widest">Sign Out</Button>
          </>
        )}
        {status === "unauthenticated" && (
          <>
            <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-green-500 transition-colors uppercase tracking-widest">Login</Link>
            <Link href="/register">
              <Button size="sm" className="font-bold uppercase tracking-widest">Sign Up Free</Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-400 hover:text-white transition-colors">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-[73px] left-0 w-full h-screen bg-black/95 backdrop-blur-3xl z-[90] flex flex-col p-8 gap-8 border-t border-white/5 lg:hidden animate-in fade-in slide-in-from-top-10 duration-300">
           {session?.user ? (
             <>
               <Link onClick={() => setIsOpen(false)} href="/analyze" className="text-3xl font-black text-white uppercase italic">Analyze</Link>
               <Link onClick={() => setIsOpen(false)} href="/history" className="text-3xl font-black text-white uppercase italic">History</Link>
               <Link onClick={() => setIsOpen(false)} href="/profile" className="text-3xl font-black text-white uppercase italic">Profile</Link>
               {(session.user as any).isAdmin && (
                 <Link onClick={() => setIsOpen(false)} href="/admin" className="text-3xl font-black text-violet-500 uppercase italic">Admin</Link>
               )}
               <Button onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }); }} variant="destructive" size="lg" className="w-full mt-10 uppercase tracking-widest font-black">Sign Out</Button>
             </>
           ) : (
             <>
               <Link onClick={() => setIsOpen(false)} href="/login" className="text-3xl font-black text-white uppercase italic">Login</Link>
               <Link onClick={() => setIsOpen(false)} href="/register" className="text-3xl font-black text-white uppercase italic">Join Now</Link>
             </>
           )}
        </div>
      )}
    </nav>
  );
}
