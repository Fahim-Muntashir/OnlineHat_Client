"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    icon: Clock,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    icon: AlertCircle,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-violet-50 text-primary border-violet-200",
    icon: Package,
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-50 text-red-600 border-red-200",
    icon: AlertCircle,
  },
};

const nextStatus: Record<string, string | null> = {
  PENDING: "IN_PROGRESS",
  IN_PROGRESS: "DELIVERED",
  DELIVERED: null,
  COMPLETED: null,
  CANCELLED: null,
};

const nextStatusLabel: Record<string, string> = {
  PENDING: "Start Order",
  IN_PROGRESS: "Mark Delivered",
};

type FilterType =
  | "ALL"
  | "PENDING"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export default function SellerOrdersPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterType>("ALL");

  const { data, isLoading } = useQuery({
    queryKey: ["seller-orders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/orders/my-orders");
      return res.data;
    },
  });

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await axiosInstance.patch(`/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
    },
    onError: () => toast.error("Failed to update order"),
  });

  const orders = data?.data ?? [];
  const filtered =
    filter === "ALL" ? orders : orders.filter((o: any) => o.status === filter);

  const counts = orders.reduce((acc: Record<string, number>, o: any) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const filters: { key: FilterType; label: string }[] = [
    { key: "ALL", label: `All (${orders.length})` },
    { key: "PENDING", label: `Pending (${counts.PENDING ?? 0})` },
    { key: "IN_PROGRESS", label: `Active (${counts.IN_PROGRESS ?? 0})` },
    { key: "DELIVERED", label: `Delivered (${counts.DELIVERED ?? 0})` },
    { key: "COMPLETED", label: `Completed (${counts.COMPLETED ?? 0})` },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and track all your incoming orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition",
              filter === f.key
                ? "bg-violet-100 text-violet-700 border border-violet-200"
                : "bg-white text-gray-500 hover:text-gray-900 border border-gray-200",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl h-24 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
          <ShoppingBag size={28} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No orders found</p>
        </div>
      )}

      {/* Orders */}
      {!isLoading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((order: any) => {
            const s = statusConfig[order.status] ?? statusConfig.PENDING;
            const next = nextStatus[order.status];

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <ShoppingBag size={17} className="text-gray-500" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">
                        {order.service?.title ?? "Service"}
                      </p>

                      <Badge
                        className={cn(
                          "text-[10px] border font-medium",
                          s.color,
                        )}
                      >
                        <s.icon size={10} className="mr-1" />
                        {s.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      <span>Package: {order.package?.title ?? "—"}</span>
                      <span>·</span>
                      <span className="text-gray-700 font-medium">
                        ৳{order.price}
                      </span>
                      <span>·</span>
                      <span>{order.deliveryDays}d delivery</span>
                    </div>

                    {order.requirements && (
                      <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                        "{order.requirements}"
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  {next && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateStatus({ id: order.id, status: next })
                      }
                      disabled={isUpdating}
                      className="bg-violet-600 hover:bg-violet-500 text-white text-xs"
                    >
                      {nextStatusLabel[order.status]}
                    </Button>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
                  <span>Order #{order.id.slice(0, 8).toUpperCase()}</span>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
