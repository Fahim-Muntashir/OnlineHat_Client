// src/app/(dashboard)/dashboard/admin/orders/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    icon: Clock,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    icon: AlertCircle,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-primary/10 text-primary border-primary/20",
    icon: Package,
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-50 text-red-500 border-red-100",
    icon: AlertCircle,
  },
};

type Filter =
  | "ALL"
  | "PENDING"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<Filter>("ALL");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/orders/my-orders");
      return res.data;
    },
  });

  const orders = data?.data ?? [];
  const filtered =
    filter === "ALL" ? orders : orders.filter((o: any) => o.status === filter);

  const counts = orders.reduce((acc: Record<string, number>, o: any) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const filters: { key: Filter; label: string }[] = [
    { key: "ALL", label: `All (${orders.length})` },
    { key: "PENDING", label: `Pending (${counts.PENDING ?? 0})` },
    { key: "IN_PROGRESS", label: `Active (${counts.IN_PROGRESS ?? 0})` },
    { key: "DELIVERED", label: `Delivered (${counts.DELIVERED ?? 0})` },
    { key: "COMPLETED", label: `Completed (${counts.COMPLETED ?? 0})` },
    { key: "CANCELLED", label: `Cancelled (${counts.CANCELLED ?? 0})` },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
        <p className="text-sm text-slate-400 mt-1">All platform orders</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all",
              filter === f.key
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-slate-500 border border-slate-200 hover:border-primary/30",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                {["Order ID", "Service", "Price", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading &&
                [1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-6 bg-slate-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-300 text-sm"
                  >
                    No orders found
                  </td>
                </tr>
              )}
              {!isLoading &&
                filtered.map((order: any) => {
                  const s = statusConfig[order.status] ?? statusConfig.PENDING;
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-slate-400">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-700 max-w-48 truncate">
                          {order.service?.title ?? "—"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {order.package?.title ?? "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-primary">
                          ৳{order.price}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`text-xs border font-medium ${s.color}`}
                        >
                          <s.icon size={10} className="mr-1" />
                          {s.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
