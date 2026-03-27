// src/app/(dashboard)/dashboard/buyer/reviews/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Star, MessageSquare } from "lucide-react";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={13}
        className={
          i <= rating
            ? "text-amber-400 fill-amber-400"
            : "text-slate-200 fill-slate-200"
        }
      />
    ))}
  </div>
);

export default function BuyerReviewsPage() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["buyer-orders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/orders/my-orders");
      return res.data;
    },
  });

  const orders = ordersData?.data ?? [];
  const reviewedOrders = orders.filter((o: any) => o.review);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Reviews</h1>
        <p className="text-sm text-slate-400 mt-1">
          {reviewedOrders.length} review{reviewedOrders.length !== 1 ? "s" : ""}{" "}
          submitted
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 h-28 animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && reviewedOrders.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <MessageSquare size={28} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-700 font-semibold">No reviews yet</p>
          <p className="text-slate-400 text-sm mt-1">
            Complete an order to leave a review
          </p>
        </div>
      )}

      {!isLoading && reviewedOrders.length > 0 && (
        <div className="space-y-3">
          {reviewedOrders.map((order: any) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-700">
                    {order.service?.title ?? "Service"}
                  </p>
                  <StarRating rating={order.review.rating} />
                </div>
                <span className="text-xs text-slate-300 shrink-0">
                  {new Date(order.review.createdAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
              {order.review.comment && (
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3">
                  "{order.review.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
