import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  Activity,
  Download,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { User } from "@/types";

interface DashboardProps {
  user: User;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

const monthlyData = [
  { month: "1월", reports: 45, users: 120 },
  { month: "2월", reports: 52, users: 145 },
  { month: "3월", reports: 61, users: 168 },
  { month: "4월", reports: 58, users: 182 },
  { month: "5월", reports: 72, users: 201 },
  { month: "6월", reports: 88, users: 234 },
];

const customerTypeData = [
  { name: "중소기업", value: 142, color: "#5B3BFA" },
  { name: "대기업", value: 68, color: "#00B4FF" },
  { name: "공공기관", value: 24, color: "#A58DFF" },
];

export function Dashboard({ user, onNavigate, onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentScreen="dashboard" onNavigate={onNavigate} userRole={user.role} />
        <main className="flex-1 p-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-[#0F172A] mb-2">운영 대시보드</h1>
              <p className="text-[#8C8C8C]">AIFIX ESG 플랫폼 관리자 포털</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="rounded-[20px] border-none shadow-md hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-[#8C8C8C]">총 고객사</CardTitle>
                  <Building2 className="w-5 h-5 text-[#5B3BFA]" />
                </CardHeader>
                <CardContent>
                  <div className="text-[#0F172A] mb-1">234</div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12%
                    </Badge>
                    <span className="text-xs text-[#8C8C8C]">vs 지난달</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-[#8C8C8C]">활성 사용자</CardTitle>
                  <Users className="w-5 h-5 text-[#00B4FF]" />
                </CardHeader>
                <CardContent>
                  <div className="text-[#0F172A] mb-1">1,842</div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8%
                    </Badge>
                    <span className="text-xs text-[#8C8C8C]">이번 주</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-[#8C8C8C]">생성된 리포트</CardTitle>
                  <FileText className="w-5 h-5 text-[#A58DFF]" />
                </CardHeader>
                <CardContent>
                  <div className="text-[#0F172A] mb-1">88</div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">이번 달</Badge>
                    <span className="text-xs text-[#8C8C8C]">총 376건</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm text-[#8C8C8C]">시스템 상태</CardTitle>
                  <Activity className="w-5 h-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-[#0F172A] mb-1">정상</div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      99.8%
                    </Badge>
                    <span className="text-xs text-[#8C8C8C]">가동률</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Trends */}
              <Card className="rounded-[20px] border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-[#0F172A]">월별 리포트 생성 추이</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#8C8C8C" />
                      <YAxis stroke="#8C8C8C" />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="reports"
                        stroke="#5B3BFA"
                        strokeWidth={3}
                        name="리포트"
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#00B4FF"
                        strokeWidth={3}
                        name="사용자"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Customer Distribution */}
              <Card className="rounded-[20px] border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-[#0F172A]">고객사 유형 분포</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={customerTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {customerTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="rounded-[20px] border-none shadow-md lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-[#0F172A]">최근 활동</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Download,
                        color: "#5B3BFA",
                        text: "삼성전자(주) - ESG 보고서 다운로드",
                        time: "5분 전",
                      },
                      {
                        icon: FileText,
                        color: "#00B4FF",
                        text: "LG화학 - 신규 평가 완료",
                        time: "1시간 전",
                      },
                      {
                        icon: Users,
                        color: "#A58DFF",
                        text: "현대자동차 - 신규 사용자 3명 추가",
                        time: "2시간 전",
                      },
                      {
                        icon: AlertCircle,
                        color: "#00B4FF",
                        text: "SK하이닉스 - 결제 완료",
                        time: "3시간 전",
                      },
                    ].map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F6F8FB] transition-colors"
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${activity.color}20` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: activity.color }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[#0F172A]">{activity.text}</p>
                            <p className="text-xs text-[#8C8C8C]">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="rounded-[20px] border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-[#0F172A]">시스템 상태</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "API 서버", status: 99, color: "#5B3BFA" },
                      { name: "데이터베이스", status: 98, color: "#00B4FF" },
                      { name: "AI 모델", status: 100, color: "#A58DFF" },
                      { name: "스토리지", status: 95, color: "#5B3BFA" },
                    ].map((system, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#0F172A]">{system.name}</span>
                          <span className="text-sm" style={{ color: system.color }}>
                            {system.status}%
                          </span>
                        </div>
                        <Progress value={system.status} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
