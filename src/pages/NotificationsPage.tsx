import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Clock,
  CreditCard,
  RefreshCw,
  FileText,
  ShieldAlert,
  Tag,
  Settings,
  Check,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { mockNotifications } from "@/data/mockData";
import type { AppNotification, NotificationType } from "@/types/policy";

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ReactNode; bg: string; color: string; label: string }
> = {
  expiry: {
    icon: <Clock className="w-5 h-5" />,
    bg: "bg-amber-50",
    color: "text-amber-500",
    label: "Expiry",
  },
  payment: {
    icon: <CreditCard className="w-5 h-5" />,
    bg: "bg-emerald-50",
    color: "text-emerald-500",
    label: "Payment",
  },
  renewal: {
    icon: <RefreshCw className="w-5 h-5" />,
    bg: "bg-[#E8E7F7]",
    color: "text-[#7C79C8]",
    label: "Renewal",
  },
  document: {
    icon: <FileText className="w-5 h-5" />,
    bg: "bg-sky-50",
    color: "text-sky-500",
    label: "Document",
  },
  claim: {
    icon: <ShieldAlert className="w-5 h-5" />,
    bg: "bg-violet-50",
    color: "text-violet-500",
    label: "Claim",
  },
  promo: {
    icon: <Tag className="w-5 h-5" />,
    bg: "bg-pink-50",
    color: "text-pink-500",
    label: "Offer",
  },
  system: {
    icon: <Settings className="w-5 h-5" />,
    bg: "bg-slate-100",
    color: "text-slate-500",
    label: "System",
  },
};

const FILTERS: { label: string; value: NotificationType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Expiry", value: "expiry" },
  { label: "Renewal", value: "renewal" },
  { label: "Payment", value: "payment" },
  { label: "Claims", value: "claim" },
  { label: "Offers", value: "promo" },
];

export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] =
    useState<AppNotification[]>(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationType | "all">(
    "all",
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered =
    activeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const dismiss = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const handleAction = (notif: AppNotification) => {
    markRead(notif.id);
    if (notif.action_route) navigate(notif.action_route);
  };

  return (
    <div className="min-h-full pb-24 bg-[#F5F4FB]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e1c38] via-[#313057] to-[#4a4878] px-4 pt-10 pb-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/15 active:scale-90 transition-transform"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-white text-xl font-bold tracking-tight">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-white/55 text-xs mt-0.5">
                    {unreadCount} unread
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white text-xs font-semibold active:scale-95 transition-transform"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="bg-white border-b border-[#C8C7E8] sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeFilter === f.value
                    ? "bg-[#7C79C8] text-white border-[#7C79C8]"
                    : "bg-white text-[#7878A8] border-[#C8C7E8]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#E8E7F7] flex items-center justify-center">
              <Bell className="w-8 h-8 text-[#D3D3F6]" />
            </div>
            <div className="text-center">
              <div className="font-bold text-[#313057] text-base">
                All clear!
              </div>
              <div className="text-sm text-[#7878A8] mt-1">
                No notifications in this category.
              </div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            <div className="space-y-2">
              {filtered.map((notif, i) => {
                const cfg = TYPE_CONFIG[notif.type];
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 60, height: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`relative bg-white rounded-2xl border shadow-sm overflow-hidden ${
                      notif.read
                        ? "border-[#E3E2F5]"
                        : "border-[#C8C7E8] shadow-[#D3D3F6]/10"
                    }`}
                  >
                    {/* Unread accent bar */}
                    {!notif.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7C79C8] rounded-l-2xl" />
                    )}

                    <div className="flex gap-3 p-4 pl-5">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center`}
                      >
                        {cfg.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                              >
                                {cfg.label}
                              </span>
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-[#7C79C8] flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm font-bold text-[#313057] leading-snug">
                              {notif.title}
                            </p>
                            <p className="text-xs text-[#7878A8] mt-1 leading-relaxed">
                              {notif.body}
                            </p>
                          </div>

                          {/* Dismiss */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismiss(notif.id);
                            }}
                            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[#B2B0D4] hover:bg-red-50 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Footer: time + action */}
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="text-[11px] text-[#9390BC] font-medium">
                            {timeAgo(notif.timestamp)}
                          </span>
                          {notif.action_label && (
                            <button
                              onClick={() => handleAction(notif)}
                              className="flex items-center gap-1 text-[#7C79C8] text-xs font-bold"
                            >
                              {notif.action_label}
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
