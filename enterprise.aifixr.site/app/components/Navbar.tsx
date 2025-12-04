import { Building2, LayoutDashboard, LogOut, Menu, FileText } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  currentPage: string;
  onNavigate: (screen: 'dashboard' | 'sme-list') => void;
  onLogout: () => void;
}

export function Navbar({ currentPage, onNavigate, onLogout }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF]" />
            <div>
              <h3 className="text-[#0F172A]">AIFIX Enterprise</h3>
              <p className="text-[#8C8C8C]">ESG 포털</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onNavigate('dashboard')}
              className={currentPage === 'dashboard' 
                ? 'bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] rounded-xl' 
                : 'rounded-xl'}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              대시보드
            </Button>
            <Button
              variant={currentPage === 'sme-list' ? 'default' : 'ghost'}
              onClick={() => onNavigate('sme-list')}
              className={currentPage === 'sme-list' 
                ? 'bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] rounded-xl' 
                : 'rounded-xl'}
            >
              <Building2 className="w-4 h-4 mr-2" />
              관계사 목록
            </Button>
          </div>

          {/* User & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-[#0F172A]">Enterprise Admin</p>
              <p className="text-[#8C8C8C]">admin@company.com</p>
            </div>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="rounded-xl text-[#8C8C8C] hover:text-[#0F172A]"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
