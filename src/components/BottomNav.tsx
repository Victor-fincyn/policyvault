import { NavLink } from "react-router-dom";
import { Home, Shield, PlusCircle, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/policies", icon: Shield, label: "Policies" },
  { to: "/upload", icon: PlusCircle, label: "Upload", isPrimary: true },
  { to: "/claim", icon: FileText, label: "Claims" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#C8C7E8]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map(({ to, icon: Icon, label, isPrimary }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200",
                isPrimary && "relative -mt-5",
                isActive && !isPrimary && "text-[#7C79C8]",
                !isActive && !isPrimary && "text-[#9390BC]",
              )
            }
          >
            {({ isActive }) =>
              isPrimary ? (
                <div className="w-12 h-12 rounded-full bg-[#7C79C8] flex items-center justify-center shadow-lg shadow-[#7C79C8]/25 active:scale-95 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              ) : (
                <>
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-all",
                      isActive ? "text-[#7C79C8]" : "text-[#9390BC]",
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      isActive ? "text-[#7C79C8]" : "text-[#9390BC]",
                    )}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#D3D3F6]" />
                  )}
                </>
              )
            }
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
