// src/app/(dashboard)/dashboard/admin/reviews/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Star, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={11}
        className={
          i <= rating
            ? "text-amber-400 fill-amber-400"
            : "text-slate-200 fill-slate-200"
        }
      />
    ))}
  </div>
);

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();

  const { data: servicesData } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const res = await axiosInstance.get("/services");
      return res.data;
    },
  });

  const services = servicesData?.data ?? [];

  const { data: allReviews, isLoading } = useQuery({
    queryKey: ["admin-all-reviews", services.map((s: any) => s.id)],
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

  const { mutate: deleteReview } = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/reviews/${id}`);
    },
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-all-reviews"] });
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const reviews = allReviews ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reviews</h1>
        <p className="text-sm text-slate-400 mt-1">Moderate platform reviews</p>
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

      {!isLoading && reviews.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <MessageSquare size={24} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-300 text-sm">No reviews yet</p>
        </div>
      )}

      {!isLoading && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-semibold text-primary">
                    {review.serviceTitle}
                  </p>
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-slate-300">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-slate-600">"{review.comment}"</p>
                )}
                <p className="text-xs text-slate-400">
                  — {review.buyer?.user?.name ?? "Buyer"}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteReview(review.id)}
                className="h-8 w-8 p-0 text-slate-300 hover:text-red-500 hover:bg-red-50 shrink-0"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
