// src/components/dashboard/DashboardShell.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  exact?: boolean;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  role: "ADMIN" | "BUYER";
  accentColor: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

export function DashboardShell({
  children,
  navItems,
  role,
  accentColor,
  accentBg,
  accentText,
  accentBorder,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = AuthStore.getUser();
    if (!u || u.role !== role) {
      router.push("/login");
      return;
    }
    setUser(u);
  }, [role, router]);

  const handleLogout = () => {
    AuthStore.clearAuth();
    router.push("/login");
  };

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 z-50 flex flex-col",
          "bg-white border-r border-slate-100 shadow-sm",
          "transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className={`h-8 w-8 rounded-xl ${accentColor} flex items-center justify-center shadow-sm`}
            >
              <span className="text-xs font-black text-white">S</span>
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight">
              Online Hat
            </span>
          </Link>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Role badge + user */}
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback
                className={`${accentColor} text-white text-sm font-bold`}
              >
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <Badge
              className={`${accentBg} ${accentText} border-0 text-[10px] font-semibold px-2 shrink-0`}
            >
              {role}
            </Badge>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
                  active
                    ? `${accentBg} ${accentText} font-medium`
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                )}
              >
                <item.icon
                  size={16}
                  className={active ? accentText : "text-slate-400"}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={`h-5 min-w-5 flex items-center justify-center rounded-full ${accentColor} text-white text-[10px] font-bold px-1.5`}
                  >
                    {item.badge}
                  </span>
                )}
                {active && <ChevronRight size={13} className={accentText} />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 lg:px-8 gap-4 sticky top-0 z-30 shadow-sm">
          <button
            className="lg:hidden text-slate-400 hover:text-slate-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Page title from pathname */}
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-slate-700 hidden sm:block capitalize">
              {pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}
            </h2>
          </div>

          {/* Bell */}
          <button
            className={`relative h-9 w-9 rounded-xl ${accentBg} flex items-center justify-center ${accentText} hover:opacity-80 transition-all`}
          >
            <Bell size={16} />
            <span
              className={`absolute top-1.5 right-1.5 h-2 w-2 rounded-full ${accentColor}`}
            />
          </button>

          {/* Avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="outline-none">
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarFallback
                    className={`${accentColor} text-white text-sm font-bold`}
                  >
                    {user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="text-slate-600 cursor-pointer">
                <User size={14} className="mr-2" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="text-slate-600 cursor-pointer">
                <Settings size={14} className="mr-2" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 cursor-pointer focus:text-red-500"
              >
                <LogOut size={14} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
