"use client";

import { Users, Building2, Heart, Globe } from "lucide-react";
import { CountUp } from "@/components/shared/CountUp";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export default function Stats() {
  const { data, isLoading } = useQuery({
    queryKey: ["system-stats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/meta/stats");
      return res.data.data;
    },
  });

  const stats = [
    {
      icon: Users,
      value: data?.activeFreelancers ?? 0,
      suffix: "+",
      label: "Active Freelancers",
    },
    {
      icon: Building2,
      value: data?.projectsCompleted ?? 0,
      suffix: "+",
      label: "Projects Completed",
    },
    {
      icon: Heart,
      value: data?.happyClients ?? 0,
      suffix: "+",
      label: "Happy Clients",
    },
    {
      icon: Globe,
      value: data?.countriesCovered ?? 0,
      suffix: "+",
      label: "Countries Covered",
    },
  ];

  if (isLoading) {
    return (
      <section className="bg-primary py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4 flex flex-col items-center">
                <div className="h-8 w-8 bg-white/20 rounded-lg animate-pulse" />
                <div className="h-10 w-32 bg-white/20 rounded-xl animate-pulse" />
                <div className="h-4 w-24 bg-white/20 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
