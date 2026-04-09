"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      parts: [{ text: message }],
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/ai/chat", {
        message: currentMessage,
        history: messages,
      });

      const botMessage: Message = {
        role: "model",
        parts: [{ text: response.data.data }],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Sorry, I'm having trouble connecting to the AI engine. Please try again later." }],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button with Pulse Effect */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-primary text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-primary/20 flex items-center justify-center cursor-pointer group"
        aria-label="Toggle Chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle size={24} />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Subtle Pulse Animation */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping -z-10" />
        )}
      </motion.button>

      {/* Glassmorphic Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, x: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, y: 50, x: 20, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-24 right-6 z-[9998] w-[95vw] sm:w-[380px] h-[580px] bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/20 overflow-hidden flex flex-col ring-1 ring-black/5"
          >
            {/* Premium Header */}
            <div className="relative p-6 bg-primary text-white overflow-hidden">
              {/* Animated background element */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"
              />
              
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                    <Bot size={26} className="text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-primary animate-pulse shadow-sm" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg tracking-tight leading-tight">OnlineHat AI</h3>
                  <div className="flex items-center gap-1.5 opacity-80">
                    <Sparkles size={11} className="text-yellow-200" />
                    <span className="text-xs font-semibold uppercase tracking-widest">Intelligent Assistant</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all hover:rotate-90"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-slate-50/50 to-white scroll-smooth"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
                  <motion.div 
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary"
                  >
                    <Bot size={40} />
                  </motion.div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800 text-lg">Hello! I'm your OnlineHat Assistant.</h4>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                      I'm here 24/7 to help with orders, services, account issues, or anything else you need.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Order Status", "How to Start?", "Pricing Info"].map((chip) => (
                      <button 
                        key={chip}
                        onClick={() => {
                          const e = { preventDefault: () => {} } as any;
                          setMessage(chip);
                          // We can't easily trigger the form submit here without a ref, 
                          // but setting the message is a good start. 
                          // A better way would be to call handleSendMessage with the chip text.
                        }}
                        className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={i}
                  className={cn(
                    "flex items-end gap-2.5",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-transform hover:scale-110",
                    msg.role === "user" ? "bg-slate-100 border-slate-200" : "bg-primary text-white border-primary shadow-sm"
                  )}>
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div
                    className={cn(
                      "max-w-[85%] p-4 rounded-[1.25rem] text-sm shadow-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                    <Bot size={14} />
                  </div>
                  <div className="bg-white border border-slate-100 px-4 py-3 rounded-[1.25rem] rounded-bl-none shadow-sm flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <motion.span 
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 bg-primary rounded-full" 
                      />
                      <motion.span 
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-primary rounded-full" 
                      />
                      <motion.span 
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-primary rounded-full" 
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">AI Thinking</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-5 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-100 focus:border-primary/40 rounded-2xl px-5 py-3.5 text-sm transition-all focus:ring-4 focus:ring-primary/5 outline-none shadow-inner"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="w-12 h-12 bg-primary text-white rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] flex items-center justify-center disabled:opacity-40 disabled:scale-100 transition-all shadow-primary/25"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </motion.button>
              </form>
              <div className="flex items-center justify-center gap-1.5 mt-4 opacity-40">
                <div className="h-px flex-1 bg-slate-300" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">OnlineHat AI Core</span>
                <div className="h-px flex-1 bg-slate-300" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
