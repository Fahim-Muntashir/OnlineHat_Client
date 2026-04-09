// src/app/services/[id]/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  Clock,
  RefreshCw,
  ChevronLeft,
  ImageOff,
  Check,
  Heart,
  Share2,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const PACKAGE_COLORS: Record<string, string> = {
  BASIC: "border-slate-200 hover:border-slate-400",
  STANDARD: "border-primary/30 hover:border-primary",
  PREMIUM: "border-amber-300 hover:border-amber-500",
};

const PACKAGE_BADGE: Record<string, string> = {
  BASIC: "bg-slate-100 text-slate-600",
  STANDARD: "bg-primary/10 text-primary",
  PREMIUM: "bg-amber-50 text-amber-600",
};

const StarRating = ({ rating, count }: { rating: number; count?: number }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={
            i <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-slate-200 fill-slate-200"
          }
        />
      ))}
    </div>
    <span className="text-sm font-semibold text-slate-700">
      {rating?.toFixed(1) ?? "0.0"}
    </span>
    {count !== undefined && (
      <span className="text-sm text-slate-400">({count} reviews)</span>
    )}
  </div>
);

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(AuthStore.getUser());
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/services/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["service-reviews", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/reviews/service/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const service = data?.data;
  const reviews = reviewsData?.data ?? [];

  if (!mounted || isLoading || !id) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-4xl px-4">
          <div className="h-8 bg-slate-200 rounded-xl w-2/3 animate-pulse" />
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-slate-700 font-semibold">Service not found</p>
          <Link href="/services">
            <Button variant="outline">Back to services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedPkg = service.packages?.find(
    (p: any) => p.id === selectedPackage,
  );

  const handleOrder = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!selectedPackage) return;
    router.push(`/order?serviceId=${service.id}&packageId=${selectedPackage}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="text-lg font-bold text-primary">
            Online Hat
          </Link>
          <span className="text-slate-300">/</span>
          <Link
            href="/services"
            className="text-sm text-slate-500 hover:text-primary transition-colors"
          >
            Services
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-700 line-clamp-1 max-w-48">
            {service.title}
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — service info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Back */}
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors"
            >
              <ChevronLeft size={15} />
              Back to services
            </Link>

            {/* Title */}
            <div className="space-y-3">
              {service.category && (
                <Badge className="bg-primary/10 text-primary border-0 font-medium">
                  {service.category.name}
                </Badge>
              )}
              <h1 className="text-2xl font-bold text-slate-800 leading-snug">
                {service.title}
              </h1>

              {/* Seller + rating row */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {service.seller?.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {service.seller?.user?.name}
                  </span>
                </div>
                <StarRating
                  rating={service.avgRating ?? 0}
                  count={service.totalReviews ?? 0}
                />
              </div>
            </div>

            {/* Images */}
            {service.images?.length > 0 && (
              <div className="space-y-3">
                <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={service.images[activeImage]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {service.images.length > 1 && (
                  <div className="flex gap-2">
                    {service.images.map((img: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={cn(
                          "h-16 w-20 rounded-xl overflow-hidden border-2 transition-all",
                          activeImage === i
                            ? "border-primary"
                            : "border-transparent opacity-60 hover:opacity-100",
                        )}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3 shadow-sm">
              <h2 className="text-base font-semibold text-slate-800">
                About This Service
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Seller info */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-800 mb-4">
                About the Seller
              </h2>
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-lg font-black text-primary">
                    {service.seller?.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800">
                      {service.seller?.user?.name}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                      onClick={async () => {
                        if (!user) {
                          router.push("/login");
                          return;
                        }
                        if (user.role !== "BUYER") {
                          alert("Only buyers can contact sellers directly.");
                          return;
                        }
                        try {
                          const res = await axiosInstance.post(
                            "/chat/get-or-create-conversation",
                            { sellerId: service.sellerId },
                          );
                          router.push("/dashboard/buyer/messages");
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    >
                      <MessageSquare size={14} />
                      Contact Seller
                    </Button>
                  </div>
                  {service.seller?.bio && (
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {service.seller.bio}
                    </p>
                  )}
                  {service.seller?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {service.seller.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">
                  Reviews
                </h2>
                <StarRating
                  rating={service.avgRating ?? 0}
                  count={service.totalReviews ?? 0}
                />
              </div>

              {reviews.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">
                  No reviews yet
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="pb-4 border-b border-slate-50 last:border-0 last:pb-0 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-primary">
                              {review.buyer?.user?.name
                                ?.charAt(0)
                                .toUpperCase() ?? "B"}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-slate-700">
                            {review.buyer?.user?.name ?? "Buyer"}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size={11}
                              className={
                                i <= review.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-200 fill-slate-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-slate-600">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — sticky package selector */}
          <div className="space-y-4">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-50">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Choose a Package
                  </h3>
                </div>

                <div className="p-4 space-y-3">
                  {service.packages?.map((pkg: any) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all space-y-2",
                        selectedPackage === pkg.id
                          ? "border-primary bg-primary/5"
                          : (PACKAGE_COLORS[pkg.type] ??
                            "border-slate-200 hover:border-slate-300"),
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full",
                              PACKAGE_BADGE[pkg.type],
                            )}
                          >
                            {pkg.type}
                          </span>
                          <span className="text-sm font-semibold text-slate-700">
                            {pkg.title}
                          </span>
                        </div>
                        <span className="text-base font-bold text-primary">
                          ৳{pkg.price}
                        </span>
                      </div>

                      {pkg.description && (
                        <p className="text-xs text-slate-500">
                          {pkg.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {pkg.deliveryDays}d delivery
                        </span>
                        {pkg.revisions !== null &&
                          pkg.revisions !== undefined && (
                            <span className="flex items-center gap-1">
                              <RefreshCw size={11} />
                              {pkg.revisions} revisions
                            </span>
                          )}
                      </div>

                      {selectedPackage === pkg.id && (
                        <div className="flex items-center gap-1 text-xs text-primary font-medium">
                          <Check size={12} />
                          Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-4 border-t border-slate-50 space-y-3">
                  {selectedPkg && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Total</span>
                      <span className="text-lg font-bold text-primary">
                        ৳{selectedPkg.price}
                      </span>
                    </div>
                  )}
                  <Button
                    onClick={handleOrder}
                    disabled={!selectedPackage}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                  >
                    {!selectedPackage
                      ? "Select a Package"
                      : user
                        ? "Continue to Order"
                        : "Login to Order"}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 border-slate-200 text-slate-500"
                    >
                      <Heart size={13} />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 border-slate-200 text-slate-500"
                    >
                      <Share2 size={13} />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
