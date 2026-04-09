"use client";

import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Online Hat" className="h-10 w-auto invert brightness-0" />
            </div>
            <p className="text-sm text-primary-foreground/70">
              Connecting talented professionals with amazing opportunities
              worldwide.
            </p>
          </div>

          {/* For Clients */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">For Clients</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition"
                >
                  Find Freelancers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition"
                >
                  Post a Job
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">For Freelancers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition"
                >
                  Find Jobs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition"
                >
                  Sign Up
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition"
                >
                  Success Stories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition"
                >
                  Resource Center
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-primary-foreground/20 pt-12 mb-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-base">
              Subscribe to our newsletter
            </h4>
            <p className="text-sm text-primary-foreground/70">
              Get the latest opportunities and industry insights delivered to
              your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 border border-primary-foreground/20 focus:outline-none focus:border-primary-foreground"
              />
              <button className="bg-primary hover:bg-primary/90 text-foreground px-6 py-2 rounded-lg font-semibold transition">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/70">
          <p>&copy; 2024 Online Hat. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-foreground transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-foreground transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary-foreground transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
