// src/app/(dashboard)/dashboard/admin/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import {
  Users,
  PackageSearch,
  ShoppingBag,
  Star,
  TrendingUp,
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  sub,
}: {
  label: string;
  value: string | number;
  icon: any;
  trend?: string;
  sub?: string;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon size={18} className="text-primary" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
          <ArrowUpRight size={11} />
          {trend}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-slate-300 mt-1">{sub}</p>}
  </div>
);

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-600 bg-amber-50",
    icon: Clock,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-blue-600 bg-blue-50",
    icon: AlertCircle,
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-primary bg-primary/10",
    icon: PackageSearch,
  },
  COMPLETED: {
    label: "Completed",
    color: "text-emerald-600 bg-emerald-50",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-500 bg-red-50",
    icon: AlertCircle,
  },
};

export default function AdminOverviewPage() {
  const { data: usersData } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users");
      return res.data;
    },
  });

  const { data: servicesData } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const res = await axiosInstance.get("/services");
      return res.data;
    },
  });

  const { data: ordersData } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/orders/my-orders");
      return res.data;
    },
  });

  const users = usersData?.data ?? [];
  const services = servicesData?.data ?? [];
  const orders = ordersData?.data ?? [];

  const totalRevenue = orders
    .filter((o: any) => o.status === "COMPLETED")
    .reduce((acc: number, o: any) => acc + (o.price ?? 0), 0);

  const recentOrders = [...orders]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  const buyers = users.filter((u: any) => u.role === "BUYER").length;
  const sellers = users.filter((u: any) => u.role === "SELLER").length;

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Overview</h1>
        <p className="text-sm text-slate-400 mt-1">
          Platform performance at a glance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={users.length}
          icon={Users}
          trend="+8%"
          sub={`${buyers} buyers · ${sellers} sellers`}
        />
        <StatCard
          label="Total Services"
          value={services.length}
          icon={PackageSearch}
          trend="+5%"
        />
        <StatCard
          label="Total Orders"
          value={orders.length}
          icon={ShoppingBag}
          trend="+12%"
        />
        <StatCard
          label="Total Revenue"
          value={`৳${totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          trend="+18%"
        />
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <h2 className="text-sm font-semibold text-slate-700">
              Recent Orders
            </h2>
            <a
              href="/dashboard/admin/orders"
              className="text-xs text-primary hover:underline"
            >
              View all →
            </a>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-300 text-sm">
              No orders yet
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentOrders.map((order: any) => {
                const s = statusConfig[order.status] ?? statusConfig.PENDING;
                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 px-6 py-3.5"
                  >
                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <ShoppingBag size={14} className="text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {order.service?.title ?? "Service"}
                      </p>
                      <p className="text-xs text-slate-400">
                        ৳{order.price} · {order.deliveryDays}d
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${s.color}`}
                    >
                      <s.icon size={10} />
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order status breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-5">
            Order Breakdown
          </h2>
          <div className="space-y-3">
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const count = orders.filter((o: any) => o.status === key).length;
              const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">{cfg.label}</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
