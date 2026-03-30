// src/app/payment/page.tsx
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Suspense, useState } from "react";
import Link from "next/link";
import {
  Lock,
  ShoppingBag,
  Clock,
  CreditCard,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [redirecting, setRedirecting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["order-payment", orderId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/orders/${orderId}`);
      return res.data;
    },
    enabled: !!orderId,
  });

  const { mutate: initiatePayment, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/payment/initiate/${orderId}`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.url) {
        setRedirecting(true);
        window.location.href = data.url;
      } else {
        toast.error("Failed to get payment URL");
      }
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || "Payment initiation failed");
    },
  });

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-full max-w-md px-4 space-y-4">
          <div className="h-8 bg-slate-200 rounded-xl w-1/2 animate-pulse" />
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-slate-700 font-semibold">Order not found</p>
          <Link href="/dashboard/buyer/orders">
            <Button variant="outline">My Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="text-lg font-bold text-primary">
            Online Hat
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-500">Payment</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <Link
          href={`/dashboard/buyer/orders`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors"
        >
          <ChevronLeft size={15} />
          My orders
        </Link>

        <h1 className="text-2xl font-bold text-slate-800">Complete Payment</h1>

        {/* Order card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 bg-primary/5 border-b border-primary/10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">
              Order Summary
            </p>
          </div>

          <div className="p-5 space-y-4">
            {/* Service */}
            <div className="flex items-center gap-3">
              <div className="h-12 w-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                {order.service?.images?.[0] ? (
                  <img
                    src={order.service.images[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <ShoppingBag size={16} className="text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 line-clamp-1">
                  {order.service?.title}
                </p>
                <p className="text-xs text-slate-400">{order.package?.title}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2.5 pt-3 border-t border-slate-50">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Package</span>
                <span className="font-medium text-slate-700">
                  {order.package?.type}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock size={12} />
                  Delivery
                </span>
                <span className="font-medium text-slate-700">
                  {order.deliveryDays} days
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-50">
                <span className="font-semibold text-slate-700">Total</span>
                <span className="text-xl font-black text-primary">
                  ৳{order.price}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">
            Payment Method
          </h2>

          <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary bg-primary/5">
            <CreditCard size={20} className="text-primary" />
            <div>
              <p className="text-sm font-semibold text-slate-700">SSLCommerz</p>
              <p className="text-xs text-slate-400">
                bKash, Nagad, Cards & more
              </p>
            </div>
            <div className="ml-auto h-4 w-4 rounded-full bg-primary flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 rounded-xl p-3">
            <Lock size={11} className="text-emerald-500 shrink-0" />
            <span>
              Your payment is secured by SSLCommerz. You will be redirected to
              complete payment.
            </span>
          </div>
        </div>

        {/* Pay button */}
        <Button
          onClick={() => initiatePayment()}
          disabled={isPending || redirecting}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base h-12 gap-2"
        >
          {redirecting ? (
            <>
              <ExternalLink size={18} />
              Redirecting to payment...
            </>
          ) : isPending ? (
            "Preparing payment..."
          ) : (
            <>
              <Lock size={16} />
              Pay ৳{order.price} Securely
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentContent />
    </Suspense>
  );
}
