import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ClipboardList,
  FileText,
  History,
  Plus,
} from "lucide-react";
import { mockPolicies, mockClaimHistory } from "@/data/mockData";
import { Card } from "@/components/ui/Card";
import { cn, getTypeLabel } from "@/lib/utils";

// ─── Status config (used in history) ────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  submitted: {
    label: "Submitted",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  under_review: {
    label: "Under Review",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  approved: {
    label: "Approved",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-400",
  },
  settled: {
    label: "Settled",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
  },
};

export function ClaimPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("policyId");

  // Default to history; open new-claim if navigation passed a policyId
  const [activeTab, setActiveTab] = useState<"history" | "new">(
    preselectedId ? "new" : "history",
  );

  const activePolicies = mockPolicies.filter(
    (p) => p.status !== "expired" && p.status !== "cancelled",
  );

  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(
    preselectedId ?? activePolicies[0]?.id ?? "",
  );
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

  const selectedPolicy = mockPolicies.find((p) => p.id === selectedPolicyId);
  const motorPolicies = activePolicies.filter((p) => p.policy_type === "motor");

  // One representative policy per type for the Insurance Type dropdown
  const typeOptions = Array.from(
    new Map(activePolicies.map((p) => [p.policy_type, p])).values(),
  );

  return (
    <div className="min-h-screen bg-[#F5F4FB]">
      {/* ── HISTORY HEADER ── */}
      {activeTab === "history" && (
        <div className="bg-gradient-to-br from-[#1e1c38] via-[#313057] to-[#4a4878] px-4 pt-12 pb-8 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute top-16 -right-4 w-24 h-24 rounded-full bg-white/5" />
          <div className="max-w-lg mx-auto relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/60 text-xs font-medium mb-1 tracking-wide uppercase">
                  Overview
                </p>
                <h1 className="text-2xl font-bold text-white">
                  Claims History
                </h1>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW CLAIM HEADER ── */}
      {activeTab === "new" && (
        <div className="bg-gradient-to-br from-[#1e1c38] via-[#313057] to-[#4a4878] px-4 pt-12 pb-8 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute top-16 -right-4 w-24 h-24 rounded-full bg-white/5" />
          <div className="max-w-lg mx-auto relative">
            <button
              onClick={() => setActiveTab("history")}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 active:scale-90 transition-transform mb-5"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/60 text-xs font-medium mb-1 tracking-wide uppercase">
                  New Claim
                </p>
                <h1 className="text-2xl font-bold text-white">Make a Claim</h1>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ── CLAIMS HISTORY CONTENT ── */}
        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
            className="max-w-lg mx-auto px-4 pb-32 mt-4 space-y-3"
          >
            {mockClaimHistory.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-center">
                <div className="w-14 h-14 rounded-full bg-[#E8E7F7] flex items-center justify-center">
                  <History className="w-6 h-6 text-[#9390BC]" />
                </div>
                <p className="text-sm font-semibold text-[#9390BC]">
                  No claims yet
                </p>
                <p className="text-xs text-[#B2B0D4]">
                  Tap the + button to file a new claim
                </p>
              </div>
            ) : (
              mockClaimHistory.map((claim, i) => {
                const linkedPolicy = mockPolicies.find(
                  (p) => p.id === claim.policy_id,
                );
                const sc = STATUS_CONFIG[claim.status];
                return (
                  <motion.div
                    key={claim.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="p-4">
                      {/* Top row */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-xs font-bold text-[#7C79C8]">
                            {claim.ref_number}
                          </span>
                          {linkedPolicy && (
                            <div className="text-xs text-[#9390BC] mt-0.5">
                              {linkedPolicy.provider} ·{" "}
                              {getTypeLabel(linkedPolicy.policy_type)}
                            </div>
                          )}
                        </div>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold",
                            sc.bg,
                            sc.text,
                          )}
                        >
                          <span
                            className={cn("w-1.5 h-1.5 rounded-full", sc.dot)}
                          />
                          {sc.label}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-[#313057] mb-1">
                        {claim.claim_type_label}
                      </div>
                      <p className="text-xs text-[#7878A8] leading-relaxed line-clamp-2 mb-3">
                        {claim.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-[#EAE8F8]">
                        <div className="space-y-0.5">
                          <div className="text-[10px] text-[#B2B0D4] uppercase tracking-wide">
                            Incident
                          </div>
                          <div className="text-xs font-semibold text-[#313057]">
                            {new Date(claim.incident_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </div>
                        {claim.amount_claimed && (
                          <div className="text-right space-y-0.5">
                            <div className="text-[10px] text-[#B2B0D4] uppercase tracking-wide">
                              {claim.amount_settled != null
                                ? "Settled"
                                : "Claimed"}
                            </div>
                            <div className="text-xs font-bold text-[#313057]">
                              £
                              {(
                                claim.amount_settled ?? claim.amount_claimed
                              ).toLocaleString("en-GB")}
                              {claim.amount_settled == null && (
                                <span className="text-[#9390BC] font-normal">
                                  {" "}
                                  est.
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {/* ── NEW CLAIM CONTENT (matches screenshot) ── */}
        {activeTab === "new" && (
          <motion.div
            key="new"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
            className="max-w-lg mx-auto px-4 pb-28 mt-4"
          >
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Insurance Type */}
              <div className="p-5 border-b border-[#EAE8F8]">
                <h3 className="text-sm font-bold text-[#313057] mb-3">
                  Insurance Type
                </h3>
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowTypeDropdown(!showTypeDropdown);
                      setShowVehicleDropdown(false);
                    }}
                    className="flex items-center justify-between gap-8 px-4 py-3 rounded-xl border border-[#C8C7E8] bg-white text-sm font-medium text-[#313057] min-w-[180px]"
                  >
                    <span>
                      {selectedPolicy
                        ? getTypeLabel(selectedPolicy.policy_type)
                        : "Select type"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#9390BC]" />
                  </button>
                  {showTypeDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-1 bg-white border border-[#C8C7E8] rounded-xl shadow-lg z-20 overflow-hidden min-w-[180px]"
                    >
                      {typeOptions.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedPolicyId(p.id);
                            setShowTypeDropdown(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2.5 text-sm transition-colors",
                            selectedPolicyId === p.id
                              ? "bg-[#ECEAFB] text-[#7C79C8] font-semibold"
                              : "text-[#313057] hover:bg-[#F5F4FB]",
                          )}
                        >
                          {getTypeLabel(p.policy_type)}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Vehicle Registration — motor only */}
              {selectedPolicy?.policy_type === "motor" &&
                selectedPolicy.vehicle_number && (
                  <div className="p-5 border-b border-[#EAE8F8]">
                    <h3 className="text-sm font-bold text-[#313057] mb-3">
                      Vehicle Registration
                    </h3>
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowVehicleDropdown(!showVehicleDropdown);
                          setShowTypeDropdown(false);
                        }}
                        className="flex items-center justify-between gap-6 px-4 py-3 rounded-xl border border-[#C8C7E8] bg-white text-sm font-semibold font-mono text-[#313057] min-w-[160px]"
                      >
                        <span>{selectedPolicy.vehicle_number}</span>
                        <ChevronDown className="w-4 h-4 text-[#9390BC]" />
                      </button>
                      {showVehicleDropdown && motorPolicies.length > 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-0 mt-1 bg-white border border-[#C8C7E8] rounded-xl shadow-lg z-20 overflow-hidden min-w-[160px]"
                        >
                          {motorPolicies.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => {
                                setSelectedPolicyId(p.id);
                                setShowVehicleDropdown(false);
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2.5 text-sm font-mono font-semibold transition-colors",
                                selectedPolicyId === p.id
                                  ? "bg-[#ECEAFB] text-[#7C79C8]"
                                  : "text-[#313057] hover:bg-[#F5F4FB]",
                              )}
                            >
                              {p.vehicle_number}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

              {/* Policy number + document icon */}
              <div className="px-5 py-4 border-b border-[#EAE8F8]">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-[#313057]">
                    Policy {selectedPolicy?.policy_number ?? "—"}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#1e1c38] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Accident info */}
              <div className="px-5 pt-5 pb-4 border-b border-[#EAE8F8]">
                <p className="text-sm text-[#313057] mb-3">
                  If you are in an accident, please note
                </p>
                <div className="space-y-1.5">
                  {[
                    "third party's name,",
                    "their Address,",
                    "their telephone number and,",
                    "their vehicle registration,",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="text-sm text-[#7878A8]">•</span>
                      <span className="text-sm text-[#7878A8]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call insurer CTA */}
              <div className="p-5 space-y-3">
                <p className="text-center text-sm font-semibold text-red-500">
                  Call your insurer
                </p>
                <button className="w-full py-4 rounded-2xl bg-[#ECEAFB] active:scale-[0.98] transition-transform">
                  <span className="text-base font-bold text-red-500">
                    {selectedPolicy?.provider ?? "—"} -{" "}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB: New Claim (only visible on history tab) ── */}
      {activeTab === "history" && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, delay: 0.15 }}
          onClick={() => setActiveTab("new")}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-[#7C79C8] flex items-center justify-center shadow-lg shadow-[#7C79C8]/30 z-40 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>
      )}
    </div>
  );
}
