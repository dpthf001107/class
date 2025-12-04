import { Building2, TrendingUp, FileText, Award, AlertTriangle, ChevronRight } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

interface EnterpriseDashboardProps {
  onNavigate: (screen: any, companyId?: string) => void;
  onLogout: () => void;
}

const gradeDistribution = [
  { name: 'A등급', value: 12, color: '#00B4FF' },
  { name: 'B등급', value: 23, color: '#5B3BFA' },
  { name: 'C등급', value: 18, color: '#A58DFF' },
  { name: 'D등급', value: 7, color: '#8C8C8C' },
];

const trendData = [
  { month: '1월', environment: 72, social: 68, governance: 75 },
  { month: '2월', environment: 74, social: 70, governance: 76 },
  { month: '3월', environment: 76, social: 72, governance: 78 },
  { month: '4월', environment: 78, social: 74, governance: 80 },
  { month: '5월', environment: 80, social: 76, governance: 82 },
  { month: '6월', environment: 82, social: 78, governance: 84 },
];

const industryData = [
  { industry: 'IT/소프트웨어', score: 85 },
  { industry: '제조', score: 78 },
  { industry: '에너지', score: 82 },
  { industry: '환경', score: 88 },
  { industry: '물류', score: 72 },
  { industry: '바이오', score: 80 },
];

const recentUpdates = [
  { id: '1', company: '테크솔루션 주식회사', completion: 100, date: '2024.11.28', status: '완료', statusColor: 'bg-[#00B4FF]' },
  { id: '2', company: '그린에너지 코퍼레이션', completion: 100, date: '2024.11.25', status: '완료', statusColor: 'bg-[#00B4FF]' },
  { id: '3', company: '스마트제조 산업', completion: 85, date: '2024.11.22', status: '진행중', statusColor: 'bg-[#A58DFF]' },
  { id: '4', company: '친환경 패키징', completion: 100, date: '2024.11.20', status: '완료', statusColor: 'bg-[#00B4FF]' },
  { id: '5', company: '디지털 솔루션즈', completion: 60, date: '2024.11.18', status: '진행중', statusColor: 'bg-[#A58DFF]' },
];

export function EnterpriseDashboard({ onNavigate, onLogout }: EnterpriseDashboardProps) {
  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[#0F172A] mb-2">기업 대시보드</h1>
            <p className="text-[#8C8C8C]">관계사 ESG 현황을 한눈에 확인하세요</p>
          </div>

          {/* Section A — KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] hover:shadow-[0_6px_30px_rgba(91,59,250,0.15)] transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-[#0F172A]">60</h2>
              <p className="text-[#8C8C8C]">총 관계사 수</p>
            </Card>

            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] hover:shadow-[0_6px_30px_rgba(91,59,250,0.15)] transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00B4FF] to-[#5B3BFA] flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-[#0F172A]">B+</h2>
              <p className="text-[#8C8C8C]">평균 ESG 등급</p>
            </Card>

            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] hover:shadow-[0_6px_30px_rgba(91,59,250,0.15)] transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E30074] to-[#FF6B9D] flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-[#0F172A]">7</h2>
              <p className="text-[#8C8C8C]">고위험 관계사</p>
            </Card>

            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] hover:shadow-[0_6px_30px_rgba(91,59,250,0.15)] transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00B4FF] to-[#A58DFF] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-[#0F172A]">+8.2%</h2>
              <p className="text-[#8C8C8C]">등급 상승률 (30일)</p>
            </Card>
          </div>

          {/* Section B — ESG Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Donut Chart — ESG rating distribution */}
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <h3 className="text-[#0F172A] mb-6">ESG 등급 분포</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {gradeDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#0F172A] text-sm">{item.name}</span>
                    <span className="text-[#8C8C8C] text-sm">({item.value})</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Bar Chart — ESG by Industry */}
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <h3 className="text-[#0F172A] mb-6">업종별 ESG 점수</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={industryData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" domain={[0, 100]} stroke="#8C8C8C" />
                  <YAxis type="category" dataKey="industry" width={80} stroke="#8C8C8C" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="url(#colorGradient)" radius={[0, 8, 8, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#5B3BFA" />
                      <stop offset="100%" stopColor="#00B4FF" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Line Chart — ESG Trend */}
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <h3 className="text-[#0F172A] mb-6">ESG 추세 (6개월)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#8C8C8C" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#8C8C8C" domain={[65, 85]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="environment" stroke="#00B4FF" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="social" stroke="#5B3BFA" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="governance" stroke="#A58DFF" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Section C — Recent Updates Log */}
          <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#0F172A]">Recent Updates Log</h3>
              <Button
                variant="ghost"
                onClick={() => onNavigate('sme-list')}
                className="text-[#5B3BFA] hover:text-[#5B3BFA] rounded-xl"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F6F8FB]">
                  <tr>
                    <th className="text-left p-4 text-[#0F172A] rounded-l-xl">Affiliate Name</th>
                    <th className="text-center p-4 text-[#0F172A]">Completion Rate</th>
                    <th className="text-center p-4 text-[#0F172A]">Last Update Date</th>
                    <th className="text-center p-4 text-[#0F172A] rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUpdates.map((update) => (
                    <tr
                      key={update.id}
                      className="border-t border-gray-100 hover:bg-[#F6F8FB] transition-colors cursor-pointer"
                      onClick={() => onNavigate('company-detail', update.id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-[#8C8C8C]" />
                          <span className="text-[#0F172A]">{update.company}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <Progress value={update.completion} className="h-2 w-24" />
                          <span className="text-[#0F172A] text-sm">{update.completion}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-center text-[#8C8C8C]">{update.date}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-white text-sm ${update.statusColor}`}>
                          {update.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}