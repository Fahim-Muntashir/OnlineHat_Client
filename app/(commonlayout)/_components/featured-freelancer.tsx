"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { useState, useEffect } from "react";

export default function FeaturedFreelancers() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const freelancers = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Full-Stack Developer",
      rating: 4.9,
      reviews: 127,
      hourlyRate: "$85/hr",
    },
    {
      id: 2,
      name: "Alex Chen",
      title: "UI/UX Designer",
      rating: 4.8,
      reviews: 89,
      hourlyRate: "$65/hr",
    },
    {
      id: 3,
      name: "Maria Garcia",
      title: "Digital Marketer",
      rating: 4.9,
      reviews: 156,
      hourlyRate: "$55/hr",
    },
    {
      id: 4,
      name: "James Wilson",
      title: "Content Writer",
      rating: 4.7,
      reviews: 203,
      hourlyRate: "$35/hr",
    },
  ];

  return (
    <section className="bg-background py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div
              className="space-y-4 animate-fadeInDown"
              style={{ animation: "fadeInDown 0.6s ease-out" }}
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-wide">
                Top Talent
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Featured Freelancers
              </h2>
              <p className="text-muted-foreground text-lg">
                Meet some of our top professionals on the platform, ready to
                work on your next project.
              </p>
            </div>
            <a
              href="#"
              className="text-primary font-semibold hidden md:flex items-center gap-2 hover:gap-3 transition whitespace-nowrap"
            >
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Freelancers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {freelancers.map((freelancer, index) => (
              <div
                key={freelancer.id}
                className="p-6 border border-border rounded-lg hover:border-primary hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-3 transform relative overflow-hidden"
                style={{
                  animation: isVisible
                    ? `slideInUp 0.6s ease-out ${index * 0.12}s both`
                    : "none",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 group-hover:bg-primary/25 transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg transform">
                    <div className="w-14 h-14 bg-primary/30 rounded-full group-hover:animate-pulse"></div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors duration-300">
                      {freelancer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {freelancer.title}
                    </p>

                    <div className="flex items-center justify-center gap-1 pt-2">
                      <Star
                        className="w-4 h-4 fill-primary text-primary group-hover:animate-bounce"
                        style={{ animationDelay: "0s" }}
                      />
                      <span className="font-semibold text-foreground text-sm">
                        {freelancer.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({freelancer.reviews})
                      </span>
                    </div>

                    <p className="text-primary font-semibold text-sm pt-2 group-hover:text-lg transition-all duration-300">
                      {freelancer.hourlyRate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Browse All Button */}
          <div className="text-center md:hidden">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-full text-base font-semibold">
              Browse All Freelancers <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
