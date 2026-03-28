// src/app/payment/success/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-10 max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">
            Payment Successful!
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your order has been placed and payment confirmed. The seller will
            start working on your project shortly.
          </p>
        </div>

        {orderId && (
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Order ID</p>
            <p className="text-sm font-mono font-semibold text-slate-700">
              #{orderId.slice(0, 12).toUpperCase()}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <Link href="/dashboard/buyer/orders">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white gap-2">
              <ShoppingBag size={16} />
              View My Orders
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="ghost" className="w-full text-slate-400 gap-2">
              Browse more services
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}

// ─────────────────────────────────────────────
// src/app/payment/fail/page.tsx
// ─────────────────────────────────────────────
// "use client";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { XCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Suspense } from "react";
//
// function FailContent() {
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get("orderId");
//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
//       <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-10 max-w-md w-full text-center space-y-6">
//         <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
//           <XCircle size={40} className="text-red-500" />
//         </div>
//         <div className="space-y-2">
//           <h1 className="text-2xl font-bold text-slate-800">Payment Failed</h1>
//           <p className="text-slate-500 text-sm">Your payment could not be processed. Please try again.</p>
//         </div>
//         {orderId && (
//           <Link href={`/payment?orderId=${orderId}`}>
//             <Button className="w-full bg-primary hover:bg-primary/90 text-white">Try Again</Button>
//           </Link>
//         )}
//         <Link href="/dashboard/buyer/orders">
//           <Button variant="ghost" className="w-full text-slate-400">View Orders</Button>
//         </Link>
//       </div>
//     </div>
//   );
// }
// export default function PaymentFailPage() { return <Suspense><FailContent /></Suspense>; }
