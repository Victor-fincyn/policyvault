import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileUp,
  Mail,
  Sparkles,
  FileText,
  CheckCircle2,
  ChevronRight,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn, getTypeLabel } from "@/lib/utils";
import type { PolicyType } from "@/types/policy";

const STEPS = ["Upload", "Confirm"];

const RECENT_UPLOADS = [
  {
    id: "r1",
    name: "Health_Policy_2024.pdf",
    size: "1.2 MB",
    age: "2 days ago",
    status: "Processed",
  },
  {
    id: "r2",
    name: "Motor_Admiral_2025.pdf",
    size: "870 KB",
    age: "1 week ago",
    status: "Processed",
  },
];

export function UploadPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [uploadMethod, setUploadMethod] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [savedType] = useState<PolicyType>("motor");

  const handleUpload = (method: string) => {
    setUploadMethod(method);
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      setStep(1);
    }, 2200);
  };

  return (
    <div className="min-h-full pb-24 bg-[#F5F4FB]">
      {/* Header */}
      <div className="bg-white border-b border-[#C8C7E8] px-4 pt-12 pb-4 sticky top-0 z-30">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => (step > 0 ? setStep((s) => s - 1) : navigate("/"))}
              className="w-9 h-9 rounded-xl bg-[#ECEAFB] flex items-center justify-center active:scale-90 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 text-[#313057]" />
            </button>
            <h1 className="text-lg font-bold text-[#313057] flex-1">
              Upload policy
            </h1>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-0">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                      i < step
                        ? "bg-[#7C79C8] text-white"
                        : i === step
                          ? "bg-[#313057] text-white"
                          : "bg-[#E3E2F5] text-[#9390BC]",
                    )}
                  >
                    {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      i === step ? "text-[#313057]" : "text-[#9390BC]",
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-px mx-2",
                      i < step ? "bg-[#7C79C8]" : "bg-[#dcdcee]",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        <AnimatePresence mode="wait">
          {/* ── Step 0: Upload ── */}
          {step === 0 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* Upload method */}
              <div>
                <h2 className="font-bold text-[#313057] text-base mb-3">
                  Choose upload method
                </h2>

                {isExtracting ? (
                  <Card className="p-8 flex flex-col items-center gap-4 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-14 h-14 rounded-full border-4 border-[#D3D3F6] border-t-[#7C79C8]"
                    />
                    <div>
                      <div className="font-bold text-[#313057]">
                        Extracting Policy Details
                      </div>
                      <div className="text-sm text-[#7878A8] mt-1">
                        AI is reading your document…
                      </div>
                    </div>
                    <div className="w-full space-y-2 text-left">
                      {[
                        "Reading document structure",
                        "Identifying policy details",
                        "Extracting coverage terms",
                      ].map((s, i) => (
                        <motion.div
                          key={s}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.55 }}
                          className="flex items-center gap-2 text-sm text-[#7878A8]"
                        >
                          <Cpu className="w-3.5 h-3.5 text-[#7C79C8]" />
                          {s}
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {[
                      {
                        method: "pdf",
                        icon: FileUp,
                        iconBg: "bg-[#E8E7F7]",
                        iconColor: "text-[#7C79C8]",
                        label: "Upload PDF",
                        sub: "Choose from your files",
                      },
                      {
                        method: "email",
                        icon: Mail,
                        iconBg: "bg-emerald-50",
                        iconColor: "text-emerald-500",
                        label: "Import from email",
                        sub: "Find policy in inbox",
                      },
                    ].map(
                      ({
                        method,
                        icon: Icon,
                        iconBg,
                        iconColor,
                        label,
                        sub,
                      }) => (
                        <button
                          key={method}
                          onClick={() => handleUpload(method)}
                          className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl border border-[#C8C7E8] bg-white hover:border-[#D3D3F6] hover:bg-[#F5F4FB] active:scale-[0.98] transition-all text-left shadow-sm"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "w-11 h-11 rounded-xl flex items-center justify-center",
                                iconBg,
                              )}
                            >
                              <Icon className={cn("w-5 h-5", iconColor)} />
                            </div>
                            <div>
                              <div className="font-semibold text-[#313057] text-sm">
                                {label}
                              </div>
                              <div className="text-xs text-[#9390BC] mt-0.5">
                                {sub}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#B2B0D4] flex-shrink-0" />
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* File format info — shown instead of AI section */}
              {!isExtracting && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#F5F4FB] border border-[#E3E2F5]">
                  <FileText className="w-4 h-4 text-[#9390BC] flex-shrink-0" />
                  <div className="text-xs text-[#7878A8]">
                    <span className="font-semibold text-[#313057]">
                      Supported formats:
                    </span>{" "}
                    PDF, JPG, PNG
                    <span className="mx-2 text-[#C8C7E8]">|</span>
                    <span className="font-semibold text-[#313057]">
                      Max size:
                    </span>{" "}
                    10 MB
                  </div>
                </div>
              )}

              {/* Recent uploads */}
              {!isExtracting && (
                <div>
                  <h2 className="font-bold text-[#313057] text-base mb-3">
                    Recent uploads
                  </h2>
                  <div className="space-y-2">
                    {RECENT_UPLOADS.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#C8C7E8] shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#E8E7F7] flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-[#7C79C8]" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#313057]">
                              {file.name}
                            </div>
                            <div className="text-xs text-[#9390BC] mt-0.5">
                              {file.age} • {file.size}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          {file.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI info box — at the bottom */}
              {!isExtracting && (
                <div className="flex gap-3 p-4 rounded-2xl bg-[#eeeef8] border border-[#dcdcf0]">
                  <div className="flex-shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5 text-[#7C79C8]" />
                  </div>
                  <div>
                    <div className="font-bold text-[#313057] text-sm">
                      AI-powered extraction
                    </div>
                    <div className="text-xs text-[#7C79C8] mt-1 leading-relaxed">
                      We'll automatically extract policy details, coverage
                      information, and important dates from your document
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Step 1: Confirm / Success ── */}
          {step === 1 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-10 gap-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-[#313057]">
                  Policy Saved!
                </h2>
                <p className="text-sm text-[#7878A8] mt-2 max-w-xs mx-auto">
                  Your {getTypeLabel(savedType)} policy has been added to
                  PolicyVault.
                </p>
              </div>
              <div className="w-full space-y-3 mt-2">
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => navigate("/policies")}
                >
                  View My Policies
                </Button>
                <Button
                  fullWidth
                  size="lg"
                  variant="ghost"
                  onClick={() => {
                    setStep(0);
                    setUploadMethod(null);
                  }}
                >
                  Add Another Policy
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
