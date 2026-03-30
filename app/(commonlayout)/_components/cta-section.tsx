"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
      `}</style>
      <div
        ref={ref}
        className={`w-full bg-primary text-primary-foreground text-center py-20 px-4 md:py-24 ${
          isVisible ? "animate-slide-up" : "opacity-0"
        }`}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join over 50,000 freelancers and 30,000 clients who trust Online Hat
            to power their careers and businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold flex items-center justify-center gap-2">
              Post a Job
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="border-2 text-white border-primary-foreground bg-primary-foreground/10 hover:text-white font-semibold"
            >
              Find Work
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
