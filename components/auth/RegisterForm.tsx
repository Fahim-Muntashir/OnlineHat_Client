// src/components/auth/RegisterForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Zap,
  ShoppingBag,
  Briefcase,
  Check,
} from "lucide-react";

const nameSchema = z.string().min(2, "Name must be at least 2 characters");
const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");
const roleSchema = z.enum(["BUYER", "SELLER"], { error: "Select a role" });

const getError = (errors: any[]): string | null => {
  if (!errors?.length) return null;
  const err = errors[0];
  if (typeof err === "string") return err;
  if (err?.message) return err.message;
  return err?.toString() ?? null;
};

export const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"BUYER" | "SELLER" | "">("");

  const { mutate: register, isPending } = useMutation({
    mutationFn: AuthService.register,
    onSuccess: () => {
      toast.success("Account created! Please login.");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Registration failed");
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "" as "BUYER" | "SELLER",
    },
    onSubmit: ({ value }) => {
      if (value.password !== value.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const { confirmPassword, ...payload } = value;
      register(payload);
    },
  });

  // reusable input wrapper
  const inputClass = (fieldName: string, hasError: boolean) =>
    `relative rounded-xl border-2 transition-all duration-200 ${
      focusedField === fieldName
        ? "border-primary shadow-lg shadow-primary/10 bg-primary/[0.02]"
        : hasError
          ? "border-red-300 bg-red-50/50"
          : "border-slate-100 bg-slate-50 hover:border-slate-200"
    }`;

  const labelClass = (fieldName: string) =>
    `text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
      focusedField === fieldName ? "text-primary" : "text-slate-400"
    }`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 py-10 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 animate-pulse"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
            animationDuration: "4s",
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15 animate-pulse"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
            animationDuration: "6s",
            animationDelay: "2s",
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
          .f1 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.05s; opacity: 0; }
          .f2 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.1s;  opacity: 0; }
          .f3 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.15s; opacity: 0; }
          .f4 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.2s;  opacity: 0; }
          .f5 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.25s; opacity: 0; }
          .f6 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.3s;  opacity: 0; }
          .f7 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.35s; opacity: 0; }
          .shimmer {
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          @keyframes shimmer {
            from { background-position: -200% 0; }
            to   { background-position: 200% 0; }
          }
          .role-card {
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .role-card:hover {
            transform: translateY(-2px);
          }
        `}</style>

        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

          <div className="px-8 pt-8 pb-10">
            {/* Header */}
            <div className="mb-7">
              <div className="f1 flex items-center gap-2 mb-5">
                <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                  <Zap size={16} className="text-white fill-white" />
                </div>
                <span className="text-sm font-bold text-primary tracking-tight">
                  Online Hat
                </span>
              </div>
              <h1 className="f2 text-2xl font-black text-slate-900 tracking-tight">
                Create your account
              </h1>
              <p className="f2 text-sm text-slate-400 mt-1">
                Join thousands of freelancers and buyers
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              {/* Name */}
              <div className="f3">
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) => {
                      const r = nameSchema.safeParse(value);
                      return r.success ? undefined : r.error.issues[0].message;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-1.5">
                      <label className={labelClass("name")}>Full Name</label>
                      <div
                        className={inputClass(
                          "name",
                          !!getError(field.state.meta.errors),
                        )}
                      >
                        <input
                          type="text"
                          placeholder="Fahim Ahmed"
                          disabled={isPending}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => {
                            setFocusedField(null);
                            field.handleBlur();
                          }}
                          className="w-full px-4 py-3 bg-transparent text-sm text-slate-800 placeholder:text-slate-300 outline-none rounded-xl disabled:opacity-50"
                        />
                      </div>
                      {getError(field.state.meta.errors) && (
                        <p className="text-xs text-red-500 flex items-center gap-1 ml-1">
                          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                          {getError(field.state.meta.errors)}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              {/* Email */}
              <div className="f4">
                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => {
                      const r = emailSchema.safeParse(value);
                      return r.success ? undefined : r.error.issues[0].message;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-1.5">
                      <label className={labelClass("email")}>
                        Email Address
                      </label>
                      <div
                        className={inputClass(
                          "email",
                          !!getError(field.state.meta.errors),
                        )}
                      >
                        <input
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
                      {getError(field.state.meta.errors) && (
                        <p className="text-xs text-red-500 flex items-center gap-1 ml-1">
                          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                          {getError(field.state.meta.errors)}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              {/* Role — custom card picker */}
              <div className="f5">
                <form.Field
                  name="role"
                  validators={{
                    onChange: ({ value }) => {
                      const r = roleSchema.safeParse(value);
                      return r.success ? undefined : r.error.issues[0].message;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        I want to
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {
                            value: "BUYER" as const,
                            label: "Hire Talent",
                            sub: "Find & buy services",
                            icon: ShoppingBag,
                          },
                          {
                            value: "SELLER" as const,
                            label: "Sell Services",
                            sub: "Offer your skills",
                            icon: Briefcase,
                          },
                        ].map((option) => {
                          const isSelected = selectedRole === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              disabled={isPending}
                              onClick={() => {
                                setSelectedRole(option.value);
                                field.handleChange(option.value);
                              }}
                              className={`role-card relative text-left p-3.5 rounded-xl border-2 cursor-pointer ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                  : "border-slate-100 bg-slate-50 hover:border-slate-200"
                              }`}
                            >
                              {/* Check mark */}
                              {isSelected && (
                                <div className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                  <Check
                                    size={10}
                                    className="text-white"
                                    strokeWidth={3}
                                  />
                                </div>
                              )}
                              <div
                                className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 ${
                                  isSelected
                                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                                    : "bg-slate-200 text-slate-500"
                                }`}
                              >
                                <option.icon size={15} />
                              </div>
                              <p
                                className={`text-xs font-bold ${
                                  isSelected ? "text-primary" : "text-slate-700"
                                }`}
                              >
                                {option.label}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {option.sub}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                      {getError(field.state.meta.errors) && (
                        <p className="text-xs text-red-500 flex items-center gap-1 ml-1">
                          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                          {getError(field.state.meta.errors)}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              {/* Password */}
              <div className="f6">
                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) => {
                      const r = passwordSchema.safeParse(value);
                      return r.success ? undefined : r.error.issues[0].message;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-1.5">
                      <label className={labelClass("password")}>Password</label>
                      <div
                        className={inputClass(
                          "password",
                          !!getError(field.state.meta.errors),
                        )}
                      >
                        <input
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
                      {getError(field.state.meta.errors) && (
                        <p className="text-xs text-red-500 flex items-center gap-1 ml-1">
                          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                          {getError(field.state.meta.errors)}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              {/* Confirm Password */}
              <div className="f6">
                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChange: ({ value, fieldApi }) => {
                      const password = fieldApi.form.getFieldValue("password");
                      if (!value) return "Please confirm your password";
                      if (value !== password) return "Passwords do not match";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-1.5">
                      <label className={labelClass("confirm")}>
                        Confirm Password
                      </label>
                      <div
                        className={inputClass(
                          "confirm",
                          !!getError(field.state.meta.errors),
                        )}
                      >
                        <input
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={isPending}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onFocus={() => setFocusedField("confirm")}
                          onBlur={() => {
                            setFocusedField(null);
                            field.handleBlur();
                          }}
                          className="w-full px-4 py-3 pr-12 bg-transparent text-sm text-slate-800 placeholder:text-slate-300 outline-none rounded-xl disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((p) => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors p-1"
                        >
                          {showConfirm ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                      </div>
                      {getError(field.state.meta.errors) && (
                        <p className="text-xs text-red-500 flex items-center gap-1 ml-1">
                          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                          {getError(field.state.meta.errors)}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              {/* Submit */}
              <div className="f7 pt-1">
                <button
                  type="submit"
                  disabled={isPending}
                  className="relative w-full h-12 rounded-xl bg-primary text-white font-semibold text-sm overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
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
            <div className="f7 flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-300 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Login link */}
            <p className="f7 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:text-primary/70 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom caption */}
        <p className="text-center text-xs text-slate-400 mt-5">
          By creating an account, you agree to our{" "}
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
