"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, User2, UserCircle } from "lucide-react";

export const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const u = AuthStore.getUser();
    setUser(u);
  }, []);

  if (!mounted) return null;

  const dashLink =
    user?.role === "ADMIN"
      ? "/dashboard/admin"
      : user?.role === "SELLER"
        ? "/dashboard/seller"
        : "/dashboard/buyer";

  const handleLogout = () => {
    AuthStore.clearAuth();
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-primary">
          Online Hat
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500 font-medium">
          <Link href="/services" className="hover:text-primary transition-colors">
            Browse
          </Link>
          <Link href="/#categories" className="hover:text-primary transition-colors">
            Categories
          </Link>
          <Link href="/#freelancers" className="hover:text-primary transition-colors">
            Freelancers
          </Link>
          <Link href="/#how-it-works" className="hover:text-primary transition-colors">
            How it works
          </Link>
        </nav>

        <div className="flex items-center gap-3 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus:outline-none"
              >
                <UserCircle className="w-8 cursor-pointer h-8 text-slate-600 hover:text-primary transition-colors" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-sm text-slate-700 font-semibold border-b border-slate-100">
                    {user.name}
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href={dashLink}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
