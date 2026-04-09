// src/app/(dashboard)/dashboard/admin/categories/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { z } from "zod";
import { Plus, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";

const nameSchema = z.string().min(2, "Name must be at least 2 characters");

const getError = (errors: any[]): string | null => {
  if (!errors?.length) return null;
  const err = errors[0];
  if (typeof err === "string") return err;
  if (err?.message) return err.message;
  return err?.toString() ?? null;
};

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/categories");
      return res.data;
    },
  });

  const { mutate: createCategory, isPending: isCreating } = useMutation({
    mutationFn: async (payload: { name: string; icon?: string }) => {
      await axiosInstance.post("/categories", payload);
    },
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      form.reset();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed"),
  });

  const { mutate: deleteCategory } = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to delete category"),
  });

  const form = useForm({
    defaultValues: { name: "", icon: "" },
    onSubmit: ({ value }) => {
      createCategory({ name: value.name, icon: value.icon || undefined });
    },
  });

  const categories = data?.data ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
        <p className="text-sm text-slate-400 mt-1">Manage service categories</p>
      </div>

      {/* Create form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">
          Create Category
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
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
              <div className="flex-1 space-y-1">
                <Input
                  placeholder="Category name (e.g. Web Development)"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isCreating}
                  className="bg-slate-50 border-slate-200"
                />
                {getError(field.state.meta.errors) && (
                  <p className="text-xs text-red-500">
                    {getError(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="icon">
            {(field) => (
              <div className="flex-1">
                 <ImageUpload
                  value={field.state.value}
                  onChange={(url) => field.handleChange(url as string)}
                  multiple={false}
                />
              </div>
            )}
          </form.Field>

          <Button
            type="submit"
            disabled={isCreating}
            className="bg-primary hover:bg-primary/90 text-white gap-2 shrink-0"
          >
            <Plus size={15} />
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </form>
      </div>

      {/* Categories list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50">
          <h2 className="text-sm font-semibold text-slate-700">
            All Categories ({categories.length})
          </h2>
        </div>
        {isLoading && (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}
        {!isLoading && categories.length === 0 && (
          <div className="p-12 text-center text-slate-300 text-sm">
            No categories yet
          </div>
        )}
        {!isLoading && categories.length > 0 && (
          <div className="divide-y divide-slate-50">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  {cat.icon ? (
                    <img
                      src={cat.icon}
                      alt=""
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    <Tag size={15} className="text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">
                    {cat.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {cat._count?.services ?? 0} services
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteCategory(cat.id)}
                  className="h-8 w-8 p-0 text-slate-300 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
