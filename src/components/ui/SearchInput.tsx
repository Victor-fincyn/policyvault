import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import React from "react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onClear?: () => void;
  className?: string;
}

export function SearchInput({
  value,
  onClear,
  className,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="absolute left-3 w-4 h-4 text-[#7878A8]" />
      <input
        className="w-full pl-9 pr-9 py-2.5 bg-white border border-[#C8C7E8] rounded-xl text-sm placeholder:text-[#9B99C8] focus:outline-none focus:ring-2 focus:ring-[#D3D3F6]/40 focus:border-[#D3D3F6] transition-all"
        value={value}
        {...props}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 text-[#7878A8] hover:text-[#313057]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
