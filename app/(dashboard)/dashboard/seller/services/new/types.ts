export type PackageType = "BASIC" | "STANDARD" | "PREMIUM";

export interface PackageData {
  type: PackageType;
  title: string;
  description: string;
  price: string; // Kept as string for the input field state
  deliveryDays: string; // Kept as string for the input field state
  revisions: string; // Kept as string for the input field state
}
