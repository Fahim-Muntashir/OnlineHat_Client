// app/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { HeroSection } from "./_components/HeroSection";
import { StatsSection } from "./_components/StatsSection";
import { CategoriesSection } from "./_components/CategoriesSection";
import { ServicesSection } from "./_components/ServicesSection";
import Stats from "./_components/stats";
import { CTASection } from "./_components/cta-section";
import HowItWorks from "./_components/how-it-works";
import { TestimonialsSection } from "./_components/testimonial-section";
import FeaturedFreelancers from "./_components/featured-freelancer";
import { FeaturesSection } from "./_components/features-section";
import { motion } from "framer-motion";

export default function HomePage() {
  const { data: servicesData } = useQuery({
    queryKey: ["home-services"],
    queryFn: async () => (await axiosInstance.get("/services")).data,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await axiosInstance.get("/categories")).data,
  });

  const services = servicesData?.data ?? [];
  const categories = categoriesData?.data ?? [];

  const topRated = [...services]
    .sort((a: any, b: any) => (b.avgRating ?? 0) - (a.avgRating ?? 0))
    .slice(0, 8)
    .filter((s: any) => s.avgRating > 0);

  const featured = services.slice(0, 8);

  return (
    <div className=" bg-white overflow-x-hidden">
      <HeroSection />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <StatsSection servicesCount={services.length} />
      </motion.div>

      <motion.div
        id="categories"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <CategoriesSection categories={categories} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Stats />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <FeaturesSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <TestimonialsSection />
      </motion.div>

      <motion.div
        id="freelancers"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <FeaturedFreelancers />
      </motion.div>

      <motion.div
        id="how-it-works"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <HowItWorks />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <CTASection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <ServicesSection
          title="Featured Services"
          subtitle="Hand-picked top services"
          services={featured}
        />
      </motion.div>

      <motion.div
        id="services"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <ServicesSection
          title="⭐ Top Rated"
          subtitle="Highest rated by buyers"
          services={topRated.slice(0, 4)}
        />
      </motion.div>
    </div>
  );
}
