// src/app/(dashboard)/dashboard/seller/layout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PackageSearch,
  ShoppingBag,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  ChevronRight,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard/seller",
    icon: LayoutDashboard,
  },
  {
    label: "My Services",
    href: "/dashboard/seller/services",
    icon: PackageSearch,
  },
  {
    label: "Orders",
    href: "/dashboard/seller/orders",
    icon: ShoppingBag,
    badge: "3",
  },
  {
    label: "Reviews",
    href: "/dashboard/seller/reviews",
    icon: Star,
  },
  {
    label: "Messages",
    href: "/dashboard/seller/messages",
    icon: MessageSquare,
    badge: "5",
  },
  {
    label: "Earnings",
    href: "/dashboard/seller/earnings",
    icon: TrendingUp,
  },
  {
    label: "Settings",
    href: "/dashboard/seller/settings",
    icon: Settings,
  },
];

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = AuthStore.getUser();
    if (!u || u.role !== "SELLER") {
      router.push("/login");
      return;
    }
    setUser(u);
  }, [router]);

  const handleLogout = () => {
    AuthStore.clearAuth();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 z-50 flex flex-col",
          "bg-white border-r border-gray-200",
          "transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <span className="text-xs font-black text-white">S</span>
            </div>
            <span className="text-sm font-bold tracking-tight">Online Hat</span>
          </Link>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-900"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase() ?? "S"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.name ?? "Seller"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <Badge className="bg-violet-100 text-primary border-0 text-[10px] px-2">
              PRO
            </Badge>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard/seller"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                  isActive
                    ? "bg-violet-100 text-green-600 font-medium"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
                )}
              >
                <item.icon
                  size={17}
                  className={isActive ? "text-primary" : ""}
                />
                <span className="flex-1">{item.label}</span>

                {item.badge && (
                  <span className="h-5 min-w-5 flex items-center justify-center rounded-full bg-green-500 text-white text-[10px] font-bold px-1.5">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <ChevronRight size={14} className="text-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-4 lg:px-8 gap-4 sticky top-0 z-30">
          <button
            className="lg:hidden text-gray-400 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          {/* Notifications */}
          <button className="relative h-9 w-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-500" />
          </button>

          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() ?? "S"}
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
