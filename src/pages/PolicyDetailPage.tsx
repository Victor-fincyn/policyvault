import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Car,
  Heart,
  Users,
  FileText,
  Shield,
  Home,
  Plane,
  Flame,
  PlusCircle,
  Star,
  Wallet,
  FileCheck,
  MapPin,
  Wrench,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { mockPolicies } from "@/data/mockData";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  formatCurrency,
  formatDate,
  getExpiryBadgeColor,
  getExpiryLabel,
  getStatusColor,
  getStatusLabel,
  getTypeGradient,
  getTypeLabel,
} from "@/lib/utils";

const COVERAGE_GROUPS = [
  {
    key: "third_party",
    icon: <Car className="w-5 h-5" />,
    label: "Third Party",
    iconBg: "bg-[#7C79C8]",
    cardBg: "bg-[#ECEAFB]",
    border: "border-[#C8C7E8]",
  },
  {
    key: "theft_fire",
    icon: <Flame className="w-5 h-5" />,
    label: "Theft & Fire",
    iconBg: "bg-[#c43060]",
    cardBg: "bg-[#fdf0f4]",
    border: "border-[#f4d0dc]",
  },
  {
    key: "comprehensive",
    icon: <Shield className="w-5 h-5" />,
    label: "Comprehensive",
    iconBg: "bg-[#1a8c5c]",
    cardBg: "bg-[#f0faf5]",
    border: "border-[#c8eedd]",
  },
  {
    key: "addons",
    icon: <PlusCircle className="w-5 h-5" />,
    label: "Add-Ons",
    iconBg: "bg-[#1c6aa8]",
    cardBg: "bg-[#f0f6fc]",
    border: "border-[#c8def4]",
  },
  {
    key: "specialised",
    icon: <Star className="w-5 h-5" />,
    label: "Specialised",
    iconBg: "bg-[#b86010]",
    cardBg: "bg-[#fdf6ee]",
    border: "border-[#f4dfc0]",
  },
];

export function PolicyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const backTo = new URLSearchParams(search).get("from") ?? "/policies";
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const policy = mockPolicies.find((p) => p.id === id);

  if (!policy) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-4xl mb-3">&#x1F50D;</div>
          <div className="font-semibold text-[#313057]">Policy not found</div>
          <Button className="mt-4" onClick={() => navigate("/policies")}>
            Back to Policies
          </Button>
        </div>
      </div>
    );
  }

  const gradient = getTypeGradient(policy.policy_type);
  const statusColor = getStatusColor(policy.status);
  const expiryColor = getExpiryBadgeColor(policy.days_until_expiry);

  // One-shot AI answer generator based on actual policy data
  const generateAnswer = (question: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const q = question.toLowerCase();
        const p = policy!;

        if (
          q.includes("cover") ||
          (q.includes("what") && q.includes("included"))
        ) {
          resolve(
            `Your ${p.provider} policy covers: ${p.covered_items.slice(0, 3).join(", ")}${
              p.covered_items.length > 3
                ? `, and ${p.covered_items.length - 3} more items`
                : ""
            }. Always check the full policy document for exact terms.`,
          );
        } else if (
          q.includes("not cover") ||
          q.includes("exclud") ||
          q.includes("what isn")
        ) {
          resolve(
            `This policy does not cover: ${p.not_covered_items.slice(0, 3).join(", ")}${
              p.not_covered_items.length > 3
                ? `, and ${p.not_covered_items.length - 3} more exclusions`
                : ""
            }.`,
          );
        } else if (
          q.includes("premium") ||
          q.includes("cost") ||
          q.includes("price") ||
          q.includes("pay")
        ) {
          resolve(
            `Your premium with ${p.provider} is ${formatCurrency(p.premium_amount)} (${p.payment_frequency.replace("_", " ")}). The total sum insured is ${formatCurrency(p.sum_insured)}.`,
          );
        } else if (
          q.includes("expir") ||
          q.includes("renew") ||
          q.includes("end")
        ) {
          resolve(
            p.days_until_expiry < 0
              ? `This policy expired ${Math.abs(p.days_until_expiry)} days ago on ${formatDate(p.end_date)}. You should renew it as soon as possible.`
              : p.days_until_expiry <= 30
                ? `Your policy expires in ${p.days_until_expiry} days on ${formatDate(p.end_date)}. It's a good time to start renewal.`
                : `Your policy runs until ${formatDate(p.end_date)} � ${p.days_until_expiry} days remaining. You're well covered.`,
          );
        } else if (q.includes("excess") || q.includes("deductible")) {
          if (p.compulsory_excess != null || p.voluntary_excess != null) {
            resolve(
              `Your compulsory excess is ${p.compulsory_excess != null ? formatCurrency(p.compulsory_excess) : "not specified"} and voluntary excess is ${p.voluntary_excess != null ? formatCurrency(p.voluntary_excess) : "not specified"}.`,
            );
          } else {
            resolve(
              `No excess details are recorded for this policy. Check your policy document for this information.`,
            );
          }
        } else if (
          q.includes("claim") ||
          q.includes("accident") ||
          q.includes("report")
        ) {
          resolve(
            `To make a claim on your ${p.provider} policy, tap the "Make a Claim" button at the bottom of this screen. Have your policy number ready: ${p.policy_number}. Claims are typically processed within 2�5 business days.`,
          );
        } else if (
          q.includes("contact") ||
          q.includes("phone") ||
          q.includes("help") ||
          q.includes("support")
        ) {
          resolve(
            `For support or queries about your ${p.provider} policy (${p.policy_number}), contact your insurer directly. You can also start a claim through this app and a claims handler will reach out.`,
          );
        } else if (
          q.includes("vehicle") ||
          q.includes("car") ||
          q.includes("reg")
        ) {
          if (p.vehicle_number) {
            resolve(
              `This policy covers your vehicle ${p.vehicle_number}${
                p.vehicle_make
                  ? ` � a ${p.vehicle_year ?? ""} ${p.vehicle_make} ${p.vehicle_model ?? ""}`.trim()
                  : ""
              }.`,
            );
          } else {
            resolve(`No vehicle details are recorded for this policy.`);
          }
        } else if (q.includes("mot")) {
          if (p.mot_expiry) {
            resolve(
              `Your MOT expires on ${formatDate(p.mot_expiry)}. ${p.mot_advisories && p.mot_advisories.length > 0 ? `There are ${p.mot_advisories.length} outstanding advisory items � check the MOT Advisories section.` : "No outstanding advisories."}`,
            );
          } else {
            resolve(`No MOT information is recorded for this policy.`);
          }
        } else if (q.includes("nominee") || q.includes("beneficiar")) {
          if (p.nominees.length > 0) {
            resolve(
              `Your nominated beneficiaries are: ${p.nominees.map((n) => `${n.name} (${n.relation}, ${n.percentage}%)`).join(", ")}.`,
            );
          } else {
            resolve(`No nominees are recorded for this policy.`);
          }
        } else {
          resolve(
            `Based on your ${p.provider} ${getTypeLabel(p.policy_type)} policy (${p.policy_number}): it is currently ${p.status.replace("_", " ")} with ${formatCurrency(p.sum_insured)} sum insured and runs until ${formatDate(p.end_date)}. Feel free to ask about coverage, premium, excess, claims, or expiry.`,
          );
        }
      }, 1200);
    });
  };

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    setAiAnswer(null);
    const answer = await generateAnswer(aiQuestion);
    setAiAnswer(answer);
    setAiLoading(false);
  };

  const handleOpenAI = () => {
    setAiOpen(true);
    setAiQuestion("");
    setAiAnswer(null);
    setAiLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="min-h-full pb-28 bg-[#F5F4FB]">
      {/* Hero Header */}
      <div
        className={`bg-gradient-to-br ${gradient} px-4 pt-12 pb-16 relative overflow-hidden`}
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute top-16 -right-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="max-w-lg mx-auto relative">
          <button
            onClick={() => navigate(backTo)}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-4 active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="text-white/80 text-sm font-medium">
                {getTypeLabel(policy.policy_type)} Insurance
              </div>
              {policy.policy_type === "motor" &&
              (policy.vehicle_make || policy.vehicle_model) ? (
                <>
                  <div className="text-white text-2xl font-bold mt-0.5">
                    {[
                      policy.vehicle_year,
                      policy.vehicle_make,
                      policy.vehicle_model,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </div>
                  <div className="text-white/75 text-sm font-medium mt-0.5">
                    {policy.provider}
                  </div>
                </>
              ) : (
                <div className="text-white text-2xl font-bold mt-0.5">
                  {policy.provider}
                </div>
              )}
              <div
                className={`mt-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-2.5 grid gap-2 ${
                  policy.policy_type === "motor" && policy.vehicle_number
                    ? "grid-cols-2"
                    : "grid-cols-1 max-w-[210px]"
                }`}
              >
                <div className="rounded-lg bg-white/12 border border-white/20 px-2.5 py-2 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                    Policy Number
                  </div>
                  <div className="text-white text-[13px] leading-tight font-mono font-bold tracking-wider mt-1 truncate">
                    {policy.policy_number}
                  </div>
                </div>
                {policy.policy_type === "motor" && policy.vehicle_number && (
                  <div className="rounded-lg bg-[#7C79C8]/35 border border-white/15 px-2.5 py-2 min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                      Registration
                    </div>
                    <div className="text-white text-[13px] leading-tight font-bold tracking-widest mt-1 truncate">
                      {policy.vehicle_number}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              {
                {
                  motor: <Car className="w-8 h-8 text-white" />,
                  health: <Heart className="w-8 h-8 text-white" />,
                  life: <Shield className="w-8 h-8 text-white" />,
                  home: <Home className="w-8 h-8 text-white" />,
                  travel: <Plane className="w-8 h-8 text-white" />,
                }[policy.policy_type]
              }
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Badge className={statusColor}>
              {getStatusLabel(policy.status)}
            </Badge>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${expiryColor}`}
            >
              {getExpiryLabel(policy.days_until_expiry)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-10 space-y-4 relative z-10">
        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[#7878A8]">Policyholder</div>
              <div className="font-semibold text-sm text-[#313057] mt-0.5">
                {policy.policyholder_name}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#7878A8]">Provider</div>
              <div className="font-semibold text-sm text-[#313057] mt-0.5">
                {policy.provider}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#7878A8]">Start Date</div>
              <div className="font-semibold text-sm text-[#313057] mt-0.5">
                {formatDate(policy.start_date)}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#7878A8]">End Date</div>
              <div className="font-semibold text-sm text-[#313057] mt-0.5">
                {formatDate(policy.end_date)}
              </div>
            </div>
            <div className="col-span-2 border-t border-[#EAE8F8] pt-3">
              <div className="text-xs text-[#7878A8]">Policy Number</div>
              <div className="font-semibold text-sm text-[#313057] mt-0.5">
                {policy.policy_number}
              </div>
            </div>
            {policy.additional_policyholder ? (
              <div className="col-span-2">
                <div className="text-xs text-[#7878A8]">
                  Additional Policyholder
                </div>
                <div className="font-semibold text-sm text-[#313057] mt-0.5">
                  {policy.additional_policyholder}
                </div>
              </div>
            ) : null}
          </Card>
        </motion.div>

        {/* Premium & Excess (motor only) */}
        {policy.policy_type === "motor" && policy.vehicle_make && (
          <>
            {/* Vehicle Details */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="p-4">
                <h3 className="font-bold text-[#313057] text-sm mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4" /> Vehicle Details
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Registration", value: policy.vehicle_number },
                    { label: "Make", value: policy.vehicle_make },
                    { label: "Model", value: policy.vehicle_model },
                    { label: "Year", value: String(policy.vehicle_year) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-xs text-[#7878A8]">{label}</div>
                      <div className="text-sm font-semibold text-[#313057] mt-0.5">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Premium & Excess */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              <Card className="overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EAE8F8]">
                  <Wallet className="w-4 h-4 text-[#7C79C8]" />
                  <h3 className="font-bold text-[#313057] text-sm">
                    Premium &amp; Excess
                  </h3>
                </div>
                {[
                  {
                    label: "Premium",
                    value: formatCurrency(policy.premium_amount),
                  },
                  ...(policy.compulsory_excess != null
                    ? [
                        {
                          label: "Compulsory Excess",
                          value: formatCurrency(policy.compulsory_excess),
                        },
                      ]
                    : []),
                  ...(policy.voluntary_excess != null
                    ? [
                        {
                          label: "Voluntary Excess",
                          value: formatCurrency(policy.voluntary_excess),
                        },
                      ]
                    : []),
                ].map(({ label, value }, i, arr) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? "border-b border-[#F5F4FB]" : ""}`}
                  >
                    <span className="text-sm text-[#7878A8]">{label}</span>
                    <span className="text-sm font-bold text-[#313057]">
                      {value}
                    </span>
                  </div>
                ))}
              </Card>
            </motion.div>

            {/* Tax Details */}
            {(policy.tax_due_date || policy.tax_status) && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EAE8F8]">
                    <FileCheck className="w-4 h-4 text-[#7C79C8]" />
                    <h3 className="font-bold text-[#313057] text-sm">
                      Tax Details
                    </h3>
                  </div>
                  {[
                    ...(policy.tax_due_date
                      ? [
                          {
                            label: "Tax Due Date",
                            value: formatDate(policy.tax_due_date),
                          },
                        ]
                      : []),
                    ...(policy.tax_status
                      ? [{ label: "Tax Status", value: policy.tax_status }]
                      : []),
                  ].map(({ label, value }, i, arr) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? "border-b border-[#F5F4FB]" : ""}`}
                    >
                      <span className="text-sm text-[#7878A8]">{label}</span>
                      <span
                        className={`text-sm font-bold ${label === "Tax Status" && value === "Taxed" ? "text-emerald-600" : "text-[#313057]"}`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </Card>
              </motion.div>
            )}

            {/* Vehicle Status & Address */}
            {(policy.euro_status ||
              policy.vehicle_owner_since ||
              policy.ulez_zone ||
              policy.vehicle_address) && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EAE8F8]">
                    <MapPin className="w-4 h-4 text-[#7C79C8]" />
                    <h3 className="font-bold text-[#313057] text-sm">
                      Vehicle Status &amp; Address
                    </h3>
                  </div>
                  {[
                    ...(policy.euro_status
                      ? [{ label: "Euro Status", value: policy.euro_status }]
                      : []),
                    ...(policy.vehicle_owner_since
                      ? [
                          {
                            label: "Vehicle Owner Since",
                            value: formatDate(policy.vehicle_owner_since),
                          },
                        ]
                      : []),
                    ...(policy.ulez_zone
                      ? [{ label: "ULEZ Zone", value: policy.ulez_zone }]
                      : []),
                    ...(policy.vehicle_address
                      ? [
                          {
                            label: "Vehicle Address",
                            value: policy.vehicle_address,
                          },
                        ]
                      : []),
                  ].map(({ label, value }, i, arr) => (
                    <div
                      key={label}
                      className={`flex items-start justify-between px-4 py-3 gap-4 ${i < arr.length - 1 ? "border-b border-[#F5F4FB]" : ""}`}
                    >
                      <span className="text-sm text-[#7878A8] flex-shrink-0">
                        {label}
                      </span>
                      <span
                        className={`text-sm font-bold text-right ${label === "ULEZ Zone" && value === "No Charge" ? "text-emerald-600" : "text-[#313057]"}`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </Card>
              </motion.div>
            )}

            {/* MOT Details */}
            {(policy.mot_expiry || policy.last_mot_mileage) && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EAE8F8]">
                    <Wrench className="w-4 h-4 text-[#7C79C8]" />
                    <h3 className="font-bold text-[#313057] text-sm">
                      MOT Details
                    </h3>
                  </div>
                  {[
                    ...(policy.mot_expiry
                      ? [
                          {
                            label: "MOT Expiry",
                            value: formatDate(policy.mot_expiry),
                          },
                        ]
                      : []),
                    ...(policy.last_mot_mileage != null
                      ? [
                          {
                            label: "Last MOT Mileage",
                            value:
                              policy.last_mot_mileage.toLocaleString() +
                              " miles",
                          },
                        ]
                      : []),
                  ].map(({ label, value }, i, arr) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? "border-b border-[#F5F4FB]" : ""}`}
                    >
                      <span className="text-sm text-[#7878A8]">{label}</span>
                      <span className="text-sm font-bold text-[#313057]">
                        {value}
                      </span>
                    </div>
                  ))}
                  {policy.mot_history && policy.mot_history.length > 0 && (
                    <div className="px-4 pb-4 pt-2">
                      <button
                        onClick={() => navigate(`/mot-advisories/${policy.id}`)}
                        className="w-full py-3 px-4 rounded-xl bg-[#E8E7F7] text-[#7C79C8] text-sm font-semibold flex items-center gap-3 active:scale-95 transition-transform"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-left">
                          View MOT History &amp; Advisories
                        </span>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                      </button>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </>
        )}

        {/* Coverage Groups */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <Card className="p-4">
            <h3 className="font-bold text-[#313057] text-base mb-3">
              Coverage Groups
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {COVERAGE_GROUPS.map((group) => (
                <div
                  key={group.key}
                  className={`flex items-center gap-3 px-3 py-3 rounded-2xl border ${group.cardBg} ${group.border}`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${group.iconBg} flex items-center justify-center flex-shrink-0 text-white shadow-sm`}
                  >
                    {group.icon}
                  </div>
                  <span className="text-xs font-bold text-[#313057] leading-tight">
                    {group.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Covered Items */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <Card className="p-4">
            <h3 className="font-bold text-[#313057] text-sm mb-3">
              What's Covered
            </h3>
            <div className="space-y-2">
              {policy.covered_items.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#313057]">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Exclusions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4">
            <h3 className="font-bold text-[#313057] text-sm mb-3">
              Exclusions
            </h3>
            <div className="space-y-2">
              {policy.not_covered_items.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#7878A8]">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <Card className="p-4 space-y-3">
            <h3 className="font-bold text-[#313057] text-sm">
              Additional Info
            </h3>
            {[
              {
                label: "Annual Premium",
                value: formatCurrency(policy.premium_amount),
                highlight: true,
              },
              {
                label: "Sum Insured",
                value: formatCurrency(policy.sum_insured),
              },
              {
                label: "Payment Frequency",
                value: policy.payment_frequency
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
              },
              ...(policy.claim_settlement_ratio
                ? [
                    {
                      label: "Claim Settlement",
                      value: policy.claim_settlement_ratio + "%",
                    },
                  ]
                : []),
            ].map(({ label, value, highlight }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2.5 border-b border-[#ededf8] last:border-0 last:pb-0"
              >
                <span className="text-sm text-[#7878A8]">{label}</span>
                <span
                  className={`text-sm font-bold ${highlight ? "text-[#7C79C8]" : "text-[#313057]"}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </Card>
        </motion.div>

        {/* Nominees */}
        {policy.nominees.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <Card className="p-4">
              <h3 className="font-bold text-[#313057] text-sm mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" /> Nominees
              </h3>
              <div className="space-y-2">
                {policy.nominees.map((n, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[#313057]">
                        {n.name}
                      </div>
                      <div className="text-xs text-[#7878A8]">{n.relation}</div>
                    </div>
                    <Badge className="bg-[#ECEAFB] text-[#7C79C8] border-[#C8C7E8]">
                      {n.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Document + Auto-Renewal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
        >
          <Card className="p-4 space-y-3">
            {policy.document_url && (
              <a
                href={policy.document_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between py-2 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#ECEAFB] flex items-center justify-center">
                    <FileText className="w-4 h-4 text-[#7C79C8]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#313057]">
                      Policy Document
                    </div>
                    <div className="text-xs text-[#7878A8]">Download PDF</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#7C79C8] group-hover:text-[#6360AF]" />
              </a>
            )}
            <div className="flex items-center justify-between py-2 border-t border-[#EAE8F8]">
              <div>
                <div className="text-sm font-semibold text-[#313057]">
                  Auto-Renewal
                </div>
                <div className="text-xs text-[#7878A8]">
                  Automatically renew before expiry
                </div>
              </div>
              <button
                onClick={() => setAutoRenewal(!autoRenewal)}
                className={`w-12 h-6 rounded-full transition-colors relative ${autoRenewal ? "bg-[#7C79C8]" : "bg-[#c8c8d8]"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${autoRenewal ? "translate-x-[26px]" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="grid grid-cols-2 gap-3 pb-4"
        >
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => navigate(`/renew?policyId=${policy.id}`)}
            className="gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Renew
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => navigate(`/claim?policyId=${policy.id}`)}
            className="gap-2"
          >
            <Shield className="w-3.5 h-3.5" /> Make a Claim
          </Button>
        </motion.div>
      </div>

      {/* AI Ask FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 22 }}
        onClick={handleOpenAI}
        aria-label="Ask about this policy"
        className="fixed bottom-24 right-4 w-[52px] h-[52px] rounded-full bg-[#7C79C8] shadow-xl flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <Sparkles className="w-5 h-5 text-white" />
      </motion.button>

      {/* AI Q&A Sheet */}
      <AnimatePresence>
        {aiOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!aiLoading) setAiOpen(false);
              }}
              className="fixed inset-0 bg-black/40 z-50"
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white rounded-t-3xl z-50 flex flex-col"
              style={{ maxHeight: "75vh" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-2 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#7C79C8] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#313057] leading-tight">
                      Ask about this policy
                    </p>
                    <p className="text-xs text-[#9390BC]">
                      {policy.provider} � {getTypeLabel(policy.policy_type)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAiOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#ECEAFB] flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-[#7C79C8]" />
                </button>
              </div>

              {/* Body */}
              <div
                className="flex-1 overflow-y-auto px-5 space-y-4"
                style={{
                  paddingBottom: aiAnswer
                    ? "calc(1.5rem + env(safe-area-inset-bottom, 0px) + 64px)"
                    : "1.25rem",
                }}
              >
                {/* Quick question chips � only before answering */}
                {!aiAnswer && !aiLoading && !aiQuestion && (
                  <div>
                    <p className="text-xs font-semibold text-[#9390BC] mb-2">
                      Quick questions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "What am I covered for?",
                        "What is my excess?",
                        "When does my policy expire?",
                        "How do I make a claim?",
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setAiQuestion(q);
                            setTimeout(() => inputRef.current?.focus(), 50);
                          }}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#ECEAFB] text-[#7C79C8] border border-[#C8C7E8] active:scale-95 transition-transform"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* User question bubble (after send) */}
                {(aiLoading || aiAnswer) && (
                  <div className="flex justify-end">
                    <div className="bg-[#7C79C8] text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%] leading-relaxed">
                      {aiQuestion}
                    </div>
                  </div>
                )}

                {/* Loading dots */}
                {aiLoading && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#7C79C8] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex gap-1 px-4 py-3 bg-[#ECEAFB] rounded-2xl rounded-bl-md">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.65,
                            delay: i * 0.16,
                          }}
                          className="w-1.5 h-1.5 rounded-full bg-[#7C79C8]"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* AI answer bubble */}
                {aiAnswer && !aiLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#7C79C8] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-[#ECEAFB] text-[#313057] text-sm px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[85%] leading-relaxed">
                      {aiAnswer}
                    </div>
                  </motion.div>
                )}

                {/* Ask again link */}
                {aiAnswer && (
                  <div className="flex justify-center pt-1">
                    <button
                      onClick={() => {
                        setAiQuestion("");
                        setAiAnswer(null);
                        setAiLoading(false);
                        setTimeout(() => inputRef.current?.focus(), 50);
                      }}
                      className="text-xs text-[#7C79C8] font-semibold underline underline-offset-2"
                    >
                      Ask another question
                    </button>
                  </div>
                )}
              </div>

              {/* Input row � hidden once answer is shown */}
              {!aiAnswer && !aiLoading && (
                <div
                  className="px-5 pt-2 border-t border-[#EAE8F8]"
                  style={{
                    paddingBottom:
                      "calc(1.5rem + env(safe-area-inset-bottom, 0px) + 64px)",
                  }}
                >
                  <div className="flex items-center gap-2 bg-[#F5F4FB] rounded-2xl border border-[#C8C7E8] px-3 py-2">
                    <input
                      ref={inputRef}
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAskAI();
                      }}
                      placeholder="Ask anything about your policy�"
                      className="flex-1 text-sm bg-transparent text-[#313057] placeholder:text-[#B2B0D4] focus:outline-none"
                    />
                    <button
                      onClick={handleAskAI}
                      disabled={!aiQuestion.trim()}
                      className="w-8 h-8 rounded-xl bg-[#7C79C8] flex items-center justify-center disabled:opacity-30 transition-opacity"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
