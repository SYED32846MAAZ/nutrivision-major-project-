"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/neon-button";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  if (status === "loading") {
    return <div className="min-h-[calc(100vh-73px)] flex items-center justify-center text-green-700 font-medium">Securing connection...</div>;
  }

  if (!session?.user) {
    router.push("/login");
    return null;
  }

  const handleDelete = async () => {
    if (!confirm("Are you absolutely sure? This will instantly eradicate all your saved data, biometrics, and scan history. It cannot be safely recovered!")) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/profile", { method: "DELETE" });
      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        alert("Failed to forcefully terminate account. Please contact administrator.");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] py-10 bg-green-50 px-4">
      <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-green-950/5 border border-green-100">
        <h1 className="text-3xl font-extrabold text-green-800 mb-6 border-b border-green-100 pb-4">Account Settings</h1>
        
        <div className="space-y-4 mb-10">
           <div className="flex flex-col">
             <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Display Name</span>
             <span className="text-xl font-medium text-gray-900">{session.user.name || "Guest Entity"}</span>
           </div>
           <div className="flex flex-col">
             <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Email Backbone</span>
             <span className="text-xl font-medium text-gray-900">{session.user.email}</span>
           </div>
           <div className="flex flex-col">
             <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Network Role</span>
             <span className="text-base font-semibold text-purple-700 bg-purple-100 border border-purple-200 px-4 py-1.5 rounded-full w-max mt-1">
               {(session.user as any)?.isAdmin ? "Super Administrator" : "Standard User"}
             </span>
           </div>
        </div>

        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mt-8 shadow-inner shadow-red-100/50">
           <h2 className="text-xl font-bold text-red-700 mb-2">Danger Zone</h2>
           <p className="text-red-900/80 text-sm mb-6 leading-relaxed">
             Permanently flush your account and biological blueprint from the NutriVision central database. This action completely scrubs your AI history. It cannot be reversed.
           </p>
           <Button 
             onClick={handleDelete}
             disabled={isDeleting}
             variant="destructive"
             size="full"
             className="disabled:opacity-50"
             neon={!isDeleting}
           >
             {isDeleting ? "Shredding Server Fragments..." : "Eradicate My Account"}
           </Button>
        </div>
      </div>
    </div>
  );
}
