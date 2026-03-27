// src/app/(dashboard)/dashboard/buyer/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { AuthStore } from "@/store/authStore";
import Link from "next/link";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Search,
  Star,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: {
    label: "Pending",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-primary/10 text-primary border-primary/20",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-50 text-red-500 border-red-100",
  },
};

export default function BuyerOverviewPage() {
  const user = AuthStore.getUser();

  const { data: ordersData } = useQuery({
    queryKey: ["buyer-orders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/orders/my-orders");
      return res.data;
    },
  });

  const orders = ordersData?.data ?? [];
  const activeOrders = orders.filter((o: any) =>
    ["PENDING", "IN_PROGRESS", "DELIVERED"].includes(o.status),
  );
  const completedOrders = orders.filter((o: any) => o.status === "COMPLETED");
  const totalSpent = completedOrders.reduce(
    (acc: number, o: any) => acc + (o.price ?? 0),
    0,
  );

  const recentOrders = [...orders]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-48 opacity-10">
          <div className="h-full w-full bg-white rounded-l-full translate-x-16" />
        </div>
        <p className="text-primary-foreground/70 text-sm font-medium">
          Welcome back
        </p>
        <h1 className="text-2xl font-bold mt-1">
          {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-primary-foreground/70 text-sm mt-2">
          You have {activeOrders.length} active order
          {activeOrders.length !== 1 ? "s" : ""}
        </p>
        <Link href="/services">
          <Button
            size="sm"
            className="mt-4 bg-white text-primary hover:bg-white/90 gap-2 font-semibold"
          >
            <Search size={14} />
            Browse Services
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Orders",
            value: orders.length,
            icon: ShoppingBag,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Completed",
            value: completedOrders.length,
            icon: CheckCircle,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Total Spent",
            value: `৳${totalSpent.toLocaleString()}`,
            icon: Star,
            color: "bg-primary/10 text-primary",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <div
              className={`h-9 w-9 rounded-xl ${stat.color} flex items-center justify-center mb-3`}
            >
              <stat.icon size={16} />
            </div>
            <p className="text-xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
          <h2 className="text-sm font-semibold text-slate-700">
            Recent Orders
          </h2>
          <Link
            href="/dashboard/buyer/orders"
            className="text-xs text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package size={28} className="text-slate-200 mx-auto" />
            <p className="text-slate-300 text-sm">No orders yet</p>
            <Link href="/services">
              <Button
                size="sm"
                className="bg-primary text-white hover:bg-primary/90 gap-2"
              >
                <Search size={13} />
                Find a service
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {recentOrders.map((order: any) => {
              const s = statusConfig[order.status] ?? statusConfig.PENDING;
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <ShoppingBag size={15} className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {order.service?.title ?? "Service"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {order.package?.title} · ৳{order.price}
                    </p>
                  </div>
                  <Badge className={`text-xs border font-medium ${s.color}`}>
                    {s.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
