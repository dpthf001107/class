'use client';

import { LayoutDashboard, Building2, FileText, Bell, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (screen: any) => void;
  onLogout?: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '대시보드', screen: 'dashboard' },
    { id: 'sme-list', icon: Building2, label: '관계사 목록', screen: 'sme-list' },
    { id: 'report-center', icon: FileText, label: '보고서 센터', screen: 'report-center' },
    { id: 'notifications', icon: Bell, label: '알림', screen: 'notifications' },
    { id: 'profile', icon: User, label: '계정 설정', screen: 'profile' },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleNavigate = (screen: string) => {
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  const getIsActive = (screenId: string) => {
    if (currentPage) {
      return currentPage === screenId;
    }
    return false;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <button 
          onClick={() => handleNavigate('dashboard')}
          className="flex items-center gap-3 w-full text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF]" />
          <div>
            <h3 className="text-[#0F172A]">AIFIX</h3>
            <p className="text-[#8C8C8C]">Enterprise</p>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = getIsActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.screen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white shadow-[0_4px_20px_rgba(91,59,250,0.3)]'
                  : 'text-[#8C8C8C] hover:bg-[#F6F8FB] hover:text-[#0F172A]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 bg-[#F6F8FB] rounded-xl mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center text-white">
            EA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#0F172A] truncate">Enterprise Admin</p>
            <p className="text-[#8C8C8C] text-xs truncate">admin@company.com</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start rounded-xl text-[#8C8C8C] hover:text-[#0F172A] hover:bg-[#F6F8FB]"
        >
          <LogOut className="w-4 h-4 mr-3" />
          로그아웃
        </Button>
      </div>
    </aside>
  );
}