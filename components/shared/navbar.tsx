"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const u = AuthStore.getUser();
    setUser(u);
  }, []);

  if (!mounted) return null; // prevents hydration mismatch

  const dashLink =
    user?.role === "ADMIN"
      ? "/dashboard/admin"
      : user?.role === "SELLER"
        ? "/dashboard/seller"
        : "/dashboard/buyer";

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-primary">
          SkillLink
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
          <Link
            href="/services"
            className="hover:text-primary transition-colors"
          >
            Browse Services
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link href={dashLink}>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 text-slate-600"
              >
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-500">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
