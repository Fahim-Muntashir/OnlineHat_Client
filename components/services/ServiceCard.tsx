import Link from "next/link";

import { Star, ImageOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export const ServiceCard = ({ service }: { service: any }) => {
  const minPrice =
    service.packages?.length > 0
      ? Math.min(...service.packages.map((p: any) => p.price))
      : null;

  return (
    <Link href={`/services/${service.id}`}>
      <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer">
        <div className="h-44 bg-slate-50 overflow-hidden relative">
          {service.images?.[0] ? (
            <img
              src={service.images[0]}
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <ImageOff size={22} className="text-slate-200" />
            </div>
          )}
          {service.category && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/95 text-slate-600 border-0 shadow-sm text-[10px] font-semibold">
                {service.category.name}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2.5">
          <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {service.title}
          </p>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[9px] font-bold text-primary">
                {service.seller?.user?.name?.charAt(0)}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {service.seller?.user?.name}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-50">
            <div className="flex items-center gap-1">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-slate-600">
                {service.avgRating?.toFixed(1) ?? "New"}
              </span>
              {service.totalReviews > 0 && (
                <span className="text-xs text-slate-300">
                  ({service.totalReviews})
                </span>
              )}
            </div>
            {minPrice !== null && (
              <span className="text-sm font-bold text-primary">
                From ৳{minPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
