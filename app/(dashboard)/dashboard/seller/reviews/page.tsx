"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Star, MessageSquare } from "lucide-react";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={12}
        className={
          i <= rating
            ? "text-[var(--primary)] fill-[var(--primary)]"
            : "text-gray-300 fill-gray-300"
        }
      />
    ))}
  </div>
);

export default function SellerReviewsPage() {
  const { data: servicesData } = useQuery({
    queryKey: ["seller-services"],
    queryFn: async () => {
      const res = await axiosInstance.get("/services");
      return res.data;
    },
  });

  const services = servicesData?.data ?? [];

  const { data: allReviews, isLoading } = useQuery({
    queryKey: ["seller-all-reviews", services.map((s: any) => s.id)],
    queryFn: async () => {
      const results = await Promise.all(
        services.map((s: any) =>
          axiosInstance.get(`/reviews/service/${s.id}`).then((r) =>
            r.data.data.map((rev: any) => ({
              ...rev,
              serviceTitle: s.title,
            })),
          ),
        ),
      );
      return results.flat();
    },
    enabled: services.length > 0,
  });

  const reviews = allReviews ?? [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
        reviews.length
      : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">
          What buyers say about your work
        </p>
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-6">
        <div className="text-center">
          <p className="text-4xl font-black text-gray-900">
            {avgRating.toFixed(1)}
          </p>
          <StarRating rating={Math.round(avgRating)} />
          <p className="text-xs text-gray-400 mt-1">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r: any) => r.rating === star).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-4">{star}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-6">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews list */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl h-28 animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <MessageSquare size={24} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No reviews yet</p>
        </div>
      )}

      {!isLoading && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">
                    {review.serviceTitle}
                  </p>
                  <StarRating rating={review.rating} />
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  "{review.comment}"
                </p>
              )}
              <p className="text-xs text-gray-400">
                — {review.buyer?.user?.name ?? "Buyer"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
