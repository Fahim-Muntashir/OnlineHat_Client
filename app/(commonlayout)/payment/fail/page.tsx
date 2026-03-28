// src/app/payment/fail/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function FailContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-10 max-w-md w-full text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <XCircle size={40} className="text-red-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">Payment Failed</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your payment could not be processed. This could be due to
            insufficient funds, an expired card, or a network issue.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          {orderId && (
            <Link href={`/payment?orderId=${orderId}`}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white gap-2">
                <RefreshCw size={15} />
                Try Again
              </Button>
            </Link>
          )}
          <Link href="/dashboard/buyer/orders">
            <Button variant="ghost" className="w-full text-slate-400 gap-2">
              <ArrowLeft size={14} />
              Back to My Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense>
      <FailContent />
    </Suspense>
  );
}
