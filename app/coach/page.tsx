'use client'

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Sparkles, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/app/components/ui/neon-button"
import { Card } from "@/app/components/ui/card"
import { Spotlight } from "@/app/components/ui/spotlight"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  "What should I eat today?",
  "Suggest a 2000 calorie diet plan",
  "Is intermittent fasting good for me?",
  "How to gain muscle on a vegan diet?"
]

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello. I am your Neural Nutrition Coach. How can I optimize your biology today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (content: string = input) => {
    if (!content.trim() || isLoading) return
    
    const newMessages = [...messages, { role: 'user', content } as Message]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      if (data.content) {
        setMessages([...newMessages, { role: 'assistant', content: data.content }])
      } else {
        setMessages([...newMessages, { role: 'assistant', content: `Protocol Error: ${data.error || "Intelligence sweep failed."}` }])
      }
    } catch (error: any) {
      console.error("Chat Error:", error)
      setMessages([...newMessages, { role: 'assistant', content: `Neural Core Failure: ${error.message || "Unknown connectivity error."}` }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
      <Spotlight className="-top-40 left-0" fill="rgba(34, 197, 94, 0.1)" />
      
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/5 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </div>
          </Link>
          <div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
              Neural Coach <Sparkles className="w-4 h-4 text-green-500 animate-pulse" />
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Protocol v4.0 // High-Fidelity Advice</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setMessages([messages[0]])} className="border-white/10">
          <RefreshCw className="w-4 h-4 mr-2" /> Reset
        </Button>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                  m.role === 'user' ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'
                }`}>
                  {m.role === 'user' ? <User className="w-5 h-5 text-green-500" /> : <Bot className="w-5 h-5 text-green-400" />}
                </div>
                <div className={`p-5 rounded-[1.5rem] leading-relaxed text-sm md:text-base ${
                  m.role === 'user' 
                    ? 'bg-green-500/20 border border-green-500/30 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none backdrop-blur-xl shadow-2xl'
                }`}>
                  {m.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
             <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
               <Bot className="w-5 h-5 text-green-400 animate-pulse" />
             </div>
             <div className="flex gap-1 items-center px-4 py-2 bg-white/5 rounded-full border border-white/10">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></span>
             </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <footer className="relative z-10 p-6 bg-black border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400 transition-all uppercase tracking-widest"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          <div className="relative group">
            <div className="absolute -inset-1 bg-green-500/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 border border-white/10 rounded-[2rem] flex items-center p-2 backdrop-blur-xl">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your coach anything about nutrition..."
                className="flex-1 bg-transparent border-none focus:ring-0 px-6 text-sm text-white placeholder:text-gray-600"
              />
              <Button 
                onClick={() => handleSend()} 
                disabled={!input.trim() || isLoading}
                size="sm" 
                className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-green-500 hover:bg-green-400 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <p className="text-[9px] text-center text-gray-600 font-bold uppercase tracking-[0.3em] italic">
            Artificial Intelligence can provide generalized advice. Consult a professional for critical health decisions.
          </p>
        </div>
      </footer>
    </div>
  )
}
