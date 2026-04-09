// src/app/(dashboard)/dashboard/buyer/settings/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import axiosInstance from "@/lib/axios";
import { AuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { z } from "zod";
import { Save, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";

const getError = (errors: any[]): string | null => {
  if (!errors?.length) return null;
  const e = errors[0];
  return typeof e === "string" ? e : (e?.message ?? e?.toString() ?? null);
};

export default function BuyerSettingsPage() {
  const queryClient = useQueryClient();
  const user = AuthStore.getUser();

  const { data: profileData } = useQuery({
    queryKey: ["buyer-profile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/buyer-profiles/me");
      return res.data;
    },
  });

  const profile = profileData?.data;

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (data: any) => {
      await axiosInstance.put(`/buyer-profiles/${profile?.id}`, data);
    },
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["buyer-profile"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const form = useForm({
    defaultValues: {
      bio: profile?.bio ?? "",
      phone: profile?.phone ?? "",
      address: profile?.address ?? "",
      profileImage: profile?.profileImage ?? "",
    },
    onSubmit: ({ value }) => {
      updateProfile({
        bio: value.bio || undefined,
        phone: value.phone || undefined,
        address: value.address || undefined,
        profileImage: value.profileImage || undefined,
      });
    },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profile Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User size={15} className="text-primary" />
          <h2 className="text-sm font-semibold text-slate-700">Account Info</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">Full Name</Label>
            <Input
              value={user?.name ?? ""}
              disabled
              className="bg-slate-50 border-slate-200 text-slate-500"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">Email</Label>
            <Input
              value={user?.email ?? ""}
              disabled
              className="bg-slate-50 border-slate-200 text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <MapPin size={15} className="text-primary" />
          <h2 className="text-sm font-semibold text-slate-700">
            Profile Details
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
                <Label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Profile Image</Label>
                <ImageUpload
                  value={field.state.value}
                  onChange={(url) => field.handleChange(url as string)}
                  multiple={false}
                />
              </div>
            )}
          </form.Field>

          {/* Bio */}
          <form.Field name="bio">
            {(field) => (
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">
                  Bio{" "}
                  <span className="text-slate-300">
                    ({field.state.value.length}/300)
                  </span>
                </Label>
                <textarea
                  rows={3}
                  placeholder="Tell sellers about yourself..."
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            )}
          </form.Field>

          {/* Phone */}
          <form.Field
            name="phone"
            validators={{
              onChange: ({ value }) => {
                if (!value) return undefined;
                const r = z
                  .string()
                  .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number")
                  .safeParse(value);
                return r.success ? undefined : r.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">Phone</Label>
                <Input
                  placeholder="+8801700000000"
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-slate-50 border-slate-200 focus:border-primary/50"
                />
                {getError(field.state.meta.errors) && (
                  <p className="text-xs text-red-500">
                    {getError(field.state.meta.errors)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Address */}
          <form.Field name="address">
            {(field) => (
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">Address</Label>
                <Input
                  placeholder="Dhaka, Bangladesh"
                  disabled={isPending}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-slate-50 border-slate-200 focus:border-primary/50"
                />
              </div>
            )}
          </form.Field>

          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary/90 text-white gap-2"
          >
            <Save size={15} />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
