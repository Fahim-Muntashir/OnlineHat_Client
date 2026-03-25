"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";

export default function FeaturedJobs() {
  const jobs = [
    {
      id: 1,
      title: "React.js E-Commerce Platform",
      company: "TechStore Inc",
      budget: "$2,500 - $5,000",
      type: "Full-time Project",
    },
    {
      id: 2,
      title: "Mobile App UI/UX Design",
      company: "StartUp Labs",
      budget: "$1,500 - $3,000",
      type: "Contract",
    },
    {
      id: 3,
      title: "WordPress Website Development",
      company: "Digital Agency",
      budget: "$1,000 - $2,500",
      type: "Full-time Project",
    },
    {
      id: 4,
      title: "SEO & Content Strategy",
      company: "Growth Marketing",
      budget: "$800 - $1,500/month",
      type: "Part-time",
    },
  ];

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <p className="text-primary font-semibold text-sm uppercase tracking-wide">
                Latest Opportunities
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Featured Jobs
              </h2>
              <p className="text-muted-foreground text-lg">
                Browse hand-picked projects posted by top companies — ready for
                skilled freelancers like you.
              </p>
            </div>
            <a
              href="#"
              className="text-primary font-semibold hidden md:flex items-center gap-2 hover:gap-3 transition whitespace-nowrap"
            >
              All Jobs <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Jobs List */}
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-6 border border-border rounded-lg hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {job.company}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="text-sm font-medium text-primary">
                        {job.budget}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>

          {/* Browse All Button */}
          <div className="text-center md:hidden">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-full text-base font-semibold">
              Browse All Jobs <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
