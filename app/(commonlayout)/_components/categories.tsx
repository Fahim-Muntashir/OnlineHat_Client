"use client";

import { ArrowRight } from "lucide-react";

export default function Categories() {
  const categories = [
    "Web Development",
    "Mobile Apps",
    "Design & Creative",
    "Writing & Translation",
    "Digital Marketing",
    "Business Consulting",
  ];

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-primary font-semibold text-sm uppercase tracking-wide">
              What we offer
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Browse by Category
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Find skilled professionals ready to tackle your most important
              projects across every discipline.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="p-6 border border-border rounded-lg hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition mb-2">
                  {category}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse talented professionals in this category
                </p>
                <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition" />
              </div>
            ))}
          </div>

          {/* Explore All Link */}
          <div className="text-center">
            <a
              href="#"
              className="text-primary font-semibold flex items-center justify-center gap-2 hover:gap-3 transition"
            >
              Explore all <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
