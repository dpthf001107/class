import { Bell, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface NotificationCenterProps {
  onNavigate: (screen: any) => void;
  onLogout: () => void;
}

const announcements = [
  {
    id: 'a1',
    type: 'info',
    title: '시스템 업데이트 안내',
    message: 'AIFIX Enterprise Portal 2.0 버전이 출시되었습니다. 새로운 기능과 개선사항을 확인해보세요.',
    date: '2024.12.01',
  },
  {
    id: 'a2',
    type: 'warning',
    title: '정기 점검 예정',
    message: '2024년 12월 5일 오전 2시부터 4시까지 시스템 정기 점검이 진행됩니다.',
    date: '2024.11.28',
  },
];

const notifications = [
  {
    id: 'n1',
    type: 'update',
    company: '테크솔루션 주식회사',
    message: 'ESG 평가 보고서가 업데이트되었습니다.',
    time: '2시간 전',
    read: false,
  },
  {
    id: 'n2',
    type: 'completed',
    company: '그린에너지 코퍼레이션',
    message: 'ESG 데이터 제출이 완료되었습니다.',
    time: '5시간 전',
    read: false,
  },
  {
    id: 'n3',
    type: 'alert',
    company: '스마트제조 산업',
    message: '고위험 지표가 발견되었습니다. 검토가 필요합니다.',
    time: '1일 전',
    read: false,
  },
  {
    id: 'n4',
    type: 'update',
    company: '친환경 패키징',
    message: 'ESG 등급이 B에서 A로 상승했습니다.',
    time: '2일 전',
    read: true,
  },
  {
    id: 'n5',
    type: 'completed',
    company: '디지털 솔루션즈',
    message: 'ESG 데이터 제출이 완료되었습니다.',
    time: '3일 전',
    read: true,
  },
  {
    id: 'n6',
    type: 'update',
    company: '바이오텍 연구소',
    message: 'ESG 평가 보고서가 업데이트되었습니다.',
    time: '4일 전',
    read: true,
  },
];

export function NotificationCenter({ onNavigate, onLogout }: NotificationCenterProps) {
  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">
      <Sidebar currentPage="notifications" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 ml-64">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[#0F172A] mb-2">알림 및 공지사항</h1>
            <p className="text-[#8C8C8C]">시스템 공지사항과 관계사 업데이트 알림을 확인하세요</p>
          </div>

          {/* System Announcements */}
          <div className="mb-8">
            <h2 className="text-[#0F172A] mb-4">시스템 공지사항</h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card
                  key={announcement.id}
                  className={`p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] border-l-4 ${
                    announcement.type === 'info' ? 'border-[#00B4FF]' : 'border-[#A58DFF]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      announcement.type === 'info' ? 'bg-[#00B4FF]/10' : 'bg-[#A58DFF]/10'
                    }`}>
                      {announcement.type === 'info' ? (
                        <Info className={`w-5 h-5 ${announcement.type === 'info' ? 'text-[#00B4FF]' : 'text-[#A58DFF]'}`} />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-[#A58DFF]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-[#0F172A]">{announcement.title}</h3>
                        <span className="text-[#8C8C8C] text-sm">{announcement.date}</span>
                      </div>
                      <p className="text-[#8C8C8C]">{announcement.message}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Affiliate Update Notifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#0F172A]">관계사 업데이트</h2>
              <Button variant="ghost" className="text-[#5B3BFA] rounded-xl">
                모두 읽음 처리
              </Button>
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] transition-all cursor-pointer hover:shadow-[0_6px_30px_rgba(91,59,250,0.15)] ${
                    !notification.read ? 'bg-white' : 'bg-[#F6F8FB]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      notification.type === 'completed' ? 'bg-[#00B4FF]/10' :
                      notification.type === 'alert' ? 'bg-[#E30074]/10' :
                      'bg-[#5B3BFA]/10'
                    }`}>
                      {notification.type === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-[#00B4FF]" />
                      ) : notification.type === 'alert' ? (
                        <AlertCircle className="w-5 h-5 text-[#E30074]" />
                      ) : (
                        <Bell className="w-5 h-5 text-[#5B3BFA]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <p className="text-[#0F172A]">{notification.company}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[#8C8C8C] text-sm">{notification.time}</span>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-[#5B3BFA]" />
                          )}
                        </div>
                      </div>
                      <p className="text-[#8C8C8C]">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          notification.type === 'completed' ? 'bg-[#00B4FF]/10 text-[#00B4FF]' :
                          notification.type === 'alert' ? 'bg-[#E30074]/10 text-[#E30074]' :
                          'bg-[#5B3BFA]/10 text-[#5B3BFA]'
                        }`}>
                          {notification.type === 'completed' ? '완료' :
                           notification.type === 'alert' ? '경고' : '업데이트'}
                        </span>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#5B3BFA] hover:text-[#5B3BFA] h-7 px-3 rounded-lg"
                          >
                            읽음 처리
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}