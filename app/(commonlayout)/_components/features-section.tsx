"use client";

import { Shield, DollarSign, Clock, Headphones, Globe, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Verified Talent",
    description: "Connect with verified professionals through identity verification and skill assessments.",
  },
  {
    icon: DollarSign,
    title: "Secure Payments",
    description: "Funds are held in escrow and only released when you approve the work. Zero risk.",
  },
  {
    icon: Clock,
    title: "Fast Hiring",
    description: "Our matching algorithm connects you with the right talent fast. Usually within 24 hours.",
  },
  {
    icon: CheckCircle2,
    title: "Quality Work",
    description: "Our rating system ensures high-quality deliverables from seasoned professionals.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is always available to help you via chat, phone or email.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Access skilled professionals from 180+ countries with expertise in every domain.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-bold uppercase tracking-widest mb-3"
          >
            Why Choose Us
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
          >
            Everything you need for success
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg"
          >
            We've built a platform that tackles the biggest challenges in the freelance market.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
