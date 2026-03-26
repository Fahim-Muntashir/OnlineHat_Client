"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import {
  Plus,
  ArrowLeft,
  Package,
  Image as ImageIcon,
  Tag,
  FileText,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PackageCard } from "./_components/PackageCard";

// ---------- Zod Fixes ----------
const titleSchema = z.string().min(10, "Title must be at least 10 characters");
const descSchema = z
  .string()
  .min(20, "Description must be at least 20 characters");
const categorySchema = z.string().uuid("Please select a category");

export default function CreateServicePage() {
  const router = useRouter();
  const [packages, setPackages] = useState<any[]>([
    {
      type: "BASIC",
      title: "",
      description: "",
      price: "",
      deliveryDays: "",
      revisions: "",
    },
  ]);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await axiosInstance.get("/categories")).data,
  });

  const { mutate: createService, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      (await axiosInstance.post("/services", payload)).data,
    onSuccess: () => {
      toast.success("Service published!");
      router.push("/dashboard/seller/services");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });

  const form = useForm({
    defaultValues: { title: "", description: "", categoryId: "" },
    onSubmit: ({ value }) => {
      if (images.length === 0) return toast.error("Add at least one image");

      // Basic validation for packages
      const isInvalid = packages.some(
        (p) => !p.title || !p.price || !p.deliveryDays,
      );
      if (isInvalid) return toast.error("Please fill in all package details");

      const payload = {
        ...value,
        images,
        packages: packages.map((p) => ({
          ...p,
          price: parseFloat(p.price),
          deliveryDays: parseInt(p.deliveryDays),
          revisions: p.revisions ? parseInt(p.revisions) : undefined,
        })),
      };
      createService(payload);
    },
  });

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, imageUrl.trim()]);
    setImageUrl("");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 bg-slate-50/50 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/seller/services"
          className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-slate-600"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Service</h1>
          <p className="text-slate-500 text-sm">
            List your professional skills.
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        {/* Section: Basic Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <FileText size={18} className="text-indigo-500" />
            <h2 className="font-semibold text-slate-800">
              General Information
            </h2>
          </div>

          <form.Field name="title">
            {(field) => (
              <div className="space-y-2">
                <Label className="text-slate-700">Service Title</Label>
                <Input
                  className="border-slate-200 focus:ring-indigo-500"
                  placeholder="I will build a high-performance website..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label className="text-slate-700">Description</Label>
                <textarea
                  className="w-full min-h-[120px] p-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe what you offer..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="categoryId">
            {(field) => (
              <div className="space-y-2">
                <Label className="text-slate-700">Category</Label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categoriesData?.data?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>
        </div>

        {/* Section: Images */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <ImageIcon size={18} className="text-indigo-500" />
            <h2 className="font-semibold text-slate-800">Gallery</h2>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Paste image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border-slate-200"
            />
            <Button
              type="button"
              onClick={addImage}
              className="bg-slate-900 text-white hover:bg-slate-800"
            >
              <Plus size={18} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div
                key={i}
                className="group relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
                  className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Packages */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Package size={18} className="text-indigo-500" /> Pricing Packages
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={packages.length >= 3}
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              onClick={() => {
                const types = ["BASIC", "STANDARD", "PREMIUM"];
                const nextType = types[packages.length] || "STANDARD";
                setPackages([
                  ...packages,
                  { type: nextType, title: "", price: "", deliveryDays: "" },
                ]);
              }}
            >
              <Plus size={14} className="mr-1" /> Add Tier
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {packages.map((pkg, i) => (
              <PackageCard
                key={i}
                pkg={pkg}
                index={i}
                canRemove={packages.length > 1}
                onRemove={(idx) =>
                  setPackages(packages.filter((_, index) => index !== idx))
                }
                onChange={(idx, field, val) => {
                  const next = [...packages];
                  next[idx][field] = val;
                  setPackages(next);
                }}
              />
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="sticky bottom-6 flex items-center justify-end gap-3 bg-white/80 backdrop-blur-md p-4 border border-slate-200 rounded-2xl shadow-lg z-50">
          <Link href="/dashboard/seller/services">
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 shadow-md shadow-indigo-200"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Creating..." : "Publish Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}
