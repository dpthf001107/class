import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart3,
  FileText,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "./ui/utils";
import type { UserRole } from "@/types";

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  userRole: UserRole;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: LayoutDashboard,
    roles: ["Super Admin", "Admin"],
  },
  {
    id: "corporate",
    label: "고객사 관리",
    icon: Building2,
    roles: ["Super Admin", "Admin"],
  },
  {
    id: "users",
    label: "사용자 & 권한",
    icon: Users,
    roles: ["Super Admin", "Admin"],
  },
  {
    id: "billing",
    label: "요금제 & 결제",
    icon: CreditCard,
    roles: ["Super Admin", "Admin"],
  },
  {
    id: "metrics",
    label: "지표 & 모델",
    icon: BarChart3,
    roles: ["Super Admin", "Admin"],
  },
  {
    id: "audit",
    label: "감사 로그",
    icon: FileText,
    roles: ["Super Admin", "Admin"],
  },
  {
    id: "system",
    label: "시스템 & 공지",
    icon: Settings,
    roles: ["Super Admin", "Admin"],
  },
];

export function Sidebar({ currentScreen, onNavigate, userRole }: SidebarProps) {
  const accessibleItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200/50 min-h-[calc(100vh-73px)] p-4">
      <div className="space-y-1">
        {accessibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white shadow-lg"
                  : "text-[#0F172A] hover:bg-[#F6F8FB]"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gradient-to-br from-[#E9F5FF] to-[#F6F8FB] rounded-xl">
        <p className="text-xs text-[#8C8C8C] mb-2">현재 역할</p>
        <div className="inline-flex items-center px-3 py-1 bg-white rounded-lg shadow-sm">
          <span className="text-sm text-[#5B3BFA]">{userRole}</span>
        </div>
      </div>
    </div>
  );
}
