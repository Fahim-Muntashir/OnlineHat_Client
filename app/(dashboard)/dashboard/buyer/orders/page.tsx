// src/app/(dashboard)/dashboard/buyer/orders/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

const commentSchema = z.string().max(500).optional();

const getError = (errors: any[]) => {
  if (!errors?.length) return null;
  const e = errors[0];
  return typeof e === "string" ? e : (e?.message ?? e?.toString() ?? null);
};

// Review modal
const ReviewModal = ({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: async (data: { rating: number; comment?: string }) => {
      await axiosInstance.post("/reviews", { orderId, ...data });
    },
    onSuccess: () => {
      toast.success("Review submitted!");
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
      onClose();
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || "Failed to submit review"),
  });

  const form = useForm({
    defaultValues: { comment: "" },
    onSubmit: ({ value }) =>
      submitReview({ rating, comment: value.comment || undefined }),
  });

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Leave a Review</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Star picker */}
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  size={28}
                  className={
                    i <= (hover || rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200 fill-slate-200"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="comment">
            {(field) => (
              <div className="space-y-1.5">
                <label className="text-sm text-slate-500">
                  Comment <span className="text-slate-300">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Share your experience..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:border-primary/50 transition-colors"
                />
                {getError(field.state.meta.errors) && (
                  <p className="text-xs text-red-500">
                    {getError(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {isPending ? "Submitting..." : "Submit Review"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-slate-400"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Page
type Filter =
  | "ALL"
  | "PENDING"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export default function BuyerOrdersPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["buyer-orders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/orders/my-orders");
      return res.data;
    },
  });

  const { mutate: markComplete, isPending: isCompleting } = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.patch(`/orders/${id}/status`, {
        status: "COMPLETED",
      });
    },
    onSuccess: () => {
      toast.success("Order marked as completed");
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
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

  const filters: { key: Filter; label: string }[] = [
    { key: "ALL", label: `All (${orders.length})` },
    { key: "PENDING", label: `Pending (${counts.PENDING ?? 0})` },
    { key: "IN_PROGRESS", label: `Active (${counts.IN_PROGRESS ?? 0})` },
    { key: "DELIVERED", label: `Delivered (${counts.DELIVERED ?? 0})` },
    { key: "COMPLETED", label: `Completed (${counts.COMPLETED ?? 0})` },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {reviewOrderId && (
        <ReviewModal
          orderId={reviewOrderId}
          onClose={() => setReviewOrderId(null)}
        />
      )}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>
        <p className="text-sm text-slate-400 mt-1">Track all your purchases</p>
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

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 h-24 animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <ShoppingBag size={28} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-300 text-sm">No orders found</p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((order: any) => {
            const s = statusConfig[order.status] ?? statusConfig.PENDING;
            const isDelivered = order.status === "DELIVERED";
            const isCompleted = order.status === "COMPLETED";
            const hasReview = !!order.review;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <ShoppingBag size={16} className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-700">
                        {order.service?.title ?? "Service"}
                      </p>
                      <Badge
                        className={`text-[10px] border font-medium ${s.color}`}
                      >
                        <s.icon size={9} className="mr-1" />
                        {s.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">
                      {order.package?.title ?? "—"} ·{" "}
                      <span className="text-primary font-semibold">
                        ৳{order.price}
                      </span>{" "}
                      · {order.deliveryDays}d delivery
                    </p>
                    {order.requirements && (
                      <p className="text-xs text-slate-300 line-clamp-1">
                        "{order.requirements}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {isDelivered && (
                      <Button
                        size="sm"
                        onClick={() => markComplete(order.id)}
                        disabled={isCompleting}
                        className="bg-primary hover:bg-primary/90 text-white text-xs gap-1.5"
                      >
                        <CheckCircle size={12} />
                        Accept
                      </Button>
                    )}
                    {isCompleted && !hasReview && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReviewOrderId(order.id)}
                        className="text-xs border-primary/30 text-primary hover:bg-primary/5 gap-1.5"
                      >
                        <Star size={12} />
                        Review
                      </Button>
                    )}
                    {isCompleted && hasReview && (
                      <span className="text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={11} />
                        Reviewed
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between text-xs text-slate-300">
                  <span>#{order.id.slice(0, 8).toUpperCase()}</span>
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
