import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  Car,
  Heart,
  Shield,
  Home,
  Plane,
} from "lucide-react";
import { mockPolicies } from "@/data/mockData";
import { PolicyCard } from "@/components/PolicyCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { cn, getTypeLabel } from "@/lib/utils";
import type { PolicyType } from "@/types/policy";

const TYPE_ICONS: Record<PolicyType, React.ReactNode> = {
  motor: <Car className="w-3.5 h-3.5" />,
  health: <Heart className="w-3.5 h-3.5" />,
  life: <Shield className="w-3.5 h-3.5" />,
  home: <Home className="w-3.5 h-3.5" />,
  travel: <Plane className="w-3.5 h-3.5" />,
};

const TYPES: (PolicyType | "all")[] = [
  "all",
  "motor",
  "health",
  "life",
  "home",
  "travel",
];

export function PoliciesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as PolicyType) || "all";

  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<PolicyType | "all">(initialType);

  const filtered = mockPolicies.filter((p) => {
    const matchesType = activeType === "all" || p.policy_type === activeType;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.provider.toLowerCase().includes(q) ||
      p.policyholder_name.toLowerCase().includes(q) ||
      p.policy_number.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-full pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#C8C7E8] px-4 pt-12 pb-3 sticky top-0 z-30">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-[#313057]">My Policies</h1>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#ECEAFB]">
              <SlidersHorizontal className="w-4 h-4 text-[#4D4B80]" />
            </button>
          </div>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Search by provider or policyholder..."
          />

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-0.5">
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  activeType === type
                    ? "bg-[#7C79C8] text-white border-[#7C79C8]"
                    : "bg-white text-[#7878A8] border-[#C8C7E8] hover:border-[#D3D3F6]",
                )}
              >
                {type !== "all" && (
                  <span className="flex items-center">
                    {TYPE_ICONS[type as PolicyType]}
                  </span>
                )}
                <span>
                  {type === "all" ? "All" : getTypeLabel(type as PolicyType)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        <div className="text-sm text-[#7878A8]">
          {filtered.length} {filtered.length === 1 ? "policy" : "policies"}{" "}
          found
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-[#313057] font-semibold">
                No policies found
              </div>
              <div className="text-[#7878A8] text-sm mt-1">
                Try adjusting your search or filters
              </div>
            </motion.div>
          ) : (
            filtered.map((p, i) => (
              <PolicyCard
                key={p.id}
                policy={p}
                index={i}
                onClick={() => navigate(`/policies/${p.id}`)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
