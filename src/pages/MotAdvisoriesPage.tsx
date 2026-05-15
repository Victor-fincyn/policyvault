import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Gauge,
  Wrench,
} from "lucide-react";
import { mockPolicies } from "@/data/mockData";

function formatMotDate(dateStr: string) {
  const d = new Date(dateStr);
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");
}

export function MotAdvisoriesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const policy = mockPolicies.find((p) => p.id === id);

  const history = policy?.mot_history ?? [];
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const passedCount = history.filter((e) => e.result === "Passed").length;
  const failedCount = history.filter((e) => e.result === "Failed").length;

  return (
    <div className="min-h-screen bg-[#F5F4FB]">
      {/* Header — dark gradient matching other pages */}
      <div className="bg-gradient-to-br from-[#1e1c38] via-[#313057] to-[#4a4878] px-4 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-16 -right-4 w-24 h-24 rounded-full bg-white/5" />

        <div className="max-w-lg mx-auto relative">
          <button
            onClick={() => navigate(`/policies/${id}`)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 active:scale-90 transition-transform mb-5"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-xs font-medium mb-1 tracking-wide uppercase">
                Vehicle History
              </p>
              <h1 className="text-2xl font-bold text-white">MOT Advisories</h1>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-2 mt-5">
              <div className="px-3 py-1.5 rounded-full bg-white/10">
                <span className="text-xs font-semibold text-white">
                  {history.length} checks
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">
                  {passedCount} Passed
                </span>
              </div>
              {failedCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20">
                  <XCircle className="w-3 h-3 text-red-400" />
                  <span className="text-xs font-semibold text-red-300">
                    {failedCount} Failed
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 pb-10 mt-4">
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-[#9390BC] text-sm">
            No MOT history available
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((entry, i) => {
              const isOpen = expanded.has(i);
              const passed = entry.result === "Passed";
              const advisoryCount = entry.advisories.length;

              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E0DEF5]"
                >
                  {/* Card header */}
                  <button
                    onClick={() => toggle(i)}
                    className="w-full px-4 py-4 flex items-center gap-3 active:bg-[#F5F4FB] transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        passed ? "bg-emerald-50" : "bg-red-50"
                      }`}
                    >
                      {passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-base font-bold text-[#313057]">
                        {formatMotDate(entry.date)}
                      </p>
                      <p className="text-xs text-[#9390BC] mt-0.5">
                        {advisoryCount === 0
                          ? "No advisories"
                          : `${advisoryCount} ${advisoryCount === 1 ? "advisory" : "advisories"}`}
                        {entry.mileage != null
                          ? ` · ${entry.mileage.toLocaleString()} mi`
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          passed
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {entry.result}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4 text-[#9390BC]" />
                      </motion.div>
                    </div>
                  </button>

                  {/* Accordion body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-[#EAE8F8]">
                          {entry.advisories.length === 0 ? (
                            <p className="text-center text-sm text-[#9390BC] py-4">
                              No advisories recorded for this test.
                            </p>
                          ) : (
                            <div className="space-y-2 pt-3">
                              {entry.advisories.map((advisory, j) => (
                                <div
                                  key={j}
                                  className="flex items-start gap-3 bg-amber-50 rounded-xl px-3 py-3"
                                >
                                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <AlertCircle className="w-3 h-3 text-amber-600" />
                                  </div>
                                  <span className="text-sm text-[#3D3B65] leading-snug">
                                    {advisory}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          {entry.mileage != null && (
                            <div className="mt-3 pt-3 border-t border-[#EAE8F8] flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Gauge className="w-3.5 h-3.5 text-[#9390BC]" />
                                <span className="text-xs text-[#9390BC]">
                                  Mileage at test
                                </span>
                              </div>
                              <span className="text-xs font-semibold text-[#3D3B65]">
                                {entry.mileage.toLocaleString()} miles
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-5 flex items-start gap-2.5 px-1">
          <AlertCircle className="w-3.5 h-3.5 text-[#B2B0D4] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#B2B0D4] leading-snug">
            MOT advisories are non-failure items that may need attention.
            Monitor them and address before your next MOT.
          </p>
        </div>
      </div>
    </div>
  );
}
