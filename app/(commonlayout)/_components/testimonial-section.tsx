"use client";

import { Star, Quote, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export function TestimonialsSection() {
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await axiosInstance.get("/reviews/testimonials");
      return res.data?.data || [];
    },
  });

  const reviews = reviewsData || [];

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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary/40 mb-4" />
            <p className="text-slate-400 font-medium">Loading real stories...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400">No testimonials yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {/* Decorative background circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <AnimatePresence>
              {reviews.map((t: any, index: number) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group"
                >
                  <Quote className="absolute top-8 right-8 w-12 h-12 text-slate-50 group-hover:text-primary/10 transition-colors duration-500" strokeWidth={4} />
                  
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < t.rating ? "fill-primary text-primary" : "text-slate-200 fill-slate-100"} 
                      />
                    ))}
                  </div>

                  <p className="text-slate-600 mb-8 italic text-lg leading-relaxed relative z-10 line-clamp-4">
                    "{t.comment}"
                  </p>

                  <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                    <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden text-slate-500 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                      {t.buyer?.user?.profileImage ? (
                        <img src={t.buyer.user.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        t.buyer?.user?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight">
                        {t.buyer?.user?.name || "Verified Buyer"}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">Platform Client</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
