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
      { threshold: 0.2 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 px-4">
      <div
        ref={ref}
        className={`max-w-3xl mx-auto bg-emerald-500 rounded-2xl p-12 md:p-16 text-white text-center transition-all duration-700 transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Ready to get started?
        </h2>
        <p className="text-lg text-emerald-50 mb-8 max-w-2xl mx-auto">
          Join over 50,000 freelancers and 30,000 clients who trust FreelanceHub
          to power their careers and businesses.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-emerald-600 hover:bg-gray-50 font-semibold flex items-center justify-center gap-2">
            Post a Job
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 font-semibold"
          >
            Find Work
          </Button>
        </div>
      </div>
    </section>
  );
}
