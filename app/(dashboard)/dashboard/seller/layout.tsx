"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard,
  PackageSearch,
  ShoppingBag,
  Star,
  MessageSquare,
  TrendingUp,
  Settings,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard/seller",
    icon: LayoutDashboard,
    exact: true,
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
  },
  {
    label: "Earnings",
    href: "/dashboard/seller/earnings",
    icon: TrendingUp,
  },
  {
    label: "Profile",
    href: "/dashboard/seller/settings",
    icon: Settings,
  },
];

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      navItems={navItems}
      role="SELLER"
      accentColor="bg-primary"
      accentBg="bg-primary/5"
      accentText="text-primary"
      accentBorder="border-primary/10"
    >
      {children}
    </DashboardShell>
  );
}
