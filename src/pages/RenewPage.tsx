import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  TrendingDown,
  ArrowUpDown,
  CheckCircle2,
  X,
} from "lucide-react";
import { mockPolicies, mockRenewalQuotes } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { cn, formatCurrency, getTypeIcon, getTypeLabel } from "@/lib/utils";
import type { PolicyType } from "@/types/policy";

type SortKey = "price" | "rating" | "recommended" | "settlement";

export function RenewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("policyId");

  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(
    preselectedId,
  );
  const [sortBy, setSortBy] = useState<SortKey>("recommended");
  const [search, setSearch] = useState("");

  const expiringPolicies = mockPolicies.filter(
    (p) => p.status === "active" || p.status === "expiring_soon",
  );

  const selectedPolicy = mockPolicies.find((p) => p.id === selectedPolicyId);

  const sortedQuotes = [...mockRenewalQuotes]
    .filter(
      (q) => !search || q.provider.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "price") return a.annual_premium - b.annual_premium;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "settlement")
        return b.claim_settlement_ratio - a.claim_settlement_ratio;
      return (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0);
    });

  return (
    <div className="min-h-full pb-28 bg-[#F5F4FB]">
      {/* Header */}
      <div className="bg-white border-b border-[#C8C7E8] px-4 pt-12 pb-4 sticky top-0 z-30">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() =>
              navigate(
                preselectedId ? `/policies/${preselectedId}` : "/policies",
              )
            }
            className="w-9 h-9 rounded-xl bg-[#ECEAFB] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#313057]" />
          </button>
          <h1 className="text-lg font-bold text-[#313057]">Renew Policy</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
        {/* Select Policy */}
        <div>
          <h2 className="font-bold text-[#313057] text-sm mb-2">
            Select Policy to Renew
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {expiringPolicies.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() =>
                  setSelectedPolicyId(p.id === selectedPolicyId ? null : p.id)
                }
                className={cn(
                  "flex-shrink-0 flex flex-col items-start gap-1.5 p-3 rounded-2xl border-2 w-40 transition-all text-left active:scale-95",
                  selectedPolicyId === p.id
                    ? "border-[#D3D3F6] bg-[#ECEAFB]"
                    : "border-[#C8C7E8] bg-white",
                )}
              >
                <span className="text-xl">{getTypeIcon(p.policy_type)}</span>
                <div className="text-xs font-bold text-[#313057]">
                  {p.provider}
                </div>
                <div className="text-[10px] text-[#7878A8]">
                  {getTypeLabel(p.policy_type)}
                </div>
                <div
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                    p.days_until_expiry <= 30
                      ? "text-amber-600 bg-amber-50 border-amber-200"
                      : "text-emerald-600 bg-emerald-50 border-emerald-200",
                  )}
                >
                  {p.days_until_expiry <= 30
                    ? `${p.days_until_expiry}d left`
                    : "Active"}
                </div>
                {selectedPolicyId === p.id && (
                  <CheckCircle2 className="w-4 h-4 text-[#7C79C8] absolute top-2 right-2" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {selectedPolicy && (
          <>
            {/* Current Plan Summary */}
            <Card className="p-4 bg-[#ECEAFB] border-[#C8C7E8]">
              <div className="text-xs text-[#7C79C8] font-semibold mb-1">
                Current Plan
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#313057] text-sm">
                    {selectedPolicy.provider}
                  </div>
                  <div className="text-xs text-[#7878A8]">
                    {selectedPolicy.policy_number}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#7C79C8]">
                    {formatCurrency(selectedPolicy.premium_amount)}/yr
                  </div>
                  <div className="text-xs text-[#7878A8]">
                    Sum: {formatCurrency(selectedPolicy.sum_insured)}
                  </div>
                </div>
              </div>
            </Card>

            {/* Search + Sort */}
            <div className="space-y-3">
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
                placeholder="Search providers..."
              />
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {(
                  ["recommended", "price", "rating", "settlement"] as SortKey[]
                ).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                      sortBy === key
                        ? "bg-[#7C79C8] text-white border-[#7C79C8]"
                        : "bg-white text-[#7878A8] border-[#C8C7E8]",
                    )}
                  >
                    {key === "price" && <TrendingDown className="w-3 h-3" />}
                    {key === "rating" && <Star className="w-3 h-3" />}
                    {key !== "price" && key !== "rating" && (
                      <ArrowUpDown className="w-3 h-3" />
                    )}
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace("ment", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Vendor Cards */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-[#313057]">
                {sortedQuotes.length} quotes available
              </div>
              {sortedQuotes.map((quote, i) => (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card
                    className={cn(
                      "overflow-hidden",
                      quote.recommended && "border-[#D3D3F6]",
                    )}
                  >
                    {quote.recommended && (
                      <div className="bg-[#7C79C8] text-white text-xs font-bold px-4 py-1.5 flex items-center gap-1.5">
                        <Star className="w-3 h-3 fill-current" /> Recommended
                        for you
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-bold text-[#313057]">
                            {quote.provider}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-3 h-3",
                                  i < Math.floor(quote.rating)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-[#D3D3F6]",
                                )}
                              />
                            ))}
                            <span className="text-xs text-[#7878A8] ml-0.5">
                              {quote.rating}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#7C79C8]">
                            {formatCurrency(quote.annual_premium)}
                          </div>
                          <div className="text-xs text-[#7878A8]">per year</div>
                          {quote.discount_percentage && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] mt-0.5">
                              {quote.discount_percentage}% off
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                        <div className="text-xs text-[#7878A8]">
                          <span className="font-semibold text-[#313057]">
                            Claim: {quote.claim_settlement_ratio}%
                          </span>
                        </div>
                        <div className="text-xs text-[#7878A8]">
                          <span className="font-semibold text-[#313057]">
                            {quote.coverage_type}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-4">
                        {quote.features.slice(0, 4).map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 text-xs text-[#7878A8]"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>

                      {selectedPolicy.annual_premium > quote.annual_premium && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 mb-3">
                          <TrendingDown className="w-3.5 h-3.5" />
                          Save{" "}
                          {formatCurrency(
                            selectedPolicy.premium_amount -
                              quote.annual_premium,
                          )}{" "}
                          vs current plan
                        </div>
                      )}

                      <Button
                        fullWidth
                        size="md"
                        variant={quote.recommended ? "primary" : "outline"}
                        onClick={() => {}}
                      >
                        Buy Now →
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {!selectedPolicy && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔄</div>
            <div className="font-semibold text-[#313057]">
              Select a policy above
            </div>
            <div className="text-sm text-[#7878A8] mt-1">
              to see renewal quotes
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
