"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Package,
  MoreVertical,
  ImageOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SellerServicesPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["seller-services"],
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
      queryClient.invalidateQueries({ queryKey: ["seller-services"] });
      setDeletingId(null);
    },
    onError: () => toast.error("Failed to delete service"),
  });

  const services = data?.data ?? [];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
          <p className="text-sm text-gray-500 mt-1">
            {services.length} service{services.length !== 1 ? "s" : ""}{" "}
            published
          </p>
        </div>

        <Link href="/dashboard/seller/services/new">
          <Button className="bg-primary hover:bg-primary-500 text-white gap-2">
            <Plus size={16} />
            New Service
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl h-64 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && services.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto">
            <Package size={24} className="text-primary" />
          </div>

          <div>
            <p className="text-gray-900 font-semibold">No services yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Create your first service and start earning
            </p>
          </div>

          <Link href="/dashboard/seller/services/new">
            <Button className="bg-violet-600 hover:bg-violet-500 text-white gap-2 mt-2">
              <Plus size={16} />
              Create Service
            </Button>
          </Link>
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && services.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service: any) => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-sm transition group"
            >
              {/* Image */}
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                {service.images?.[0] ? (
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <ImageOff size={24} className="text-gray-300" />
                  </div>
                )}

                {/* Dropdown */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <button className="h-7 w-7 rounded-lg bg-white/80 backdrop-blur flex items-center justify-center text-gray-600 hover:text-gray-900">
                        <MoreVertical size={14} />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="bg-white border border-gray-200 text-gray-900"
                    >
                      {/* ✅ FIXED: use router instead of Link */}
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/dashboard/seller/services/${service.id}/edit`,
                          )
                        }
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Pencil size={13} />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          setDeletingId(service.id);
                          deleteService(service.id);
                        }}
                      >
                        <Trash2 size={13} />
                        {deletingId === service.id ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Category */}
                {service.category && (
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-white/90 text-gray-700 border text-[10px]">
                      {service.category.name}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {service.title}
                </h3>

                <div className="flex items-center gap-1.5">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs text-gray-600">
                    {service.avgRating?.toFixed(1) ?? "0.0"}
                  </span>
                  <span className="text-gray-300 text-xs">·</span>
                  <span className="text-xs text-gray-500">
                    {service.totalReviews ?? 0} reviews
                  </span>
                </div>

                {service.packages?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">From</span>
                    <span className="text-sm font-bold text-gray-900">
                      ৳{Math.min(...service.packages.map((p: any) => p.price))}
                    </span>
                  </div>
                )}

                <Link
                  href={`/dashboard/seller/services/${service.id}/edit`}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-violet-700"
                >
                  <Pencil size={11} />
                  Edit service
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
