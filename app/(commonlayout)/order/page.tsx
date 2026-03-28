// src/app/order/page.tsx
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Suspense } from "react";
import Link from "next/link";
import {
  Clock,
  RefreshCw,
  ShoppingBag,
  ChevronLeft,
  CheckCircle,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PACKAGE_COLORS: Record<string, string> = {
  BASIC: "bg-slate-100 text-slate-600",
  STANDARD: "bg-primary/10 text-primary",
  PREMIUM: "bg-amber-50 text-amber-600",
};

function OrderForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get("serviceId");
  const packageId = searchParams.get("packageId");

  const { data: serviceData, isLoading } = useQuery({
    queryKey: ["service-order", serviceId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/services/${serviceId}`);
      return res.data;
    },
    enabled: !!serviceId,
  });

  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post("/orders", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Order placed successfully!");
      router.push(`/payment?orderId=${data.data.id}`);
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || "Failed to place order");
    },
  });

  const form = useForm({
    defaultValues: { requirements: "" },
    onSubmit: ({ value }) => {
      createOrder({
        serviceId,
        packageId,
        requirements: value.requirements || undefined,
      });
    },
  });

  const service = serviceData?.data;
  const pkg = service?.packages?.find((p: any) => p.id === packageId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-full max-w-2xl px-4 space-y-4">
          <div className="h-8 bg-slate-200 rounded-xl w-1/2 animate-pulse" />
          <div className="h-48 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!service || !pkg) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-slate-700 font-semibold">
            Invalid order parameters
          </p>
          <Link href="/services">
            <Button variant="outline">Back to services</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="text-lg font-bold text-primary">
            SkillLink
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-500">Place Order</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Back */}
        <Link
          href={`/services/${serviceId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors"
        >
          <ChevronLeft size={15} />
          Back to service
        </Link>

        <h1 className="text-2xl font-bold text-slate-800">Place Your Order</h1>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left — form */}
          <div className="lg:col-span-3 space-y-5">
            {/* Service summary */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4">
              <div className="h-16 w-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                {service.images?.[0] ? (
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <ShoppingBag size={18} className="text-slate-300" />
                  </div>
                )}
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">
                  {service.title}
                </p>
                <p className="text-xs text-slate-400">
                  By {service.seller?.user?.name}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
              <h2 className="text-sm font-semibold text-slate-700">
                Project Requirements
              </h2>
              <p className="text-xs text-slate-400">
                Tell the seller exactly what you need. Be as specific as
                possible to get the best results.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                <form.Field name="requirements">
                  {(field) => (
                    <textarea
                      rows={6}
                      placeholder="Describe your project requirements, goals, preferences, and any specific details the seller should know..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  )}
                </form.Field>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-semibold gap-2"
                >
                  <ShoppingBag size={16} />
                  {isPending ? "Placing Order..." : "Place Order & Pay"}
                </Button>
              </form>
            </div>
          </div>

          {/* Right — order summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-20">
              <div className="p-5 bg-primary/5 border-b border-primary/10">
                <h3 className="text-sm font-semibold text-slate-700">
                  Order Summary
                </h3>
              </div>

              <div className="p-5 space-y-4">
                {/* Package */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full",
                        PACKAGE_COLORS[pkg.type],
                      )}
                    >
                      {pkg.type}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      ৳{pkg.price}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    {pkg.title}
                  </p>
                  {pkg.description && (
                    <p className="text-xs text-slate-400">{pkg.description}</p>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2.5 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={13} className="text-primary" />
                    <span>{pkg.deliveryDays} day delivery</span>
                  </div>
                  {pkg.revisions !== null && pkg.revisions !== undefined && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <RefreshCw size={13} className="text-primary" />
                      <span>{pkg.revisions} revisions</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle size={13} className="text-emerald-500" />
                    <span>Satisfaction guaranteed</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Total
                    </span>
                    <span className="text-xl font-black text-primary">
                      ৳{pkg.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                  <Lock size={11} />
                  Secure payment via SSLCommerz
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense>
      <OrderForm />
    </Suspense>
  );
}
