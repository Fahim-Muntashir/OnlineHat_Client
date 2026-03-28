// components/Home/StatsSection.tsx
export function StatsSection({ servicesCount }: { servicesCount: number }) {
  return (
    <section className="border-b border-slate-100 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-3 divide-x divide-slate-100">
        {[
          { value: `${servicesCount}+`, label: "Services Available" },
          { value: "100%", label: "Secure Payments" },
          { value: "24/7", label: "Support" },
        ].map((stat) => (
          <div key={stat.label} className="text-center px-4">
            <p className="text-2xl font-black text-primary">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
