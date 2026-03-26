"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header
      className="bg-background border-b border-border sticky top-0 z-50 animate-fadeInDown"
      style={{ animation: "fadeInDown 0.5s ease-out" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-lg font-bold group-hover:scale-110 transition-transform">
              FH
            </div>
            <span className="font-bold text-lg text-foreground group-hover:text-primary transition">
              FreelanceHub
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-foreground hover:text-primary hover:underline hover:underline-offset-4 transition text-sm font-medium"
            >
              Find Work
            </a>
            <a
              href="#"
              className="text-foreground hover:text-primary hover:underline hover:underline-offset-4 transition text-sm font-medium"
            >
              Find Talent
            </a>
            <a
              href="#"
              className="text-foreground hover:text-primary hover:underline hover:underline-offset-4 transition text-sm font-medium"
            >
              Dashboard
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link href={"/login"}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 text-sm font-medium transition-all hover:shadow-lg hover:scale-105">
                Login
              </Button>
            </Link>
            {/* <button className="flex items-center gap-2 text-foreground hover:text-primary transition text-sm hover:bg-secondary/50 px-3 py-2 rounded-lg">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Alex Wong</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 text-sm font-medium transition-all hover:shadow-lg hover:scale-105">
              Post a Job
            </Button> */}
          </div>
        </div>
      </div>
    </header>
  );
}
