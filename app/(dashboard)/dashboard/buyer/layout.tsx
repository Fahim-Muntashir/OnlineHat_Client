// src/app/(dashboard)/dashboard/buyer/layout.tsx
"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Star,
  MessageSquare,
  Settings,
  Search,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard/buyer",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Browse Services",
    href: "/services",
    icon: Search,
  },
  {
    label: "My Orders",
    href: "/dashboard/buyer/orders",
    icon: ShoppingBag,
  },
  {
    label: "Saved Services",
    href: "/dashboard/buyer/saved",
    icon: Heart,
  },
  {
    label: "My Reviews",
    href: "/dashboard/buyer/reviews",
    icon: Star,
  },
  {
    label: "Messages",
    href: "/dashboard/buyer/messages",
    icon: MessageSquare,
  },
  {
    label: "Profile",
    href: "/dashboard/buyer/settings",
    icon: Settings,
  },
];

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      navItems={navItems}
      role="BUYER"
      accentColor="bg-primary"
      accentBg="bg-primary/10"
      accentText="text-primary"
      accentBorder="border-primary/20"
    >
      {children}
    </DashboardShell>
  );
}
