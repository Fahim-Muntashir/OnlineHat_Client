// src/app/payment/cancel/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function CancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-10 max-w-md w-full text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
          <AlertCircle size={40} className="text-amber-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">
            Payment Cancelled
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            You cancelled the payment. Your order is still saved — you can
            complete the payment anytime from your orders page.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link href="/dashboard/buyer/orders">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white gap-2">
              <ShoppingBag size={15} />
              View My Orders
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="ghost" className="w-full text-slate-400 gap-2">
              <ArrowLeft size={14} />
              Continue Browsing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
// what is the suspence
export default function PaymentCancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  );
}
