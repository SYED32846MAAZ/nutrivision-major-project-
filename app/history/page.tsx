import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../lib/prisma";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id: string }).id;

  const pastAnalyses = await prisma.analysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-73px)] p-6 bg-gradient-to-br from-green-50 to-green-100 py-12">
      <h1 className="text-4xl font-extrabold text-green-700 mb-8 drop-shadow-sm text-center">
        Your Analysis History
      </h1>

      <div className="w-full max-w-2xl flex flex-col gap-6">
        {pastAnalyses.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm text-gray-500 font-medium">
            You haven't analyzed any meals yet! Go to the Analyze tab to scan your first meal.
          </div>
        ) : (
          pastAnalyses.map((analysis: any) => (
            <div key={analysis.id} className="bg-white text-gray-800 p-8 rounded-3xl shadow-xl shadow-green-900/5 border border-green-100">
              <p className="text-sm font-bold text-gray-400 mb-4 border-b border-gray-100 pb-3">
                Analyzed on: {new Date(analysis.createdAt).toLocaleString()}
              </p>
              <div>
                <ReactMarkdown
                  components={{
                    h1: ({ ...props }) => <h1 className="text-xl font-bold mb-2 text-green-800" {...props} />,
                    h2: ({ ...props }) => <h2 className="text-lg font-bold mt-4 mb-2 text-green-700" {...props} />,
                    h3: ({ ...props }) => <h3 className="text-md font-semibold mt-3 mb-1 text-green-600" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-gray-600" {...props} />,
                    li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
                    p: ({ ...props }) => <p className="mb-3 text-gray-600 leading-relaxed" {...props} />,
                    strong: ({ ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                  }}
                >
                  {analysis.resultText}
                </ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
