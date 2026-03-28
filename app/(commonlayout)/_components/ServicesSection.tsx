// components/Home/ServicesSection.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";

export function ServicesSection({
  title,
  subtitle,
  services,
}: {
  title: string;
  subtitle: string;
  services: any[];
}) {
  if (!services.length) return null;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
          </div>
          <Link
            href="/services"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Browse all
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {services.map((service: any) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
