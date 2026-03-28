// src/app/services/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  X,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "top_rated", label: "Top Rated" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

// Service card
const ServiceCard = ({ service }: { service: any }) => {
  const minPrice =
    service.packages?.length > 0
      ? Math.min(...service.packages.map((p: any) => p.price))
      : null;

  return (
    <Link href={`/services/${service.id}`}>
      <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer">
        {/* Image */}
        <div className="h-44 bg-slate-50 overflow-hidden relative">
          {service.images?.[0] ? (
            <img
              src={service.images[0]}
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <ImageOff size={24} className="text-slate-200" />
            </div>
          )}
          {service.category && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/95 text-slate-600 border-0 shadow-sm text-[10px] font-semibold">
                {service.category.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {service.title}
          </p>

          {/* Seller */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[9px] font-bold text-primary">
                {service.seller?.user?.name?.charAt(0).toUpperCase() ?? "S"}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {service.seller?.user?.name ?? "Seller"}
            </span>
          </div>

          {/* Rating + Price */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-50">
            <div className="flex items-center gap-1">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-slate-600">
                {service.avgRating?.toFixed(1) ?? "New"}
              </span>
              {service.totalReviews > 0 && (
                <span className="text-xs text-slate-300">
                  ({service.totalReviews})
                </span>
              )}
            </div>
            {minPrice !== null && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400">From </span>
                <span className="text-sm font-bold text-primary">
                  ৳{minPrice}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await axiosInstance.get("/categories")).data,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["services", search, categoryId, sort, page],
    queryFn: async () => {
      const res = await axiosInstance.get("/services");
      return res.data;
    },
  });

  const categories = categoriesData?.data ?? [];
  let services = data?.data ?? [];

  // client-side filter/sort (replace with API params when backend supports)
  if (search) {
    services = services.filter(
      (s: any) =>
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase()),
    );
  }
  if (categoryId) {
    services = services.filter((s: any) => s.categoryId === categoryId);
  }
  if (minPrice) {
    services = services.filter((s: any) => {
      const min = Math.min(...(s.packages?.map((p: any) => p.price) ?? [0]));
      return min >= parseFloat(minPrice);
    });
  }
  if (maxPrice) {
    services = services.filter((s: any) => {
      const min = Math.min(...(s.packages?.map((p: any) => p.price) ?? [0]));
      return min <= parseFloat(maxPrice);
    });
  }
  if (sort === "top_rated") {
    services = [...services].sort(
      (a: any, b: any) => (b.avgRating ?? 0) - (a.avgRating ?? 0),
    );
  } else if (sort === "price_low") {
    services = [...services].sort((a: any, b: any) => {
      const aMin = Math.min(...(a.packages?.map((p: any) => p.price) ?? [0]));
      const bMin = Math.min(...(b.packages?.map((p: any) => p.price) ?? [0]));
      return aMin - bMin;
    });
  } else if (sort === "price_high") {
    services = [...services].sort((a: any, b: any) => {
      const aMin = Math.min(...(a.packages?.map((p: any) => p.price) ?? [0]));
      const bMin = Math.min(...(b.packages?.map((p: any) => p.price) ?? [0]));
      return bMin - aMin;
    });
  } else {
    services = [...services].sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);
  const paginated = services.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setCategoryId("");
    setSort("latest");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  const hasFilters = search || categoryId || minPrice || maxPrice;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="flex-1 relative max-w-xl">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Search services..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(searchInput);
                  setPage(1);
                }
              }}
              className="pl-9 bg-slate-50 border-slate-200 focus:border-primary/50"
            />
          </div>
          <Button
            onClick={() => {
              setSearch(searchInput);
              setPage(1);
            }}
            className="bg-primary hover:bg-primary/90 text-white shrink-0"
          >
            Search
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "gap-2 shrink-0 border-slate-200",
              showFilters && "border-primary text-primary",
            )}
          >
            <Filter size={15} />
            Filters
            {hasFilters && (
              <span className="h-4 w-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold">
                !
              </span>
            )}
          </Button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="border-t border-slate-100 bg-white px-4 py-4">
            <div className="max-w-7xl mx-auto flex flex-wrap items-end gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-primary/50 min-w-40"
                >
                  <option value="">All Categories</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Sort By
                </label>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-primary/50 min-w-40"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price range */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Min Price (৳)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-24 bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Max Price (৳)
                </label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-24 bg-slate-50 border-slate-200"
                />
              </div>

              {hasFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-slate-400 hover:text-red-500 gap-1.5"
                >
                  <X size={14} />
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category pills */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              setCategoryId("");
              setPage(1);
            }}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
              !categoryId
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-slate-500 border-slate-200 hover:border-primary/40",
            )}
          >
            All
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategoryId(cat.id);
                setPage(1);
              }}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                categoryId === cat.id
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-slate-500 border-slate-200 hover:border-primary/40",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">
              {services.length}
            </span>{" "}
            services found
            {search && (
              <span>
                {" "}
                for <span className="text-primary font-medium">"{search}"</span>
              </span>
            )}
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 h-64 animate-pulse"
              />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-20 text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
              <Search size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-700 font-semibold">No services found</p>
            <p className="text-slate-400 text-sm">
              Try adjusting your filters or search term
            </p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-slate-200"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {paginated.map((service: any) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-white"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={cn(
                  "h-9 w-9 rounded-xl text-sm font-medium transition-all",
                  page === i + 1
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-500 hover:border-primary/40",
                )}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
