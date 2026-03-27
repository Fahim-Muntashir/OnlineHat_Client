// src/app/(dashboard)/dashboard/admin/layout.tsx
"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard,
  Users,
  PackageSearch,
  ShoppingBag,
  Tag,
  Star,
  BarChart2,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    label: "Services",
    href: "/dashboard/admin/services",
    icon: PackageSearch,
  },
  {
    label: "Orders",
    href: "/dashboard/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Categories",
    href: "/dashboard/admin/categories",
    icon: Tag,
  },
  {
    label: "Reviews",
    href: "/dashboard/admin/reviews",
    icon: Star,
  },
  {
    label: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart2,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      navItems={navItems}
      role="ADMIN"
      accentColor="bg-primary"
      accentBg="bg-primary/10"
      accentText="text-primary"
      accentBorder="border-primary/20"
    >
      {children}
    </DashboardShell>
  );
}
