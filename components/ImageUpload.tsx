"use client";

import { useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { Button } from "./ui/button";

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  folder?: string;
  className?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  multiple = false,
  className = "",
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);

      if (multiple) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append("images", file);
        });

        const response = await axiosInstance.post("/upload/images", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const newUrls = response.data.data;
        const currentUrls = Array.isArray(value) ? value : [];
        onChange([...currentUrls, ...newUrls]);
        toast.success("Images uploaded successfully");
      } else {
        const formData = new FormData();
        formData.append("image", files[0]);

        const response = await axiosInstance.post("/upload/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const url = response.data.data;
        onChange(url);
        toast.success("Image uploaded successfully");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const onRemove = (urlToRemove: string) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((url) => url !== urlToRemove));
    } else {
      onChange("");
    }
  };

  const images = multiple ? (Array.isArray(value) ? value : []) : value ? [value as string] : [];

  return (
    <div className={`space-y-4 w-full ${className}`}>
      <div className="flex flex-wrap gap-4">
        {images.map((url) => (
          <div
            key={url}
            className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 group animate-in fade-in zoom-in duration-300"
          >
            <div className="absolute z-10 top-1 right-1">
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-sm"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <img 
              src={url} 
              alt="Uploaded content" 
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ImageIcon className="text-white h-6 w-6" />
            </div>
          </div>
        ))}
        
        {(multiple || images.length === 0) && (
          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-all group">
            <div className="flex flex-col items-center justify-center pt-2 pb-2">
              {isUploading ? (
                <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <p className="text-[10px] text-slate-400 mt-1 font-medium group-hover:text-indigo-500 transition-colors">
                    Upload
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              onChange={onUpload}
              accept="image/*"
              multiple={multiple}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
};
