"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "FreelanceHub transformed how we hire. We found the perfect fit and shipped our MVP in 3 weeks. Absolutely world-class platform.",
    author: "Rachael Kim",
    role: "Founder, LeverTech AI",
    avatar: "RK",
    rating: 5,
    color: "bg-blue-500",
  },
  {
    id: "3",
    quote:
      "We hired a full data science team through FreelanceHub for an ambitious analysis project. The talent was outstanding and the platform made managing contracts effortless.",
    author: "Anita Osei",
    role: "CTO, DataWise",
    avatar: "AO",
    rating: 5,
    color: "bg-emerald-500",
  },
  {
    id: "3",
    quote:
      "We hired a full data science team through FreelanceHub for an ambitious analysis project. The talent was outstanding and the platform made managing contracts effortless.",
    author: "Anita Osei",
    role: "CTO, DataWise",
    avatar: "AO",
    rating: 5,
    color: "bg-emerald-500",
  },
  {
    id: "4",
    quote:
      "Using FreelanceHub increased my hourly rate in the first 4 months. This job quality here is leagues above other platforms. Expect better projects and higher pay.",
    author: "James Patel",
    role: "Freelance Developer",
    avatar: "JP",
    rating: 5,
    color: "bg-orange-500",
  },
  {
    id: "5",
    quote:
      "I worked with top writer through FreelanceHub. The whole process — from posting to first draft — took less than a week.",
    author: "Lucia Ferrari",
    role: "Marketing Director, Boom Co",
    avatar: "LF",
    rating: 5,
    color: "bg-pink-500",
  },
  {
    id: "5",
    quote:
      "I worked with top writer through FreelanceHub. The whole process — from posting to first draft — took less than a week.",
    author: "Lucia Ferrari",
    role: "Marketing Director, Boom Co",
    avatar: "LF",
    rating: 5,
    color: "bg-pink-500",
  },
];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
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
      className={`bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
      }}
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {testimonial.quote}
      </p>

      <div className="flex items-center gap-3">
        <div
          className={`${testimonial.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm`}
        >
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {testimonial.author}
          </p>
          <p className="text-xs text-gray-500">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
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
    <section className="py-16 bg-white">
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
            Success Stories
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by Clients & Freelancers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Thousands of people have found their ideal match on FreelanceHub.
            Here&apos;s what they say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.id}-${index}`}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
