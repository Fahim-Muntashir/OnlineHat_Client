"use client";

import { FileText, CheckCircle, Users, CreditCard } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "Post Your Project",
      description:
        "Describe what you need, set your budget, and publish your job. It takes less than 5 minutes.",
    },
    {
      icon: CheckCircle,
      title: "Review Proposals",
      description:
        "Receive tailored proposals from qualified freelancers. Browse profiles, portfolios, and ratings.",
    },
    {
      icon: Users,
      title: "Hire & Collaborate",
      description:
        "Choose the best fit, fund the project, and work together seamlessly through our platform.",
    },
    {
      icon: CreditCard,
      title: "Pay Securely",
      description:
        "Release payment only when you&apos;re 100% satisfied. Your money is protected every step of the way.",
    },
  ];

  return (
    <section className="bg-background py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <p className="text-primary font-semibold text-sm uppercase tracking-wide">
              Simple Process
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              How it Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hire top talent in four easy steps. From posting your project to
              paying for great work — all in one place.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
