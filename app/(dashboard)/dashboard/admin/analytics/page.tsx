// src/app/(dashboard)/dashboard/admin/analytics/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Star,
  PackageSearch,
} from "lucide-react";

const MetricCard = ({
  label,
  value,
  icon: Icon,
  description,
}: {
  label: string;
  value: string | number;
  icon: any;
  description?: string;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon size={16} className="text-primary" />
      </div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </p>
    </div>
    <p className="text-3xl font-black text-slate-800">{value}</p>
    {description && (
      <p className="text-xs text-slate-400 mt-1">{description}</p>
    )}
  </div>
);

export default function AdminAnalyticsPage() {
  const { data: usersData } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await axiosInstance.get("/users")).data,
  });

  const { data: servicesData } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => (await axiosInstance.get("/services")).data,
  });

  const { data: ordersData } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => (await axiosInstance.get("/orders/my-orders")).data,
  });

  const users = usersData?.data ?? [];
  const services = servicesData?.data ?? [];
  const orders = ordersData?.data ?? [];

  const completed = orders.filter((o: any) => o.status === "COMPLETED");
  const totalRevenue = completed.reduce(
    (acc: number, o: any) => acc + (o.price ?? 0),
    0,
  );
  const avgOrderValue =
    completed.length > 0 ? totalRevenue / completed.length : 0;

  const avgRating =
    services.length > 0
      ? services.reduce((acc: number, s: any) => acc + (s.avgRating ?? 0), 0) /
        services.length
      : 0;

  const completionRate =
    orders.length > 0
      ? ((completed.length / orders.length) * 100).toFixed(1)
      : "0.0";

  const metrics = [
    {
      label: "Total Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "From completed orders",
    },
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      description: `${users.filter((u: any) => u.role === "SELLER").length} sellers · ${users.filter((u: any) => u.role === "BUYER").length} buyers`,
    },
    {
      label: "Total Services",
      value: services.length,
      icon: PackageSearch,
      description: "Active listings",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      description: `${completed.length} completed`,
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      description: "Orders completed successfully",
    },
    {
      label: "Avg Order Value",
      value: `৳${avgOrderValue.toFixed(0)}`,
      icon: DollarSign,
      description: "Per completed order",
    },
    {
      label: "Platform Rating",
      value: avgRating.toFixed(1),
      icon: Star,
      description: "Across all services",
    },
  ];

  // Top rated services
  const topServices = [...services]
    .sort((a: any, b: any) => (b.avgRating ?? 0) - (a.avgRating ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">
          Platform performance metrics
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* Top rated services */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50">
          <h2 className="text-sm font-semibold text-slate-700">
            Top Rated Services
          </h2>
        </div>
        {topServices.length === 0 ? (
          <div className="p-12 text-center text-slate-300 text-sm">
            No data yet
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {topServices.map((service: any, i: number) => (
              <div
                key={service.id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <span className="text-sm font-black text-slate-200 w-5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {service.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {service.category?.name ?? "—"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-slate-700">
                    {service.avgRating?.toFixed(1) ?? "0.0"}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({service.totalReviews ?? 0})
                  </span>
                </div>
                <span className="text-sm font-bold text-primary">
                  {service.packages?.length > 0
                    ? `৳${Math.min(...service.packages.map((p: any) => p.price))}`
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
