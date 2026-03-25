"use client";

import { Users, Building2, Heart, Globe } from "lucide-react";

export default function Stats() {
  const stats = [
    {
      icon: Users,
      number: "50,000+",
      label: "Active Freelancers",
    },
    {
      icon: Building2,
      number: "120,000+",
      label: "Projects Completed",
    },
    {
      icon: Heart,
      number: "30,000+",
      label: "Happy Clients",
    },
    {
      icon: Globe,
      number: "190+",
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
                  {stat.number}
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
