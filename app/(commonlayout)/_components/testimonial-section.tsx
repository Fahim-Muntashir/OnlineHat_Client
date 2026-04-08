"use client";

import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Online Hat transformed how we hire. We found the perfect developer and shipped our MVP in 3 weeks. World-class platform.",
    author: "Rachael Kim",
    role: "Founder, LeverTech AI",
    initials: "RK",
  },
  {
    quote: "The quality of talent here is leagues above other platforms. I've built my entire core team through Online Hat and couldn't be happier.",
    author: "James Patel",
    role: "CTO, DataWise",
    initials: "JP",
  },
  {
    quote: "As a freelancer, this platform changed my career. Better clients, better projects, and the most secure payment system I've used.",
    author: "Lucia Ferrari",
    role: "Senior UX Designer",
    initials: "LF",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-3"
          >
            Testimonials
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
          >
            What our community says
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Decorative background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-slate-50 group-hover:text-primary/10 transition-colors duration-500" strokeWidth={4} />
              
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} className="fill-primary text-primary" />
                ))}
              </div>

              <p className="text-slate-600 mb-8 italic text-lg leading-relaxed relative z-10">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tighter">
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight">{t.author}</h4>
                  <p className="text-xs text-slate-400 font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
