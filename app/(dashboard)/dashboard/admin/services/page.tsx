// src/app/(dashboard)/dashboard/admin/services/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import { Search, Trash2, Star, ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const res = await axiosInstance.get("/services");
      return res.data;
    },
  });

  const { mutate: deleteService } = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/services/${id}`);
    },
    onSuccess: () => {
      toast.success("Service deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
    },
    onError: () => toast.error("Failed to delete service"),
  });

  const services = data?.data ?? [];
  const filtered = services.filter((s: any) =>
    s.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Services</h1>
          <p className="text-sm text-slate-400 mt-1">
            {services.length} services on the platform
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <Input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-slate-200"
        />
      </div>

      {/* Grid */}
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

      {!isLoading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-300 text-sm">
          No services found
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service: any) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="h-36 bg-slate-50 relative">
                {service.images?.[0] ? (
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <ImageOff size={20} className="text-slate-200" />
                  </div>
                )}
                <button
                  onClick={() => deleteService(service.id)}
                  className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-white/90 flex items-center justify-center text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                >
                  <Trash2 size={13} />
                </button>
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
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-slate-400">
                      {service.avgRating?.toFixed(1) ?? "0.0"} ·{" "}
                      {service.totalReviews ?? 0} reviews
                    </span>
                  </div>
                  {service.packages?.length > 0 && (
                    <span className="text-xs font-bold text-primary">
                      From ৳
                      {Math.min(...service.packages.map((p: any) => p.price))}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
