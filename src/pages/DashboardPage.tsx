import React, { useRef, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Clock,
  ChevronRight,
  Car,
  Heart,
  Shield,
  Home,
  Plane,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockPolicies, currentUser } from "@/data/mockData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  formatCurrency,
  formatDate,
  getExpiryBadgeColor,
  getExpiryLabel,
  getTypeGradient,
  getTypeIcon,
  getTypeLabel,
} from "@/lib/utils";
import type { PolicyType } from "@/types/policy";

const ALL_TYPES: PolicyType[] = ["motor", "health", "life", "home", "travel"];

export function DashboardPage() {
  const navigate = useNavigate();

  const activePolicies = mockPolicies.filter(
    (p) => p.status === "active" || p.status === "expiring_soon",
  );
  const expiringPolicies = mockPolicies
    .filter((p) => p.days_until_expiry >= 0 && p.days_until_expiry <= 30)
    .sort((a, b) => a.days_until_expiry - b.days_until_expiry);

  const totalPremium = activePolicies.reduce((sum, p) => {
    const yearly =
      p.payment_frequency === "monthly"
        ? p.premium_amount * 12
        : p.premium_amount;
    return sum + yearly;
  }, 0);

  const typeCounts = ALL_TYPES.map((type) => ({
    type,
    count: mockPolicies.filter((p) => p.policy_type === type).length,
  }));

  const unreadCount = 3;

  // ── Timeline ──────────────────────────────────────────
  const tlScrollRef = useRef<HTMLDivElement>(null);

  const tlEvents = useMemo(() => {
    const now = new Date();
    type TLE = {
      id: string;
      label: string;
      sublabel: string;
      date: string;
      days: number;
      iconType: PolicyType;
      policyId: string;
    };
    const list: TLE[] = [];
    mockPolicies.forEach((p) => {
      if (p.policy_type === "life") return;
      if (p.status === "expired") return;
      list.push({
        id: `${p.id}-policy`,
        label: getTypeLabel(p.policy_type),
        sublabel: p.vehicle_make ?? p.provider.split(" ")[0],
        date: p.end_date,
        days: p.days_until_expiry,
        iconType: p.policy_type,
        policyId: p.id,
      });
      if (p.policy_type === "motor") {
        if (p.mot_expiry) {
          const d = Math.round(
            (new Date(p.mot_expiry).getTime() - now.getTime()) / 86400000,
          );
          list.push({
            id: `${p.id}-mot`,
            label: "MOT",
            sublabel: p.vehicle_make ?? "Vehicle",
            date: p.mot_expiry,
            days: d,
            iconType: "motor",
            policyId: p.id,
          });
        }
        if (p.tax_due_date) {
          const d = Math.round(
            (new Date(p.tax_due_date).getTime() - now.getTime()) / 86400000,
          );
          list.push({
            id: `${p.id}-tax`,
            label: "Road Tax",
            sublabel: p.vehicle_make ?? "Vehicle",
            date: p.tax_due_date,
            days: d,
            iconType: "motor",
            policyId: p.id,
          });
        }
      }
    });
    return list.sort((a, b) => a.days - b.days);
  }, []);

  // Layout constants — line at vertical centre, 40-px dots
  const TL_H = 300;
  const TL_LINE_Y = 150;
  const TL_DOT_R = 20;
  const TL_CARD_W = 120;
  const TL_CARD_H = 82;
  const TL_LEFT_PAD = 56;
  const TL_RIGHT_PAD = 72;
  const TL_MIN_SPACING = 160;
  const TL_PX_PER_DAY = 2;

  const tlPositions = useMemo(
    () =>
      tlEvents.reduce<number[]>((acc, event, i) => {
        const raw = TL_LEFT_PAD + event.days * TL_PX_PER_DAY;
        if (i === 0) return [Math.max(TL_LEFT_PAD + 130, raw)];
        return [...acc, Math.max(acc[i - 1] + TL_MIN_SPACING, raw)];
      }, []),
    [tlEvents],
  );

  const tlTotalWidth =
    tlPositions.length > 0
      ? tlPositions[tlPositions.length - 1] + TL_RIGHT_PAD
      : 400;

  useEffect(() => {
    if (!tlScrollRef.current || tlPositions.length === 0) return;
    const idx = Math.max(
      0,
      tlEvents.findIndex((e) => e.days >= 0),
    );
    tlScrollRef.current.scrollLeft = Math.max(0, tlPositions[idx] - 100);
  }, []);

  const scrollTL = (dir: number) =>
    tlScrollRef.current?.scrollBy({ left: dir * 152, behavior: "smooth" });

  const tlIconMap: Record<string, React.ReactNode> = {
    motor: <Car className="w-5 h-5 text-[#7C79C8]" />,
    health: <Heart className="w-5 h-5 text-[#c06080]" />,
    life: <Shield className="w-5 h-5 text-[#509070]" />,
    home: <Home className="w-5 h-5 text-[#507090]" />,
    travel: <Plane className="w-5 h-5 text-[#907040]" />,
  };
  // ──────────────────────────────────────────────────────

  return (
    <div className="min-h-full pb-24 bg-[#F5F4FB]">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#1e1c38] via-[#313057] to-[#4a4878] px-4 pt-12 pb-20 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

        <div className="max-w-lg mx-auto">
          {/* Top bar: avatar + greeting left, bell right */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D3D3F6] to-[#7C79C8] flex items-center justify-center border-2 border-white/20 shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {currentUser.avatar}
                </span>
              </div>
              <div>
                <div className="text-white/55 text-xs font-medium">
                  Good morning,
                </div>
                <div className="text-white text-lg font-bold tracking-tight leading-tight">
                  {currentUser.firstName} 👋
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/notifications")}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/15"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>      {/* Timeline */}
      <div className="max-w-lg mx-auto px-4 -mt-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-5"
        >
          <Card className="shadow-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <div>
                <h2 className="font-bold text-[#313057] text-base">Upcoming Renewals</h2>
                <p className="text-[12px] text-[#7878A8] mt-0.5">Scroll to see all events</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-[10px] text-[#7878A8]">Soon</span>
                </div>
                <button onClick={() => scrollTL(-1)} className="w-7 h-7 rounded-full border border-[#C8C7E8] bg-white flex items-center justify-center text-[#7C79C8] hover:bg-[#F5F4FB] active:scale-95 transition-all shadow-sm"><ChevronRight className="w-3.5 h-3.5 rotate-180" /></button>
                <button onClick={() => scrollTL(1)} className="w-7 h-7 rounded-full border border-[#C8C7E8] bg-white flex items-center justify-center text-[#7C79C8] hover:bg-[#F5F4FB] active:scale-95 transition-all shadow-sm"><ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div ref={tlScrollRef} className="overflow-x-auto scrollbar-hide" style={{ height: TL_H }}>
              <div className="relative select-none bg-[#ECEAFB]" style={{ width: tlTotalWidth, height: TL_H }}>
                {/* Baseline */}
                <div className="absolute" style={{ left: 0, right: 0, top: TL_LINE_Y, height: 2, background: "linear-gradient(to right, transparent, #C8C7E8 6%, #C8C7E8 94%, transparent)" }} />
                {/* Today marker */}
                <div className="absolute -translate-x-1/2" style={{ left: TL_LEFT_PAD, top: TL_LINE_Y - 9, width: 18, height: 18 }}>
                  <div className="w-full h-full rounded-full bg-[#7C79C8] shadow" />
                </div>
                <div className="absolute -translate-x-1/2" style={{ left: TL_LEFT_PAD, top: TL_LINE_Y - 30 }}>
                  <span className="bg-[#7C79C8] text-white text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-full shadow">TODAY</span>
                </div>
                {/* Gap labels on line */}
                {tlEvents.map((event, i) => {
                  const prevX = i === 0 ? TL_LEFT_PAD : (tlPositions[i - 1] ?? TL_LEFT_PAD);
                  const x = tlPositions[i] ?? TL_LEFT_PAD;
                  const midX = (prevX + x) / 2;
                  const gap = i === 0 ? event.days : event.days - tlEvents[i - 1].days;
                  const gapLabel = gap <= 0 ? null : gap > 90 ? Math.round(gap / 30) + " mo" : gap + "d";
                  return gapLabel ? (
                    <div key={"gap-" + event.id} className="absolute -translate-x-1/2 -translate-y-1/2 bg-[#ECEAFB] px-1.5 text-[10.5px] font-bold text-[#7C79C8] whitespace-nowrap" style={{ left: midX, top: TL_LINE_Y }}>
                      {gapLabel}
                    </div>
                  ) : null;
                })}
                {/* Events */}
                {tlEvents.map((event, i) => {
                  const x = tlPositions[i] ?? TL_LEFT_PAD;
                  const isAbove = i % 2 === 0;
                  const dotTop = TL_LINE_Y - TL_DOT_R;
                  const LABEL_H = 72;
                  const STEM_LEN = 22;
                  const labelTop = isAbove ? dotTop - STEM_LEN - LABEL_H : TL_LINE_Y + TL_DOT_R + STEM_LEN;
                  const stemTop = isAbove ? labelTop + LABEL_H : TL_LINE_Y + TL_DOT_R;
                  const urgentColor = event.days < 0 ? "text-rose-500" : event.days <= 30 ? "text-amber-500" : "text-[#7C79C8]";
                  const dotBorder = event.days < 0 ? "border-rose-400" : event.days <= 30 ? "border-amber-400" : "border-[#7C79C8]";
                  const daysLabel = event.days < 0 ? Math.abs(event.days) + "d ago" : event.days === 0 ? "Today" : event.days > 90 ? Math.round(event.days / 30) + " mo" : event.days + " days";
                  return (
                    <React.Fragment key={event.id}>
                      <div className="absolute bg-[#C8C7E8]" style={{ left: x - 0.75, top: stemTop, width: 1.5, height: STEM_LEN }} />
                      <div
                        className={"absolute flex items-center justify-center rounded-full bg-white border-2 shadow-sm cursor-pointer hover:scale-110 active:scale-95 transition-transform z-10 " + dotBorder}
                        style={{ left: x - TL_DOT_R, top: dotTop, width: TL_DOT_R * 2, height: TL_DOT_R * 2 }}
                        onClick={() => navigate("/policies/" + event.policyId + "?from=/")}
                      >
                        {tlIconMap[event.iconType]}
                      </div>
                      <div
                        className="absolute text-center cursor-pointer"
                        style={{ left: x - 56, top: labelTop, width: 112 }}
                        onClick={() => navigate("/policies/" + event.policyId + "?from=/")}
                      >
                        <div className="text-[13px] font-bold text-[#313057] leading-tight">{event.label}</div>
                        <div className="text-[12px] font-semibold text-[#313057] leading-tight mt-0.5">{event.sublabel}</div>
                        <div className="text-[11px] text-[#7878A8] leading-tight mt-1">{formatDate(event.date)}</div>
                        <div className={"text-[11px] font-bold leading-tight mt-0.5 " + urgentColor}>{daysLabel}</div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Policy Types */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="mb-5"
        >
          <Card className="p-4 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#313057] text-base">Policy Types</h2>
              <button onClick={() => navigate("/policies")} className="text-[#7C79C8] text-sm font-semibold flex items-center gap-0.5">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pt-2 pb-1 -mx-1 px-1">
              {typeCounts.map(({ type, count }, i) => {
                const iconMap: Record<string, React.ReactNode> = {
                  motor: <Car className="w-7 h-7 text-[#7C79C8]" />,
                  health: <Heart className="w-7 h-7 text-[#c06080]" />,
                  life: <Shield className="w-7 h-7 text-[#509070]" />,
                  home: <Home className="w-7 h-7 text-[#507090]" />,
                  travel: <Plane className="w-7 h-7 text-[#907040]" />,
                };
                return (
                  <motion.button
                    key={type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => navigate("/policies?type=" + type)}
                    className="flex-shrink-0 flex flex-col items-center gap-2 active:scale-95 transition-transform"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-[#E8E7F7] flex items-center justify-center">
                        {iconMap[type]}
                      </div>
                      {count > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#7C79C8] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                          {count}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#313057]">{getTypeLabel(type)}</span>
                  </motion.button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <div classassName="space-y-5">
          {/* Expiring Soon */}
          {expiringPolicies.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-500" />
                <h2 className="font-bold text-[#313057] text-base">
                  Expiring Soon
                </h2>
              </div>
              <Card className="divide-y divide-[#EAE8F8]">
                {expiringPolicies.map((policy, i) => (
                  <motion.div
                    key={policy.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    onClick={() => navigate(`/policies/${policy.id}?from=/`)}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#F5F4FB] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${getTypeGradient(policy.policy_type)} flex items-center justify-center`}
                      >
                        {(() => {
                          const expiryIconMap: Record<string, React.ReactNode> =
                            {
                              motor: <Car className="w-5 h-5 text-white" />,
                              health: <Heart className="w-5 h-5 text-white" />,
                              life: <Shield className="w-5 h-5 text-white" />,
                              home: <Home className="w-5 h-5 text-white" />,
                              travel: <Plane className="w-5 h-5 text-white" />,
                            };
                          return (
                            expiryIconMap[policy.policy_type] ?? (
                              <Shield className="w-5 h-5 text-white" />
                            )
                          );
                        })()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#313057]">
                          {policy.provider}
                        </div>
                        <div className="text-xs text-[#7878A8]">
                          Expires {formatDate(policy.end_date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full border ${getExpiryBadgeColor(policy.days_until_expiry)}`}
                      >
                        {getExpiryLabel(policy.days_until_expiry)}
                      </span>
                      <div className="mt-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/renew?policyId=${policy.id}`);
                          }}
                          className="text-[10px] px-2 py-1"
                        >
                          Renew
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
