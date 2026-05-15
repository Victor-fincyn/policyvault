import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Edit3,
  Bell,
  Mail,
  Lock,
  HelpCircle,
  Star,
  FileText,
  Cookie,
  Megaphone,
  Info,
  LogOut,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  User,
} from "lucide-react";
import { currentUser, mockPolicies } from "@/data/mockData";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

const activePolicies = mockPolicies.filter(
  (p) => p.status === "active" || p.status === "expiring_soon",
);
const totalPremium = activePolicies.reduce(
  (sum, p) => sum + p.premium_amount,
  0,
);

interface InfoField {
  key: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  type?: string;
}

function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? "bg-[#7C79C8]" : "bg-[#C8C7E8]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [userInfo, setUserInfo] = useState<Record<string, string>>({
    fullName: currentUser.name,
    dob: "12 Jan 1990",
    phone: "+44 7700 900123",
    address: "14 Maple Street, London, E1 6RF",
    licence: "HARRI901126JH9AB",
  });
  const [draft, setDraft] = useState<Record<string, string>>(userInfo);

  function startEdit() {
    setDraft({ ...userInfo });
    setIsEditing(true);
  }

  function saveEdit() {
    setUserInfo({ ...draft });
    setIsEditing(false);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  const menuSections = [
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          sub: "Alerts on your device",
          toggle: {
            enabled: pushNotif,
            onChange: () => setPushNotif((v) => !v),
          },
        },
        {
          icon: Mail,
          label: "Email Notifications",
          sub: "Updates to your inbox",
          toggle: {
            enabled: emailNotif,
            onChange: () => setEmailNotif((v) => !v),
          },
        },
      ],
    },
    {
      title: "Security & Support",
      items: [
        {
          icon: Lock,
          label: "Privacy & Security",
          sub: "Password & data settings",
        },
        {
          icon: HelpCircle,
          label: "Help & Support",
          sub: "FAQs and contact us",
        },
        { icon: Star, label: "Rate Us", sub: "Share your feedback" },
      ],
    },
    {
      title: "Legal",
      items: [
        {
          icon: FileText,
          label: "Terms & Conditions",
          sub: "Our terms of service",
        },
        {
          icon: Cookie,
          label: "Privacy & Cookie Policy",
          sub: "How we use your data",
        },
        {
          icon: Megaphone,
          label: "Marketing Preferences",
          sub: "Manage communications",
        },
        { icon: Info, label: "About", sub: "PolicyVault v1.0" },
      ],
    },
  ];

  return (
    <div className="min-h-full pb-28 bg-[#F5F4FB]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1e1c38] via-[#313057] to-[#4a4878] px-4 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="max-w-lg mx-auto flex flex-col items-center text-center">
          <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#D3D3F6] to-[#7C79C8] flex items-center justify-center text-white text-xl font-bold shadow-xl border-4 border-white/20">
            {currentUser.avatar}
          </div>
          <div className="mt-2.5 text-white text-lg font-bold tracking-tight">
            {currentUser.name}
          </div>
          <div className="text-white/55 text-sm mt-0.5">
            {currentUser.email}
          </div>
          <div className="mt-2 px-3 py-0.5 bg-white/15 border border-white/20 rounded-full">
            <span className="text-white/90 text-xs font-semibold">
              Premium Member
            </span>
          </div>
          {/* Stats */}
          <div className="flex gap-8 mt-4">
            <div>
              <div className="text-white text-xl font-bold">
                {activePolicies.length}
              </div>
              <div className="text-white/50 text-xs mt-0.5">
                Active Policies
              </div>
            </div>
            <div className="w-px bg-white/15" />
            <div>
              <div className="text-white text-xl font-bold">
                {formatCurrency(totalPremium)}
              </div>
              <div className="text-white/50 text-xs mt-0.5">Annual Premium</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-sm font-bold text-[#313057] uppercase tracking-wider">
              Personal Information
            </h2>
            {!isEditing ? (
              <button
                onClick={startEdit}
                className="flex items-center gap-1 text-xs font-semibold text-[#7C79C8] px-3 py-1 rounded-full bg-[#ECEAFB] border border-[#C8C7E8] hover:bg-[#E3E2F5] transition-colors"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelEdit}
                  className="text-xs font-semibold text-[#7878A8] px-3 py-1 rounded-full bg-[#ECEAFB] border border-[#C8C7E8] hover:bg-[#E3E2F5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="text-xs font-semibold text-white px-3 py-1 rounded-full bg-[#7C79C8] hover:bg-[#6360AF] transition-colors"
                >
                  Save
                </button>
              </div>
            )}
          </div>
          <Card className="overflow-hidden divide-y divide-[#E8E7F7]">
            {(
              [
                {
                  key: "fullName",
                  label: "Full Name",
                  icon: <User className="w-4 h-4 text-[#7C79C8]" />,
                  type: "text",
                },
                {
                  key: "dob",
                  label: "Date of Birth",
                  icon: <Calendar className="w-4 h-4 text-[#7C79C8]" />,
                  type: "text",
                },
                {
                  key: "phone",
                  label: "Phone Number",
                  icon: <Phone className="w-4 h-4 text-[#7C79C8]" />,
                  type: "tel",
                },
                {
                  key: "address",
                  label: "Address",
                  icon: <MapPin className="w-4 h-4 text-[#7C79C8]" />,
                  type: "text",
                },
                {
                  key: "licence",
                  label: "Driving Licence",
                  icon: <CreditCard className="w-4 h-4 text-[#7C79C8]" />,
                  type: "text",
                },
              ] as InfoField[]
            ).map((field) => (
              <div
                key={field.key}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#ECEAFB] flex items-center justify-center flex-shrink-0">
                  {field.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-[#9390BC] font-medium">
                    {field.label}
                  </div>
                  {isEditing ? (
                    <input
                      value={draft[field.key]}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      type={field.type ?? "text"}
                      className="w-full text-sm text-[#313057] font-medium bg-[#ECEAFB] border border-[#D3D3F6] rounded-lg px-2.5 py-1 mt-0.5 outline-none focus:ring-2 focus:ring-[#D3D3F6]/40"
                    />
                  ) : (
                    <div className="text-sm text-[#313057] font-semibold truncate">
                      {userInfo[field.key]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </motion.div>

        {/* Menu Sections */}
        {menuSections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + si * 0.06 }}
          >
            <div className="mb-2 px-1">
              <h2 className="text-sm font-bold text-[#313057] uppercase tracking-wider">
                {section.title}
              </h2>
            </div>
            <Card className="overflow-hidden divide-y divide-[#E8E7F7]">
              {section.items.map(
                ({ icon: Icon, label, sub, toggle }: any, i: number) => {
                  const Tag = toggle ? "div" : "button";
                  return (
                    <Tag
                      key={i}
                      {...(!toggle && { onClick: () => {} })}
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#F5F4FB] active:bg-[#EAE8F8] transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#ECEAFB] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4.5 h-4.5 text-[#7C79C8]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-[#313057]">
                          {label}
                        </div>
                        <div className="text-xs text-[#9390BC]">{sub}</div>
                      </div>
                      {toggle ? (
                        <ToggleSwitch
                          enabled={toggle.enabled}
                          onChange={toggle.onChange}
                        />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#B2B0D4]" />
                      )}
                    </Tag>
                  );
                },
              )}
            </Card>
          </motion.div>
        ))}

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          <button
            onClick={() => {}}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-500 font-semibold text-sm hover:bg-red-100 active:bg-red-50 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            Log Out
          </button>
        </motion.div>

        <div className="text-center text-xs text-[#9390BC] pb-2">
          PolicyVault v1.0 · Made with ? in the UK
        </div>
      </div>
    </div>
  );
}
