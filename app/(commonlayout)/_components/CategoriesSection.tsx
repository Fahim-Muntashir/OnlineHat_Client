// components/Home/CategoriesSection.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function CategoriesSection({ categories }: { categories: any[] }) {
  if (!categories.length) return null;

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Browse Categories
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Find the right service for your needs
            </p>
          </div>
          <Link
            href="/services"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            All services
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat: any) => (
            <Link key={cat.id} href={`/services?category=${cat.id}`}>
              <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  {cat.icon ? (
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    <span className="text-base">{cat.name.charAt(0)}</span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-700 group-hover:text-primary transition-colors">
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
