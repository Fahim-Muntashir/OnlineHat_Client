"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle } from "lucide-react";

import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const router = useRouter();
  const lenis = useLenis();

  useEffect(() => {
    setMounted(true);
    const u = AuthStore.getUser();
    setUser(u);

    const handleScroll = () => {
      const sections = ["categories", "freelancers", "how-it-works", "services"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
            return;
          }
        }
      }
      if (scrollPosition < 500) setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      lenis?.scrollTo(`#${id}`, { offset: -80 });
    }
  };

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

  const navLinks = [
    { href: "/#categories", label: "Categories", id: "categories" },
    { href: "/#freelancers", label: "Freelancers", id: "freelancers" },
    { href: "/#how-it-works", label: "How it works", id: "how-it-works" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Online Hat" className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-500 font-medium">
          <Link href="/services" className="hover:text-primary transition-colors">
            Browse
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.id)}
              className={cn(
                "hover:text-primary transition-all relative py-1",
                activeSection === link.id ? "text-primary" : "text-slate-500"
              )}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus:outline-none"
              >
                <Avatar className="h-9 w-9 cursor-pointer transition-transform hover:scale-105 border border-slate-100 shadow-sm">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-sm text-slate-700 font-semibold border-b border-slate-100">
                    {user.name}
                  </div>

                  <Link
                    href={dashLink}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <Link
                    href={`${dashLink}/settings`}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile Settings
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
