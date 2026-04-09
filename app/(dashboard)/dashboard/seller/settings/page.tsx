"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import axiosInstance from "@/lib/axios";
import { AuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { z } from "zod";
import { Save, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";

const bioSchema = z.string().max(300, "Bio max 300 characters").optional();
const skillSchema = z.string().min(1, "Cannot be empty");

const getError = (errors: any[]): string | null => {
  if (!errors?.length) return null;
  const err = errors[0];
  if (typeof err === "string") return err;
  if (err?.message) return err.message;
  return err?.toString() ?? null;
};

export default function SellerSettingsPage() {
  const queryClient = useQueryClient();
  const user = AuthStore.getUser();

  const { data: profileData } = useQuery({
    queryKey: ["seller-profile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/seller-profiles/me");
      return res.data;
    },
  });

  const profile = profileData?.data;

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (data: any) => {
      await axiosInstance.put(`/seller-profiles/${profile?.id}`, data);
    },
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["seller-profile"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const form = useForm({
    defaultValues: {
      bio: profile?.bio ?? "",
      skills: profile?.skills?.join(", ") ?? "",
      portfolio: profile?.portfolio?.join(", ") ?? "",
      profileImage: profile?.profileImage ?? "",
    },
    onSubmit: ({ value }) => {
      updateProfile({
        bio: value.bio,
        profileImage: value.profileImage,
        skills: value.skills
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        portfolio: value.portfolio
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      });
    },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update your seller profile and preferences
        </p>
      </div>

      {/* Account info (read only) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User size={15} className="text-[var(--primary)]" />
          <h2 className="text-sm font-semibold text-gray-900">Account Info</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Full Name</Label>
            <Input
              value={user?.name ?? ""}
              disabled
              className="bg-gray-50 border border-gray-200 text-gray-700"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Email</Label>
            <Input
              value={user?.email ?? ""}
              disabled
              className="bg-gray-50 border border-gray-200 text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Seller profile form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Briefcase size={15} className="text-[var(--primary)]" />
          <h2 className="text-sm font-semibold text-gray-900">
            Seller Profile
          </h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Profile Image */}
          <form.Field name="profileImage">
            {(field) => (
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Profile Image</Label>
                <ImageUpload
                  value={field.state.value}
                  onChange={(url) => field.handleChange(url as string)}
                  multiple={false}
                />
              </div>
            )}
          </form.Field>

          {/* Bio */}
          <form.Field
            name="bio"
            validators={{
              onChange: ({ value }) => {
                const result = bioSchema.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">
                  Bio{" "}
                  <span className="text-gray-300">
                    ({field.state.value.length}/300)
                  </span>
                </Label>
                <textarea
                  rows={3}
                  placeholder="Tell buyers about yourself..."
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
                {getError(field.state.meta.errors) && (
                  <p className="text-xs text-red-500">
                    {getError(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Skills */}
          <form.Field name="skills">
            {(field) => (
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">
                  Skills{" "}
                  <span className="text-gray-300">(comma separated)</span>
                </Label>
                <Input
                  placeholder="React, Node.js, PostgreSQL"
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:border-[var(--primary)]"
                />
              </div>
            )}
          </form.Field>

          {/* Portfolio */}
          <form.Field name="portfolio">
            {(field) => (
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">
                  Portfolio Links{" "}
                  <span className="text-gray-300">(comma separated)</span>
                </Label>
                <Input
                  placeholder="https://github.com/you, https://yoursite.com"
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:border-[var(--primary)]"
                />
              </div>
            )}
          </form.Field>

          <Button
            type="submit"
            disabled={isPending}
            className="bg-[var(--primary)] hover:brightness-90 text-white gap-2"
          >
            <Save size={15} />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
