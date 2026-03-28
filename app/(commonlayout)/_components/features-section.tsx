"use client";

import { useEffect, useRef, useState } from "react";
import {
  Shield,
  DollarSign,
  Clock,
  Zap,
  Headphones,
  Globe,
} from "lucide-react";

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: FeatureCard[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Verified Talent",
    description:
      "Connect with verified professionals through identity verification and skill assessments before joining our platform.",
    color: "bg-blue-500",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Secure Payments",
    description:
      "Funds are held in escrow and only released when you approve the work. Zero risk to you.",
    color: "bg-emerald-500",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Hire in 24 Hours",
    description:
      "Our matching algorithm connects you with the right talent fast. Most jobs receive proposals within 24 hours.",
    color: "bg-orange-500",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Hire in 24 Hours",
    description:
      "Our matching algorithm connects you with the right talent fast. Most jobs receive proposals within 24 hours.",
    color: "bg-orange-500",
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: "24/7 Support",
    description:
      "Our dedicated support team is always available to help you resolve disputes or answer questions.",
    color: "bg-cyan-500",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Talent Pool",
    description:
      "Access skilled professionals from 150+ countries with expertise in every domain imaginable.",
    color: "bg-pink-500",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: FeatureCard;
  index: number;
}) {
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
    <div
      ref={ref}
      className={`bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
      }}
    >
      <div
        className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}
      >
        {feature.icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}

export function FeaturesSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={titleRef}
          className={`text-center mb-12 transition-all duration-700 ${
            titleVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wide mb-2">
            Our Advantage
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose FreelanceHub?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We built FreelanceHub to solve the problems every freelancer and
            client faces on other platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={`${feature.title}-${index}`}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
