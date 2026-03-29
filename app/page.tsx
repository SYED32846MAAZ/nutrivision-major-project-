"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center px-4">
      <h1 className="text-5xl font-bold text-green-700 mb-4">
        NutriVision
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Snap your meal. Know your nutrition.
      </p>

      <div className="flex gap-4">
        <Link href="/login">
          <button className="bg-green-600 text-white px-6 py-2 rounded-xl">
            Login
          </button>
        </Link>

        <Link href="/analyze">
          <button className="bg-white border border-green-600 text-green-600 px-6 py-2 rounded-xl">
            Start Analysis
          </button>
        </Link>
      </div>
    </div>
  )
}