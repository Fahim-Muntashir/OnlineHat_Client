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
import Categories from "./_components/categories";
import { FeaturesSection } from "./_components/features-section";

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
    <div className=" bg-white">
      <HeroSection />
      <StatsSection servicesCount={services.length} />
      <CategoriesSection categories={categories} />
      <Categories></Categories>
      <Stats></Stats>
      <FeaturesSection></FeaturesSection>
      <TestimonialsSection></TestimonialsSection>
      <FeaturedFreelancers></FeaturedFreelancers>
      <HowItWorks></HowItWorks>
      <CTASection></CTASection>
      {/* <ServicesSection
        title="Featured Services"
        subtitle="Hand-picked top services"
        services={featured}
      />
      <ServicesSection
        title="⭐ Top Rated"
        subtitle="Highest rated by buyers"
        services={topRated.slice(0, 4)}
      /> */}
    </div>
  );
}
