"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { DollarSign, TrendingUp, CheckCircle } from "lucide-react";

export default function SellerEarningsPage() {
  const { data: profileData } = useQuery({
    queryKey: ["seller-profile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/seller-profiles/me");
      return res.data;
    },
  });

  const { data: ordersData } = useQuery({
    queryKey: ["seller-orders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/orders/my-orders");
      return res.data;
    },
  });

  const earnings = profileData?.data?.earnings ?? 0;
  const orders = ordersData?.data ?? [];
  const completed = orders.filter((o: any) => o.status === "COMPLETED");
  const totalFromOrders = completed.reduce(
    (acc: number, o: any) => acc + (o.price ?? 0),
    0,
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your revenue and completed orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            label: "Total Earnings",
            value: `৳${earnings.toLocaleString()}`,
            icon: DollarSign,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Completed Orders",
            value: String(completed.length),
            icon: CheckCircle,
            color: "bg-violet-50 text-primary",
          },
          {
            label: "Revenue (calculated)",
            value: `৳${totalFromOrders.toLocaleString()}`,
            icon: TrendingUp,
            color: "bg-blue-50 text-blue-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4"
          >
            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center ${stat.color}`}
            >
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Completed orders table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">
            Completed Orders
          </h2>
        </div>

        {completed.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No completed orders yet
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {completed.map((order: any) => (
              <div key={order.id} className="flex items-center gap-4 px-5 py-4">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <CheckCircle size={15} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {order.service?.title ?? "Service"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.package?.title} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm font-bold text-emerald-600">
                  +৳{order.price}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
