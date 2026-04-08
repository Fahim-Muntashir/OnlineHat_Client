import { CountUp } from "@/components/shared/CountUp";

export function StatsSection({ servicesCount }: { servicesCount: number }) {
  return (
    <section className="border-b border-slate-100 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-3 divide-x divide-slate-100">
        <div className="text-center px-4">
          <p className="text-2xl font-black text-primary">
            <CountUp to={servicesCount || 500} suffix="+" />
          </p>
          <p className="text-xs text-slate-400 mt-1">Services Available</p>
        </div>
        <div className="text-center px-4">
          <p className="text-2xl font-black text-primary">
            <CountUp to={100} suffix="%" />
          </p>
          <p className="text-xs text-slate-400 mt-1">Secure Payments</p>
        </div>
        <div className="text-center px-4">
          <p className="text-2xl font-black text-primary">24/7</p>
          <p className="text-xs text-slate-400 mt-1">Support</p>
        </div>
      </div>
    </section>
  );
}
