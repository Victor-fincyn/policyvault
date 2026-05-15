import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Car,
  Heart,
  Plane,
  Flame,
  ShieldAlert,
  Luggage,
  CloudRain,
  Ambulance,
  Pill,
  Stethoscope,
  CalendarDays,
  MessageSquare,
  DollarSign,
  Phone,
  ClipboardList,
  AlertCircle,
  History,
  Plus,
} from "lucide-react";
import { mockPolicies, mockClaimHistory } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn, getTypeIcon, getTypeLabel } from "@/lib/utils";

type ClaimType = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
};

const CLAIM_TYPES: Record<string, ClaimType[]> = {
  motor: [
    {
      id: "accident",
      label: "Accident / Collision",
      icon: <Car className="w-5 h-5" />,
      description: "Vehicle damage from collision",
    },
    {
      id: "theft",
      label: "Theft",
      icon: <ShieldAlert className="w-5 h-5" />,
      description: "Vehicle stolen or break-in",
    },
    {
      id: "fire",
      label: "Fire & Explosion",
      icon: <Flame className="w-5 h-5" />,
      description: "Damage from fire or explosion",
    },
    {
      id: "flood",
      label: "Flood / Weather",
      icon: <CloudRain className="w-5 h-5" />,
      description: "Storm, flood or hail damage",
    },
    {
      id: "third_party",
      label: "Third Party Damage",
      icon: <AlertCircle className="w-5 h-5" />,
      description: "Damage you caused to others",
    },
  ],
  health: [
    {
      id: "hospitalisation",
      label: "Hospitalisation",
      icon: <Ambulance className="w-5 h-5" />,
      description: "Inpatient or emergency stay",
    },
    {
      id: "outpatient",
      label: "Outpatient Treatment",
      icon: <Stethoscope className="w-5 h-5" />,
      description: "Doctor visits & consultations",
    },
    {
      id: "medicines",
      label: "Prescriptions",
      icon: <Pill className="w-5 h-5" />,
      description: "Prescribed medication costs",
    },
    {
      id: "surgery",
      label: "Surgery",
      icon: <Heart className="w-5 h-5" />,
      description: "Surgical procedures covered",
    },
  ],
  life: [
    {
      id: "death",
      label: "Death Claim",
      icon: <ShieldAlert className="w-5 h-5" />,
      description: "Claim on behalf of the insured",
    },
    {
      id: "critical",
      label: "Critical Illness",
      icon: <Heart className="w-5 h-5" />,
      description: "Serious illness diagnosis claim",
    },
    {
      id: "terminal",
      label: "Terminal Illness",
      icon: <Stethoscope className="w-5 h-5" />,
      description: "Terminal prognosis claim",
    },
  ],
  home: [
    {
      id: "burglary",
      label: "Burglary / Theft",
      icon: <ShieldAlert className="w-5 h-5" />,
      description: "Break-in or theft from property",
    },
    {
      id: "fire",
      label: "Fire Damage",
      icon: <Flame className="w-5 h-5" />,
      description: "Fire or smoke damage",
    },
    {
      id: "flood",
      label: "Flood / Water",
      icon: <CloudRain className="w-5 h-5" />,
      description: "Water damage or flooding",
    },
    {
      id: "accidental",
      label: "Accidental Damage",
      icon: <AlertCircle className="w-5 h-5" />,
      description: "Unintentional property damage",
    },
  ],
  travel: [
    {
      id: "cancellation",
      label: "Trip Cancellation",
      icon: <Plane className="w-5 h-5" />,
      description: "Cancelled or postponed trip",
    },
    {
      id: "medical",
      label: "Medical Emergency",
      icon: <Ambulance className="w-5 h-5" />,
      description: "Emergency medical treatment",
    },
    {
      id: "luggage",
      label: "Lost / Delayed Luggage",
      icon: <Luggage className="w-5 h-5" />,
      description: "Lost, stolen or delayed bags",
    },
    {
      id: "delay",
      label: "Flight Delay",
      icon: <CalendarDays className="w-5 h-5" />,
      description: "Significant delays or diversions",
    },
  ],
};

export function ClaimPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("policyId");

  const [step, setStep] = useState(1);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(
    preselectedId,
  );
  const [selectedClaimType, setSelectedClaimType] = useState<string | null>(
    null,
  );
  const [incidentDate, setIncidentDate] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [activeTab, setActiveTab] = useState<"new" | "history">(
    preselectedId ? "new" : "new",
  );

  const policy = mockPolicies.find((p) => p.id === selectedPolicyId);
  const claimTypes = policy ? (CLAIM_TYPES[policy.policy_type] ?? []) : [];
  const selectedType = claimTypes.find((c) => c.id === selectedClaimType);

  const canProceedStep1 = !!selectedPolicyId && !!selectedClaimType;
  const canProceedStep2 = !!incidentDate && description.trim().length >= 10;

  const refNumber = `CLM-${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-[#F5F4FB]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e1c38] via-[#313057] to-[#4a4878] px-4 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-16 -right-4 w-24 h-24 rounded-full bg-white/5" />

        <div className="max-w-lg mx-auto relative">
          <button
            onClick={() =>
              step > 1 && step < 4
                ? setStep(step - 1)
                : navigate(
                    preselectedId ? `/policies/${preselectedId}` : "/policies",
                  )
            }
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 active:scale-90 transition-transform mb-5"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-xs font-medium mb-1 tracking-wide uppercase">
                {activeTab === "history"
                  ? "Overview"
                  : step < 4
                    ? `Step ${step} of 3`
                    : "Complete"}
              </p>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === "history" && "Claims History"}
                {activeTab === "new" && step === 1 && "New Claim"}
                {activeTab === "new" && step === 2 && "Incident Details"}
                {activeTab === "new" && step === 3 && "Review & Submit"}
                {activeTab === "new" && step === 4 && "Claim Submitted"}
              </h1>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
              {activeTab === "history" ? (
                <History className="w-5 h-5 text-white" />
              ) : (
                <ClipboardList className="w-5 h-5 text-white" />
              )}
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 mt-4 p-1 bg-white/10 rounded-2xl">
            <button
              onClick={() => setActiveTab("new")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all",
                activeTab === "new"
                  ? "bg-white text-[#7C79C8] shadow-sm"
                  : "text-white/70",
              )}
            >
              <Plus className="w-3.5 h-3.5" />
              New Claim
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all",
                activeTab === "history"
                  ? "bg-white text-[#7C79C8] shadow-sm"
                  : "text-white/70",
              )}
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
          </div>

          {/* Progress bar — only for new claim wizard */}
          {activeTab === "new" && step < 4 && (
            <div className="flex gap-1.5 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-300",
                    s <= step ? "bg-white" : "bg-white/25",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-10 mt-4 space-y-4">
        <AnimatePresence mode="wait">
          {/* ── Claims History Tab ── */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              className="space-y-3"
            >
              {mockClaimHistory.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#E8E7F7] flex items-center justify-center">
                    <History className="w-6 h-6 text-[#9390BC]" />
                  </div>
                  <p className="text-sm text-[#9390BC]">No claims yet</p>
                </div>
              ) : (
                mockClaimHistory.map((claim, i) => {
                  const linkedPolicy = mockPolicies.find(
                    (p) => p.id === claim.policy_id,
                  );
                  const statusConfig: Record<
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
                  const sc = statusConfig[claim.status];
                  return (
                    <motion.div
                      key={claim.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="p-4">
                        {/* Top row: ref + status */}
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

                        {/* Claim type */}
                        <div className="text-sm font-semibold text-[#313057] mb-1">
                          {claim.claim_type_label}
                        </div>

                        {/* Description */}
                        <p className="text-xs text-[#7878A8] leading-relaxed line-clamp-2 mb-3">
                          {claim.description}
                        </p>

                        {/* Bottom row: dates + amount */}
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

              <button
                onClick={() => setActiveTab("new")}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-[#C8C7E8] text-[#7C79C8] text-sm font-semibold active:scale-[0.98] transition-transform"
              >
                <Plus className="w-4 h-4" />
                File a New Claim
              </button>
            </motion.div>
          )}

          {/* ── New Claim Wizard ── */}
          {activeTab === "new" && step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              {/* Policy selector */}
              <div>
                <h2 className="text-sm font-bold text-[#313057] mb-2.5">
                  Choose Policy
                </h2>
                <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
                  {mockPolicies
                    .filter((p) => p.status !== "expired")
                    .map((p, i) => (
                      <motion.button
                        key={p.id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => {
                          setSelectedPolicyId(p.id);
                          setSelectedClaimType(null);
                        }}
                        className={cn(
                          "flex-shrink-0 flex flex-col items-start gap-1.5 p-3 rounded-2xl border-2 w-36 transition-all text-left active:scale-95 relative",
                          selectedPolicyId === p.id
                            ? "border-[#7C79C8] bg-[#ECEAFB]"
                            : "border-[#C8C7E8] bg-white",
                        )}
                      >
                        <span className="text-xl">
                          {getTypeIcon(p.policy_type)}
                        </span>
                        <div className="text-xs font-bold text-[#313057] leading-tight">
                          {p.provider}
                        </div>
                        <div className="text-[10px] text-[#7878A8]">
                          {getTypeLabel(p.policy_type)}
                        </div>
                        {selectedPolicyId === p.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#7C79C8] absolute top-2 right-2" />
                        )}
                      </motion.button>
                    ))}
                </div>
              </div>

              {/* Claim type selector */}
              {policy && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-sm font-bold text-[#313057] mb-2.5">
                    What Are You Claiming For?
                  </h2>
                  <div className="space-y-2">
                    {claimTypes.map((ct) => (
                      <button
                        key={ct.id}
                        onClick={() => setSelectedClaimType(ct.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left active:scale-[0.98]",
                          selectedClaimType === ct.id
                            ? "border-[#7C79C8] bg-[#ECEAFB]"
                            : "border-[#C8C7E8] bg-white",
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                            selectedClaimType === ct.id
                              ? "bg-[#7C79C8] text-white"
                              : "bg-[#ECEAFB] text-[#7C79C8]",
                          )}
                        >
                          {ct.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-[#313057]">
                            {ct.label}
                          </div>
                          <div className="text-xs text-[#9390BC] mt-0.5">
                            {ct.description}
                          </div>
                        </div>
                        {selectedClaimType === ct.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#7C79C8] flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <Button
                fullWidth
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
                className="mt-2 gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* ── Step 2: Incident details ── */}
          {activeTab === "new" && step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              className="space-y-3"
            >
              {/* Summary chip */}
              {policy && selectedType && (
                <div className="flex items-center gap-2.5 p-3 bg-[#ECEAFB] rounded-2xl border border-[#C8C7E8]">
                  <div className="w-8 h-8 rounded-xl bg-[#7C79C8] flex items-center justify-center text-white flex-shrink-0">
                    {selectedType.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#7C79C8]">
                      {selectedType.label}
                    </div>
                    <div className="text-xs text-[#7878A8] truncate">
                      {policy.provider} · {getTypeLabel(policy.policy_type)}
                    </div>
                  </div>
                </div>
              )}

              {/* Date */}
              <Card className="p-4 space-y-1">
                <label className="flex items-center gap-2 text-xs font-bold text-[#313057] mb-2">
                  <CalendarDays className="w-3.5 h-3.5 text-[#7C79C8]" />
                  Incident Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={incidentDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full text-sm text-[#313057] bg-[#F5F4FB] border border-[#C8C7E8] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#7C79C8] transition-colors"
                />
              </Card>

              {/* Description */}
              <Card className="p-4">
                <label className="flex items-center gap-2 text-xs font-bold text-[#313057] mb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#7C79C8]" />
                  Describe What Happened <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide as much detail as possible — location, circumstances, any third parties involved…"
                  rows={4}
                  className="w-full text-sm text-[#313057] bg-[#F5F4FB] border border-[#C8C7E8] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#7C79C8] transition-colors resize-none placeholder:text-[#B2B0D4]"
                />
                <div className="mt-1.5 text-right">
                  <span
                    className={cn(
                      "text-xs",
                      description.length < 10
                        ? "text-[#C4C2E4]"
                        : "text-[#9390BC]",
                    )}
                  >
                    {description.length} chars
                  </span>
                </div>
              </Card>

              {/* Estimated amount (optional) */}
              <Card className="p-4">
                <label className="flex items-center gap-2 text-xs font-bold text-[#313057] mb-2">
                  <DollarSign className="w-3.5 h-3.5 text-[#7C79C8]" />
                  Estimated Claim Amount
                  <span className="text-[#9390BC] font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9390BC] font-semibold">
                    £
                  </span>
                  <input
                    type="number"
                    value={estimatedAmount}
                    onChange={(e) => setEstimatedAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-sm text-[#313057] bg-[#F5F4FB] border border-[#C8C7E8] rounded-xl pl-7 pr-3 py-2.5 focus:outline-none focus:border-[#7C79C8] transition-colors placeholder:text-[#B2B0D4]"
                  />
                </div>
              </Card>

              {/* Contact number (optional) */}
              <Card className="p-4">
                <label className="flex items-center gap-2 text-xs font-bold text-[#313057] mb-2">
                  <Phone className="w-3.5 h-3.5 text-[#7C79C8]" />
                  Contact Number
                  <span className="text-[#9390BC] font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+44 7700 000000"
                  className="w-full text-sm text-[#313057] bg-[#F5F4FB] border border-[#C8C7E8] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#7C79C8] transition-colors placeholder:text-[#B2B0D4]"
                />
              </Card>

              <Button
                fullWidth
                disabled={!canProceedStep2}
                onClick={() => setStep(3)}
                className="gap-2"
              >
                Review Claim <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* ── Step 3: Review ── */}
          {activeTab === "new" && step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              className="space-y-3"
            >
              <Card className="p-4 space-y-0 divide-y divide-[#EAE8F8]">
                {[
                  {
                    label: "Policy",
                    value: policy
                      ? `${policy.provider} · ${policy.policy_number}`
                      : "-",
                  },
                  { label: "Claim Type", value: selectedType?.label ?? "-" },
                  {
                    label: "Incident Date",
                    value: incidentDate
                      ? new Date(incidentDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "-",
                  },
                  ...(estimatedAmount
                    ? [
                        {
                          label: "Estimated Amount",
                          value: `£${parseFloat(estimatedAmount).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`,
                        },
                      ]
                    : []),
                  ...(contactNumber
                    ? [{ label: "Contact", value: contactNumber }]
                    : []),
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-start justify-between py-2.5 gap-4"
                  >
                    <span className="text-xs text-[#9390BC] flex-shrink-0">
                      {label}
                    </span>
                    <span className="text-xs font-semibold text-[#313057] text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </Card>

              {/* Description preview */}
              <Card className="p-4">
                <div className="text-xs text-[#9390BC] mb-1.5">Description</div>
                <p className="text-sm text-[#3D3B65] leading-relaxed">
                  {description}
                </p>
              </Card>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 px-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#B2B0D4] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#B2B0D4] leading-snug">
                  By submitting, you confirm the details above are accurate.
                  Your insurer will contact you within 2–5 business days to
                  process this claim.
                </p>
              </div>

              <Button fullWidth onClick={() => setStep(4)} className="gap-2">
                Submit Claim <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* ── Step 4: Success ── */}
          {activeTab === "new" && step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Success card */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#E0DEF5] p-8 flex flex-col items-center text-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <div>
                  <h2 className="text-lg font-bold text-[#313057]">
                    Claim Submitted!
                  </h2>
                  <p className="text-sm text-[#9390BC] mt-1">
                    Your claim has been received and is being reviewed.
                  </p>
                </div>
                <div className="w-full bg-[#F5F4FB] rounded-xl px-4 py-3 text-center">
                  <div className="text-xs text-[#9390BC]">Reference Number</div>
                  <div className="text-base font-bold text-[#7C79C8] mt-0.5 tracking-wide">
                    {refNumber}
                  </div>
                </div>
              </div>

              {/* What's next */}
              <Card className="p-4">
                <h3 className="text-sm font-bold text-[#313057] mb-3">
                  What happens next?
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      step: "1",
                      text: "Your insurer reviews the details submitted.",
                    },
                    {
                      step: "2",
                      text: "A claims handler will contact you within 2–5 business days.",
                    },
                    {
                      step: "3",
                      text: "You may be asked to provide supporting documents or photos.",
                    },
                    {
                      step: "4",
                      text: "Once approved, settlement will be processed promptly.",
                    },
                  ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#E8E7F7] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-[#7C79C8]">
                          {step}
                        </span>
                      </div>
                      <p className="text-xs text-[#7878A8] leading-snug">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <Button fullWidth variant="outline" onClick={() => navigate("/")}>
                Back to Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
