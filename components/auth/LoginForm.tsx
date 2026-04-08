// src/components/auth/LoginForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import { AuthStore } from "@/store/authStore";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Loader2, Zap, ShieldCheck, User, Users } from "lucide-react";

const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

export const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { mutate: login, isPending } = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      AuthStore.saveAuth(data.data.accessToken, data.data.user);
      toast.success("Welcome back!");
      const role = data.data.user.role;
      if (role === "ADMIN") router.push("/dashboard/admin");
      else if (role === "SELLER") router.push("/dashboard/seller");
      else router.push("/dashboard/buyer");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: ({ value }) => login(value),
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 animate-pulse"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
            animationDuration: "4s",
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-15 animate-pulse"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
            animationDuration: "6s",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-10 animate-pulse"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
            animationDuration: "5s",
            animationDelay: "1s",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="relative w-full max-w-md"
        style={{
          animation: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .field-1 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.1s; opacity: 0; }
          .field-2 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.2s; opacity: 0; }
          .field-3 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.3s; opacity: 0; }
          .field-4 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.4s; opacity: 0; }
          .shimmer {
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          @keyframes shimmer {
            from { background-position: -200% 0; }
            to   { background-position: 200% 0; }
          }
        `}</style>

        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

          <div className="px-8 pt-8 pb-10">
            {/* Header */}
            <div className="mb-8">
              <div className="field-1 flex items-center gap-2 mb-5">
                <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                  <Zap size={16} className="text-white fill-white" />
                </div>
                <span className="text-sm font-bold text-primary tracking-tight">
                  Online Hat
                </span>
              </div>
              <h1 className="field-2 text-2xl font-black text-slate-900 tracking-tight">
                Welcome back
              </h1>
              <p className="field-2 text-sm text-slate-400 mt-1">
                Sign in to continue to your account
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-5"
            >
              {/* Email field */}
              <div className="field-3">
                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => {
                      const result = emailSchema.safeParse(value);
                      return result.success
                        ? undefined
                        : result.error.issues[0].message;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                          focusedField === "email"
                            ? "text-primary"
                            : "text-slate-400"
                        }`}
                      >
                        Email Address
                      </label>
                      <div
                        className={`relative rounded-xl border-2 transition-all duration-200 ${
                          focusedField === "email"
                            ? "border-primary shadow-lg shadow-primary/10 bg-primary/[0.02]"
                            : field.state.meta.errors?.[0]
                              ? "border-red-300 bg-red-50/50"
                              : "border-slate-100 bg-slate-50 hover:border-slate-200"
                        }`}
                      >
                        <input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          disabled={isPending}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => {
                            setFocusedField(null);
                            field.handleBlur();
                          }}
                          className="w-full px-4 py-3 bg-transparent text-sm text-slate-800 placeholder:text-slate-300 outline-none rounded-xl disabled:opacity-50"
                        />
                      </div>
                      {field.state.meta.errors?.[0] && (
                        <p className="text-xs text-red-500 flex items-center gap-1 ml-1">
                          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                          {field.state.meta.errors[0].toString()}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              {/* Password field */}
              <div className="field-3">
                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) => {
                      const result = passwordSchema.safeParse(value);
                      return result.success
                        ? undefined
                        : result.error.issues[0].message;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                            focusedField === "password"
                              ? "text-primary"
                              : "text-slate-400"
                          }`}
                        >
                          Password
                        </label>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-primary hover:text-primary/70 transition-colors font-medium"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div
                        className={`relative rounded-xl border-2 transition-all duration-200 ${
                          focusedField === "password"
                            ? "border-primary shadow-lg shadow-primary/10 bg-primary/[0.02]"
                            : field.state.meta.errors?.[0]
                              ? "border-red-300 bg-red-50/50"
                              : "border-slate-100 bg-slate-50 hover:border-slate-200"
                        }`}
                      >
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={isPending}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onFocus={() => setFocusedField("password")}
                          onBlur={() => {
                            setFocusedField(null);
                            field.handleBlur();
                          }}
                          className="w-full px-4 py-3 pr-12 bg-transparent text-sm text-slate-800 placeholder:text-slate-300 outline-none rounded-xl disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors p-1"
                        >
                          {showPassword ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                      </div>
                      {field.state.meta.errors?.[0] && (
                        <p className="text-xs text-red-500 flex items-center gap-1 ml-1">
                          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                          {field.state.meta.errors[0].toString()}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              {/* Submit button */}
              <div className="field-4 pt-1">
                <button
                  type="submit"
                  disabled={isPending}
                  className="relative w-full h-12 rounded-xl bg-primary text-white font-semibold text-sm overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {/* Shimmer effect on hover */}
                  <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <span className="relative flex items-center justify-center gap-2">
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="field-4 flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-300 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Demo Credentials */}
            <div className="field-4 mt-2 mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">
                Quick Demo Access
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    form.setFieldValue("email", "admin@skilllink.com");
                    form.setFieldValue("password", "Admin123!");
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors shadow-sm">
                    <ShieldCheck size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary transition-colors">Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    form.setFieldValue("email", "seller@skilllink.com");
                    form.setFieldValue("password", "Seller123!");
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-sm">
                    <Users size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary transition-colors">Seller</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    form.setFieldValue("email", "buyer@skilllink.com");
                    form.setFieldValue("password", "Buyer123!");
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors shadow-sm">
                    <User size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary transition-colors">Buyer</span>
                </button>
              </div>
            </div>

            {/* Register link */}
            <p className="field-4 text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-semibold hover:text-primary/70 transition-colors"
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom caption */}
        <p className="text-center text-xs text-slate-400 mt-5">
          By signing in, you agree to our{" "}
          <Link
            href="/terms"
            className="underline hover:text-slate-600 transition-colors"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-slate-600 transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};
