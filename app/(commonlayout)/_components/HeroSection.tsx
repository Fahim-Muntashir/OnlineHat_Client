// components/Home/HeroSection.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/services");
    }
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary/90 text-white pt-20 pb-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white translate-x-32 -translate-y-16" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary -translate-x-16 translate-y-16" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-7 relative z-10">
        <Badge className="bg-white/10 text-white border-white/20 text-xs px-3 py-1">
          🚀 Bangladesh's #1 Freelance Marketplace
        </Badge>

        <h1 className="text-5xl md:text-6xl font-black leading-tight">
          Hire experts or{" "}
          <span className="text-primary bg-white/10 px-3 rounded-xl inline-block">
            sell your skills
          </span>
        </h1>

        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          Connect with top freelancers for web development, design, writing,
          marketing and more. Fast, secure, affordable.
        </p>

        <div className="flex gap-2 max-w-xl mx-auto mt-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="What service are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40 h-12"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-primary hover:bg-primary/90 text-white h-12 px-6 font-semibold shrink-0"
          >
            Search
          </Button>
        </div>

        <p className="text-slate-400 text-sm">
          Popular:{" "}
          {["Web Design", "Logo Design", "SEO", "Writing"].map((t) => (
            <Link
              key={t}
              href={`/services?search=${t}`}
              className="text-white/70 hover:text-white underline underline-offset-2 mr-3 transition-colors"
            >
              {t}
            </Link>
          ))}
        </p>
      </div>
    </section>
  );
}
