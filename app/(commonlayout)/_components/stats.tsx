"use client";

import { Users, Building2, Heart, Globe } from "lucide-react";
import { CountUp } from "@/components/shared/CountUp";

export default function Stats() {
  const stats = [
    {
      icon: Users,
      value: 50000,
      suffix: "+",
      label: "Active Freelancers",
    },
    {
      icon: Building2,
      value: 120000,
      suffix: "+",
      label: "Projects Completed",
    },
    {
      icon: Heart,
      value: 30000,
      suffix: "+",
      label: "Happy Clients",
    },
    {
      icon: Globe,
      value: 190,
      suffix: "+",
      label: "Countries Covered",
    },
  ];

  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center text-primary-foreground">
                <div className="flex justify-center mb-4">
                  <IconComponent className="w-8 h-8" />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <CountUp 
                    to={stat.value} 
                    suffix={stat.suffix} 
                    delay={index * 0.15} 
                  />
                </div>
                <div className="text-primary-foreground/80 text-sm">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
