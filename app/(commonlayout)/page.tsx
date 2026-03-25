import Categories from "./_components/categories";
import { CTASection } from "./_components/cta-section";
import FeaturedFreelancers from "./_components/featured-freelancer";
import FeaturedJobs from "./_components/featured-job";
import { FeaturesSection } from "./_components/features-section";
import Hero from "./_components/hero-section";
import HowItWorks from "./_components/how-it-works";
import Stats from "./_components/stats";
import { TestimonialsSection } from "./_components/testimonial-section";

export default function Home() {
  return (
    <div>
      <Hero></Hero>
      <Stats />
      <Categories />
      <HowItWorks />
      <FeaturedJobs />
      <FeaturedFreelancers />
    </div>
  );
}
