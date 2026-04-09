"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  ArrowLeft,
  Package,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PackageCard } from "../../new/_components/PackageCard";
import { ImageUpload } from "@/components/ImageUpload";

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const serviceId = params?.id as string;

  const [packages, setPackages] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await axiosInstance.get("/categories")).data,
  });

  // Fetch specific service
  const { data: serviceData, isLoading: isLoadingService } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/services/${serviceId}`);
      return res.data;
    },
    enabled: !!serviceId,
  });

  const { mutate: updateService, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      (await axiosInstance.put(`/services/${serviceId}`, payload)).data,
    onSuccess: () => {
      toast.success("Service updated!");
      queryClient.invalidateQueries({ queryKey: ["seller-services"] });
      // Invalidate the specific service cache
      queryClient.invalidateQueries({ queryKey: ["service", serviceId] });
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
      updateService(payload);
    },
  });

  // Pre-fill form when service data arrives
  useEffect(() => {
    if (serviceData?.data && !isInitialized) {
      const s = serviceData.data;
      form.setFieldValue("title", s.title || "");
      form.setFieldValue("description", s.description || "");
      form.setFieldValue("categoryId", s.categoryId || "");
      setImages(s.images || []);
      
      if (s.packages && s.packages.length > 0) {
        setPackages(
          s.packages.map((p: any) => ({
            ...p,
            price: p.price.toString(),
            deliveryDays: p.deliveryDays.toString(),
            revisions: p.revisions ? p.revisions.toString() : "",
          }))
        );
      } else {
        setPackages([
          {
            type: "BASIC",
            title: "",
            description: "",
            price: "",
            deliveryDays: "",
            revisions: "",
          },
        ]);
      }
      setIsInitialized(true);
    }
  }, [serviceData, isInitialized, form]);

  const handleGenerateAIDescription = async () => {
    const title = form.getFieldValue("title");
    if (!title || title.length < 10) {
      return toast.error("Please enter a clear title (at least 10 chars)");
    }

    try {
      setIsGenerating(true);
      const response = await axiosInstance.post("/ai/generate-description", {
        title,
      });
      form.setFieldValue("description", response.data.data);
      toast.success("AI Description generated!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoadingService) {
    return <div className="p-8 text-center text-slate-500">Loading service data...</div>;
  }

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
          <h1 className="text-2xl font-bold text-slate-900">Edit Service</h1>
          <p className="text-slate-500 text-sm">
            Update your professional skills.
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
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700">Service Title</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 gap-1.5"
                    onClick={handleGenerateAIDescription}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Sparkles size={14} />
                    )}
                    AI Writer
                  </Button>
                </div>
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
          <ImageUpload
            value={images}
            onChange={(urls) => setImages(urls as string[])}
            multiple={true}
          />
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
            {isPending ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
