"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Trusted by 10,000+ companies
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Find the perfect{" "}
              <span className="text-primary">freelance talent</span> for your
              business.
            </h1>

            <p className="text-lg text-muted-foreground">
              Connect with proven professionals for any project. Fast, secure,
              and hassle-free hiring tailored to your specific needs and budget.
            </p>

            <div className="flex gap-4 pt-4">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-lg text-base font-semibold">
                Hire Talent
              </Button>
              <Button
                variant="outline"
                className="px-8 py-6 rounded-lg text-base font-semibold border-foreground text-foreground hover:bg-secondary"
              >
                Find Work
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-8 border-t border-border">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Verified Profiles
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Secure Payments
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  24/7 Support
                </span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-primary/30 rounded-full mx-auto flex items-center justify-center">
                  <div className="w-20 h-20 bg-primary/50 rounded-full"></div>
                </div>
                <p className="text-primary font-semibold">Top Rated</p>
                <p className="text-sm text-muted-foreground">Fast Hiring</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
