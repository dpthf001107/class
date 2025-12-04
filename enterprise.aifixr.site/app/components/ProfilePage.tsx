import { User, Mail, Building2, Shield, Bell, Lock } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { ReadOnlyTooltip } from './ReadOnlyTooltip';

interface ProfilePageProps {
  onNavigate: (screen: any) => void;
  onLogout: () => void;
}

export function ProfilePage({ onNavigate, onLogout }: ProfilePageProps) {
  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">
      <Sidebar currentPage="profile" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 ml-64">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[#0F172A] mb-2">계정 설정</h1>
            <p className="text-[#8C8C8C]">계정 정보 및 설정을 관리하세요</p>
          </div>

          {/* Profile Information */}
          <Card className="p-8 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] mb-6">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center text-white text-3xl flex-shrink-0">
                EA
              </div>
              <div className="flex-1">
                <h2 className="text-[#0F172A] mb-2">기업 관리자</h2>
                <p className="text-[#8C8C8C] mb-4">admin@company.com</p>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#00B4FF]" />
                  <span className="text-[#00B4FF]">관리자 권한</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#0F172A] mb-2">이름</label>
                  <ReadOnlyTooltip>
                    <Input
                      value="기업 관리자"
                      disabled
                      className="h-12 rounded-xl bg-gray-50 cursor-not-allowed"
                    />
                  </ReadOnlyTooltip>
                </div>
                <div>
                  <label className="block text-[#0F172A] mb-2">이메일</label>
                  <ReadOnlyTooltip>
                    <Input
                      value="admin@company.com"
                      disabled
                      className="h-12 rounded-xl bg-gray-50 cursor-not-allowed"
                    />
                  </ReadOnlyTooltip>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#0F172A] mb-2">회사명</label>
                  <ReadOnlyTooltip>
                    <Input
                      value="기업 코퍼레이션"
                      disabled
                      className="h-12 rounded-xl bg-gray-50 cursor-not-allowed"
                    />
                  </ReadOnlyTooltip>
                </div>
                <div>
                  <label className="block text-[#0F172A] mb-2">부서</label>
                  <ReadOnlyTooltip>
                    <Input
                      value="ESG 경영팀"
                      disabled
                      className="h-12 rounded-xl bg-gray-50 cursor-not-allowed"
                    />
                  </ReadOnlyTooltip>
                </div>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-8 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-[#5B3BFA]" />
              <h3 className="text-[#0F172A]">알림 설정</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F6F8FB] rounded-xl">
                <div>
                  <p className="text-[#0F172A] mb-1">이메일 알림</p>
                  <p className="text-[#8C8C8C] text-sm">관계사 활동에 대한 이메일 알림 받기</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F6F8FB] rounded-xl">
                <div>
                  <p className="text-[#0F172A] mb-1">고위험 경고</p>
                  <p className="text-[#8C8C8C] text-sm">고위험 지표 발견 시 알림 받기</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F6F8FB] rounded-xl">
                <div>
                  <p className="text-[#0F172A] mb-1">보고서 업데이트</p>
                  <p className="text-[#8C8C8C] text-sm">새로운 보고서 생성 시 알림 받기</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F6F8FB] rounded-xl">
                <div>
                  <p className="text-[#0F172A] mb-1">시스템 공지</p>
                  <p className="text-[#8C8C8C] text-sm">시스템 업데이트 및 점검 알림 받기</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-8 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-[#5B3BFA]" />
              <h3 className="text-[#0F172A]">보안 설정</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F6F8FB] rounded-xl">
                <div>
                  <p className="text-[#0F172A] mb-1">2단계 인증</p>
                  <p className="text-[#8C8C8C] text-sm">계정에 추가 보안 레이어 추가</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="p-4 bg-[#F6F8FB] rounded-xl">
                <p className="text-[#0F172A] mb-3">비밀번호</p>
                <Button
                  variant="outline"
                  className="rounded-xl"
                >
                  비밀번호 변경
                </Button>
              </div>
              <div className="p-4 bg-[#F6F8FB] rounded-xl">
                <p className="text-[#0F172A] mb-1">세션 관리</p>
                <p className="text-[#8C8C8C] text-sm mb-3">마지막 로그인: 2024.12.02 오전 9:30</p>
                <Button
                  variant="outline"
                  className="rounded-xl text-[#E30074] border-[#E30074] hover:bg-[#E30074]/10"
                >
                  모든 기기에서 로그아웃
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}