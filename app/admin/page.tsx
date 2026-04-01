"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/neon-button";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<{ 
    id: string, 
    name: string | null, 
    email: string, 
    isAdmin: boolean, 
    age: number | null, 
    weight: number | null, 
    height: number | null, 
    gender: string | null, 
    createdAt: string, 
    _count: { analyses: number } 
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && !(session?.user as any)?.isAdmin)) {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.isAdmin) {
      fetchUsers();
    }
  }, [status, session]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForceDelete = async (id: string, email: string) => {
    if (!confirm(`ADMINISTRATOR OVERRIDE: Are you confident you want to permanently execute [${email}] and shred all their AI records from the core?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (res.ok) {
         setUsers(users.filter(u => u.id !== id));
      } else {
         alert("Command Failed Check Database Lock.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "loading" || loading) return <div className="min-h-screen flex items-center justify-center font-bold text-violet-700">Penetrating Central Database...</div>;
  if (!(session?.user as any)?.isAdmin) return null;

  return (
    <div className="min-h-[calc(100vh-73px)] py-10 bg-gray-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 pb-6 border-b border-gray-200">
           <h1 className="text-4xl font-extrabold text-violet-900 tracking-tight">System Overseer</h1>
           <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2 md:mt-0 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
             Total Subjects Registered: {users.length}
           </span>
        </div>

        <div className="bg-white shadow-xl shadow-violet-900/5 rounded-3xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-violet-50 text-violet-950 border-b border-violet-100 uppercase text-xs tracking-wider">
                            <th className="p-5 font-bold">Identity Block</th>
                            <th className="p-5 font-bold">Biometrics Matrix</th>
                            <th className="p-5 font-bold">Analysis History</th>
                            <th className="p-5 font-bold">First Connected</th>
                            <th className="p-5 font-bold text-right">Sanction Protocol</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-violet-50/50 transition-colors">
                                <td className="p-5">
                                    <div className="font-semibold text-gray-900 text-base">{user.name || "Unknown Entity"}</div>
                                    <div className="text-gray-500 font-medium">{user.email}</div>
                                    {user.isAdmin && <span className="inline-block mt-2 bg-purple-200 text-purple-900 text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full shadow-sm">Administrator</span>}
                                </td>
                                <td className="p-5">
                                    {user.age ? (
                                        <div className="text-gray-600 font-medium bg-gray-50 inline-block px-3 py-1.5 rounded-lg border border-gray-100 shadow-inner">
                                            {user.age} yrs <span className="mx-1 text-gray-300">|</span> {user.weight}kg <span className="mx-1 text-gray-300">|</span> {user.height}cm <span className="mx-1 text-gray-300">|</span> {user.gender}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic font-medium">No Biology Registered</span>
                                    )}
                                </td>
                                <td className="p-5 font-bold text-violet-600 text-base">
                                    {user._count.analyses} Scans Found
                                </td>
                                <td className="p-5 text-gray-500 font-medium">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-5 text-right">
                                    {!user.isAdmin && (
                                        <Button 
                                            onClick={() => handleForceDelete(user.id, user.email)}
                                            variant="destructive"
                                            size="sm"
                                        >
                                            Terminate Subject
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <div className="p-10 text-center text-gray-500 font-medium">No valid subjects found in the primary registry.</div>}
            </div>
        </div>

      </div>
    </div>
  );
}
