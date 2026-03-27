// src/app/(dashboard)/dashboard/buyer/saved/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { Heart, Star, ImageOff, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BuyerSavedPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["buyer-profile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/buyer-profiles/me");
      return res.data;
    },
  });

  const savedServices = data?.data?.savedServices ?? [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Saved Services</h1>
        <p className="text-sm text-slate-400 mt-1">
          {savedServices.length} saved service
          {savedServices.length !== 1 ? "s" : ""}
        </p>
      </div>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 h-56 animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && savedServices.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center space-y-4">
          <Heart size={28} className="text-slate-200 mx-auto" />
          <div>
            <p className="text-slate-700 font-semibold">No saved services</p>
            <p className="text-slate-400 text-sm mt-1">
              Browse services and save your favourites
            </p>
          </div>
          <Link href="/services">
            <Button className="bg-primary text-white hover:bg-primary/90 gap-2">
              <Search size={14} />
              Browse Services
            </Button>
          </Link>
        </div>
      )}

      {!isLoading && savedServices.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedServices.map((service: any) => (
            <Link key={service.id} href={`/services/${service.id}`}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="h-40 bg-slate-50 relative overflow-hidden">
                  {service.images?.[0] ? (
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <ImageOff size={20} className="text-slate-200" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                    <Heart size={12} className="text-red-400 fill-red-400" />
                  </div>
                  {service.category && (
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-white/90 text-slate-600 border-0 text-[10px] shadow-sm">
                        {service.category.name}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-700 line-clamp-2 leading-snug">
                    {service.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star
                        size={11}
                        className="text-amber-400 fill-amber-400"
                      />
                      <span className="text-xs text-slate-400">
                        {service.avgRating?.toFixed(1) ?? "0.0"}
                      </span>
                    </div>
                    {service.packages?.length > 0 && (
                      <span className="text-sm font-bold text-primary">
                        From ৳
                        {Math.min(...service.packages.map((p: any) => p.price))}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
