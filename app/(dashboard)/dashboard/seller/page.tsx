"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { AuthStore } from "@/store/authStore";
import {
  TrendingUp,
  ShoppingBag,
  Star,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react";

// ---------- helpers ----------
const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: any;
  trend?: string;
  color: string;
}) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-sm transition">
    <div className="flex items-start justify-between">
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon size={18} />
      </div>

      {trend && (
        <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <ArrowUpRight size={11} />
          {trend}
        </span>
      )}
    </div>

    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);

const OrderRow = ({ order }: { order: any }) => {
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
      color: "text-violet-600 bg-violet-50",
      icon: Package,
    },
    COMPLETED: {
      label: "Completed",
      color: "text-emerald-600 bg-emerald-50",
      icon: CheckCircle,
    },
    CANCELLED: {
      label: "Cancelled",
      color: "text-red-600 bg-red-50",
      icon: AlertCircle,
    },
  };

  const s = statusConfig[order.status] ?? statusConfig.PENDING;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-200 last:border-0">
      <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
        <ShoppingBag size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {order.service?.title ?? "Service"}
        </p>
        <p className="text-xs text-gray-500">
          ৳{order.price} · {order.deliveryDays}d delivery
        </p>
      </div>

      <span
        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${s.color}`}
      >
        <s.icon size={11} />
        {s.label}
      </span>
    </div>
  );
};

// ---------- page ----------
export default function SellerOverviewPage() {
  const user = AuthStore.getUser();

  const { data: ordersData } = useQuery({
    queryKey: ["seller-orders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/orders/my-orders");
      return res.data;
    },
  });

  const { data: servicesData } = useQuery({
    queryKey: ["seller-services"],
    queryFn: async () => {
      const res = await axiosInstance.get("/services");
      return res.data;
    },
  });

  const { data: profileData } = useQuery({
    queryKey: ["seller-profile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/seller-profiles/me");
      return res.data;
    },
  });

  const orders = ordersData?.data ?? [];
  const services = servicesData?.data ?? [];
  const profile = profileData?.data;

  const completedOrders = orders.filter((o: any) => o.status === "COMPLETED");
  const activeOrders = orders.filter((o: any) =>
    ["PENDING", "IN_PROGRESS", "DELIVERED"].includes(o.status),
  );

  const totalEarnings = profile?.earnings ?? 0;

  const avgRating =
    services.length > 0
      ? (
          services.reduce(
            (acc: number, s: any) => acc + (s.avgRating ?? 0),
            0,
          ) / services.length
        ).toFixed(1)
      : "0.0";

  const recentOrders = [...orders]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here's what's happening with your services today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Earnings"
          value={`৳${totalEarnings.toLocaleString()}`}
          icon={DollarSign}
          color="bg-emerald-100 text-emerald-600"
          trend="+12%"
        />
        <StatCard
          label="Active Orders"
          value={String(activeOrders.length)}
          sub="Needs attention"
          icon={ShoppingBag}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Completed"
          value={String(completedOrders.length)}
          sub="All time"
          icon={CheckCircle}
          color="bg-violet-100 text-violet-600"
          trend="+3 this week"
        />
        <StatCard
          label="Avg Rating"
          value={avgRating}
          sub={`${services.length} services`}
          icon={Star}
          color="bg-amber-100 text-amber-600"
        />
      </div>

      {/* Two column */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Recent Orders
            </h2>
            <a
              href="/dashboard/seller/orders"
              className="text-xs text-violet-600 hover:text-violet-700"
            >
              View all →
            </a>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              No orders yet
            </div>
          ) : (
            recentOrders.map((order: any) => (
              <OrderRow key={order.id} order={order} />
            ))
          )}
        </div>

        {/* Services */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">My Services</h2>
            <a
              href="/dashboard/seller/services"
              className="text-xs text-violet-600 hover:text-violet-700"
            >
              Manage →
            </a>
          </div>

          {services.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-gray-400 text-sm">No services yet</p>
              <a
                href="/dashboard/seller/services/new"
                className="inline-flex items-center gap-1.5 text-xs bg-violet-100 text-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-200"
              >
                + Create your first service
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {services.slice(0, 4).map((service: any) => (
                <div
                  key={service.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
                    <TrendingUp size={14} className="text-violet-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {service.title}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      ⭐ {service.avgRating?.toFixed(1) ?? "0.0"} ·{" "}
                      {service.totalReviews ?? 0} reviews
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
