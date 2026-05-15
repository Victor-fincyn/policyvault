import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed gap-2",
        // variants
        variant === "primary" &&
          "bg-[#7C79C8] text-white hover:bg-[#6360AF] shadow-sm",
        variant === "secondary" &&
          "bg-[#ECEAFB] text-[#7C79C8] hover:bg-[#E3E2F5]",
        variant === "ghost" &&
          "bg-transparent text-[#4D4B80] hover:bg-[#ECEAFB]",
        variant === "outline" &&
          "bg-white border border-[#C8C7E8] text-[#3D3B65] hover:bg-[#F5F4FB]",
        variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
        // sizes
        size === "sm" && "text-xs px-3 py-1.5",
        size === "md" && "text-sm px-4 py-2.5",
        size === "lg" && "text-base px-6 py-3",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
