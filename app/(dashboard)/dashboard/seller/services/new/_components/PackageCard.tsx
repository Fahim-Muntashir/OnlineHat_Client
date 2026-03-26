import { Trash2, DollarSign, Clock, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PackageData, PackageType } from "../types";

const packageColors: Record<PackageType, string> = {
  BASIC: "bg-slate-100 text-slate-600 border-slate-200",
  STANDARD: "bg-blue-100 text-blue-600 border-blue-200",
  PREMIUM: "bg-purple-100 text-purple-600 border-purple-200",
};

interface PackageCardProps {
  pkg: PackageData;
  index: number;
  onChange: (index: number, field: keyof PackageData, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export const PackageCard = ({
  pkg,
  index,
  onChange,
  onRemove,
  canRemove,
}: PackageCardProps) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 transition-all hover:border-slate-300">
    <div className="flex items-center justify-between">
      <Badge
        variant="outline"
        className={`text-xs font-bold px-2.5 py-0.5 ${packageColors[pkg.type]}`}
      >
        {pkg.type}
      </Badge>
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2 space-y-1.5">
        <Label className="text-xs font-medium text-slate-500">
          Package Title
        </Label>
        <Input
          placeholder="e.g. Starter Kit"
          value={pkg.title}
          onChange={(e) => onChange(index, "title", e.target.value)}
          className="bg-slate-50 border-slate-200 focus:bg-white"
        />
      </div>

      <div className="sm:col-span-2 space-y-1.5">
        <Label className="text-xs font-medium text-slate-500">
          Description
        </Label>
        <Input
          placeholder="What's included?"
          value={pkg.description}
          onChange={(e) => onChange(index, "description", e.target.value)}
          className="bg-slate-50 border-slate-200 focus:bg-white"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-500">Price (৳)</Label>
        <div className="relative">
          <DollarSign
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            type="number"
            value={pkg.price}
            onChange={(e) => onChange(index, "price", e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-500">
          Delivery (Days)
        </Label>
        <div className="relative">
          <Clock
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            type="number"
            value={pkg.deliveryDays}
            onChange={(e) => onChange(index, "deliveryDays", e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
      </div>
    </div>
  </div>
);
