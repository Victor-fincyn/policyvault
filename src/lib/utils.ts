import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays, parseISO } from "date-fns";
import type { PolicyStatus, PolicyType } from "@/types/policy";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "d MMM yyyy");
}

export function getDaysUntilExpiry(endDate: string): number {
  return differenceInDays(parseISO(endDate), new Date());
}

export function getStatusColor(status: PolicyStatus): string {
  switch (status) {
    case "active":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "expiring_soon":
      return "text-amber-700 bg-amber-50 border-amber-200";
    case "expired":
      return "text-rose-700 bg-rose-50 border-rose-200";
    case "cancelled":
      return "text-slate-500 bg-slate-50 border-slate-200";
    default:
      return "text-slate-500 bg-slate-50 border-slate-200";
  }
}

export function getStatusLabel(status: PolicyStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "expiring_soon":
      return "Expiring Soon";
    case "expired":
      return "Expired";
    case "cancelled":
      return "Cancelled";
  }
}

export function getTypeIcon(type: PolicyType): string {
  switch (type) {
    case "motor":
      return "�";
    case "health":
      return "🩺";
    case "life":
      return "🛡️";
    case "home":
      return "🏡";
    case "travel":
      return "🌍";
  }
}

export function getTypeLabel(type: PolicyType): string {
  switch (type) {
    case "motor":
      return "Motor";
    case "health":
      return "Health";
    case "life":
      return "Life";
    case "home":
      return "Home";
    case "travel":
      return "Travel";
  }
}

export function getTypeGradient(type: PolicyType): string {
  switch (type) {
    case "motor":
      return "from-[#7C79C8] via-[#8F8DC8] to-[#A8A6D8]";
    case "health":
      return "from-[#c43060] via-[#d94878] to-[#e86090]";
    case "life":
      return "from-[#1a8c5c] via-[#22a86e] to-[#2ec484]";
    case "home":
      return "from-[#1c6aa8] via-[#2480c8] to-[#3098e0]";
    case "travel":
      return "from-[#b86010] via-[#d4781e] to-[#e8962c]";
  }
}

export function getExpiryBadgeColor(days: number): string {
  if (days < 0) return "text-rose-700 bg-rose-50 border-rose-200";
  if (days <= 30) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-emerald-700 bg-emerald-50 border-emerald-200";
}

export function getExpiryLabel(days: number): string {
  if (days < 0) return `Expired ${Math.abs(days)}d ago`;
  if (days === 0) return "Expires today";
  if (days <= 30) return `${days}d left`;
  return `${Math.floor(days / 30)}mo left`;
}
