import React from "react";
import { motion } from "framer-motion";
import { Car, Heart, Shield, Home, Plane, ChevronRight } from "lucide-react";
import type { Policy, PolicyType } from "@/types/policy";
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
import { Badge } from "@/components/ui/Badge";

const TYPE_ICON: Record<PolicyType, React.ReactNode> = {
  motor: <Car className="w-5 h-5 text-white" />,
  health: <Heart className="w-5 h-5 text-white" />,
  life: <Shield className="w-5 h-5 text-white" />,
  home: <Home className="w-5 h-5 text-white" />,
  travel: <Plane className="w-5 h-5 text-white" />,
};

const TYPE_ICON_LG: Record<PolicyType, React.ReactNode> = {
  motor: <Car className="w-7 h-7 text-white" />,
  health: <Heart className="w-7 h-7 text-white" />,
  life: <Shield className="w-7 h-7 text-white" />,
  home: <Home className="w-7 h-7 text-white" />,
  travel: <Plane className="w-7 h-7 text-white" />,
};

interface PolicyCardProps {
  policy: Policy;
  onClick?: () => void;
  index?: number;
  compact?: boolean;
}

export function PolicyCard({
  policy,
  onClick,
  index = 0,
  compact = false,
}: PolicyCardProps) {
  const gradient = getTypeGradient(policy.policy_type);
  const expiryColor = getExpiryBadgeColor(policy.days_until_expiry);
  const statusColor = getStatusColor(policy.status);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.07 }}
        onClick={onClick}
        className="flex-shrink-0 w-56 bg-white rounded-2xl border border-[#C8C7E8] shadow-sm overflow-hidden cursor-pointer active:scale-95 transition-transform"
      >
        <div className={`bg-gradient-to-br ${gradient} p-4`}>
          <div className="text-2xl mb-1">
            {TYPE_ICON_LG[policy.policy_type]}
          </div>
          <div className="text-white font-semibold text-sm">
            {getTypeLabel(policy.policy_type)}
          </div>
          <div className="text-white/80 text-xs mt-0.5">{policy.provider}</div>
        </div>
        <div className="p-3">
          <div className="text-[#313057] font-bold text-base">
            {formatCurrency(policy.premium_amount)}
          </div>
          <div className="text-[#7878A8] text-xs">per year</div>
          <div className="mt-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${expiryColor}`}
            >
              {getExpiryLabel(policy.days_until_expiry)}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-[#C8C7E8] shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-sm`}
            >
              {TYPE_ICON[policy.policy_type]}
            </div>
            <div>
              <div className="font-bold text-[#313057] text-sm leading-tight">
                {policy.provider}
              </div>
              <div className="text-[#7878A8] text-xs mt-0.5">
                {policy.policy_number}
              </div>
              {policy.policy_type === "motor" && policy.vehicle_number && (
                <div className="text-[#7878A8] text-xs">
                  {policy.vehicle_number}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusColor}>
              {getStatusLabel(policy.status)}
            </Badge>
            <ChevronRight className="w-4 h-4 text-[#9390BC]" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-[#EAE8F8]">
          <div>
            <div className="text-xs text-[#7878A8]">Premium</div>
            <div className="font-bold text-sm text-[#313057]">
              {formatCurrency(policy.premium_amount)}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#7878A8]">Sum Insured</div>
            <div className="font-bold text-sm text-[#313057]">
              {formatCurrency(policy.sum_insured)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#7878A8]">Expires</div>
            <div
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border inline-block ${expiryColor}`}
            >
              {getExpiryLabel(policy.days_until_expiry)}
            </div>
          </div>
        </div>

        <div className="mt-2 text-xs text-[#7878A8]">
          {formatDate(policy.start_date)} – {formatDate(policy.end_date)}
        </div>
      </div>
    </motion.div>
  );
}
