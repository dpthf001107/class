import { ArrowLeft, Building2, Calendar, Award, TrendingUp, FileText, AlertTriangle, MapPin, Users } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ReadOnlyTooltip } from './ReadOnlyTooltip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

interface CompanyDetailProps {
  companyId: string;
  onNavigate: (screen: any, companyId?: string, reportId?: string) => void;
  onLogout: () => void;
}

const yearlyData = [
  { year: '2020', score: 68 },
  { year: '2021', score: 72 },
  { year: '2022', score: 78 },
  { year: '2023', score: 83 },
  { year: '2024', score: 87 },
];

const categoryData = [
  { category: '정책', environment: 85, social: 82, governance: 88 },
  { category: '실행', environment: 87, social: 80, governance: 86 },
  { category: '성과', environment: 89, social: 84, governance: 90 },
];

const reports = [
  { id: 'r1', title: 'ESG 종합 평가 보고서', date: '2024.11.28', type: 'PDF' },
  { id: 'r2', title: '환경 경영 성과 분석', date: '2024.11.15', type: 'PDF' },
  { id: 'r3', title: '사회적 책임 이행 보고서', date: '2024.10.30', type: 'PDF' },
  { id: 'r4', title: '지배구조 평가 리포트', date: '2024.10.15', type: 'PDF' },
];

const highRisks = [
  { category: '환경', item: '탄소 배출 목표 미달성', severity: 'high' },
  { category: '사회', item: '직원 다양성 개선 필요', severity: 'medium' },
];

const esgIndicators = {
  environmental: [
    { indicator: '탄소 배출량', value: '150 tCO2e', target: '120 tCO2e' },
    { indicator: '재생에너지 사용률', value: '35%', target: '50%' },
    { indicator: '폐기물 재활용률', value: '92%', target: '90%' },
  ],
  social: [
    { indicator: '여성 임원 비율', value: '30%', target: '35%' },
    { indicator: '직원 교육 시간', value: '48시간/년', target: '40시간/년' },
    { indicator: '산업재해율', value: '0.2%', target: '0.5%' },
  ],
  governance: [
    { indicator: '사외이사 비율', value: '60%', target: '50%' },
    { indicator: '이사회 참석률', value: '95%', target: '90%' },
    { indicator: '윤리경영 교육', value: '100%', target: '100%' },
  ],
};

export function CompanyDetail({ companyId, onNavigate, onLogout }: CompanyDetailProps) {
  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">
      <Sidebar currentPage="sme-list" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => onNavigate('sme-list')}
            className="mb-6 rounded-xl text-[#5B3BFA]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            관계사 목록으로 돌아가기
          </Button>

          {/* Company Header Card */}
          <Card className="p-8 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center text-3xl">
                  🏢
                </div>
                <div>
                  <h1 className="text-[#0F172A] mb-2">테크솔루션 주식회사</h1>
                  <div className="flex flex-wrap gap-4 text-[#8C8C8C]">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>IT/소프트웨어</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>서울특별시</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>직원 수: 250명</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>설립: 2015년</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#8C8C8C] mb-2">담당자 연락처</p>
                <p className="text-[#0F172A]">김담당 (manager@techsol.com)</p>
              </div>
            </div>
          </Card>

          {/* ESG Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] md:col-span-1">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center mb-4">
                  <span className="text-white text-4xl">A</span>
                </div>
                <h2 className="text-[#0F172A] mb-1">87점</h2>
                <p className="text-[#8C8C8C]">ESG 종합 등급</p>
                <p className="text-[#8C8C8C] text-sm mt-2">최근 평가일</p>
                <p className="text-[#0F172A] text-sm">2024.11.28</p>
              </div>
            </Card>

            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#00B4FF]/10 flex items-center justify-center">
                  <span className="text-[#00B4FF]">🌍</span>
                </div>
                <div>
                  <h3 className="text-[#0F172A]">환경 (E)</h3>
                  <p className="text-[#8C8C8C]">Environmental</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#0F172A]">85점</span>
                  <span className="text-[#00B4FF]">A등급</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </Card>

            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#5B3BFA]/10 flex items-center justify-center">
                  <span className="text-[#5B3BFA]">👥</span>
                </div>
                <div>
                  <h3 className="text-[#0F172A]">사회 (S)</h3>
                  <p className="text-[#8C8C8C]">Social</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#0F172A]">82점</span>
                  <span className="text-[#5B3BFA]">B등급</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
            </Card>

            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#A58DFF]/10 flex items-center justify-center">
                  <span className="text-[#A58DFF]">⚖️</span>
                </div>
                <div>
                  <h3 className="text-[#0F172A]">지배구조 (G)</h3>
                  <p className="text-[#8C8C8C]">Governance</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#0F172A]">88점</span>
                  <span className="text-[#A58DFF]">A등급</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
            </Card>
          </div>

          {/* ESG Risk Summary */}
          <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] mb-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-[#E30074]" />
              <h3 className="text-[#0F172A]">ESG 위험 요약</h3>
            </div>
            <div className="space-y-3">
              {highRisks.map((risk, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-l-4 ${
                    risk.severity === 'high'
                      ? 'border-[#E30074] bg-[#E30074]/5'
                      : 'border-[#A58DFF] bg-[#A58DFF]/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          risk.severity === 'high'
                            ? 'bg-[#E30074] text-white'
                            : 'bg-[#A58DFF] text-white'
                        }`}>
                          {risk.severity === 'high' ? '높은 위험' : '중간 위험'}
                        </span>
                        <span className="text-[#8C8C8C]">{risk.category}</span>
                      </div>
                      <p className="text-[#0F172A]">{risk.item}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Detailed ESG Indicators with Read-Only Inputs */}
          <div className="space-y-6 mb-6">
            {/* Environmental Indicators */}
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <h3 className="text-[#0F172A] mb-6">환경 지표 (Environmental)</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F6F8FB]">
                    <tr>
                      <th className="text-left p-4 text-[#0F172A]">지표</th>
                      <th className="text-center p-4 text-[#0F172A]">현재 값</th>
                      <th className="text-center p-4 text-[#0F172A]">목표</th>
                    </tr>
                  </thead>
                  <tbody>
                    {esgIndicators.environmental.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="p-4 text-[#0F172A]">{item.indicator}</td>
                        <td className="p-4">
                          <ReadOnlyTooltip>
                            <Input
                              value={item.value}
                              disabled
                              className="text-center h-10 rounded-lg bg-gray-50 cursor-not-allowed"
                            />
                          </ReadOnlyTooltip>
                        </td>
                        <td className="p-4 text-center text-[#8C8C8C]">{item.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Social Indicators */}
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <h3 className="text-[#0F172A] mb-6">사회 지표 (Social)</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F6F8FB]">
                    <tr>
                      <th className="text-left p-4 text-[#0F172A]">지표</th>
                      <th className="text-center p-4 text-[#0F172A]">현재 값</th>
                      <th className="text-center p-4 text-[#0F172A]">목표</th>
                    </tr>
                  </thead>
                  <tbody>
                    {esgIndicators.social.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="p-4 text-[#0F172A]">{item.indicator}</td>
                        <td className="p-4">
                          <ReadOnlyTooltip>
                            <Input
                              value={item.value}
                              disabled
                              className="text-center h-10 rounded-lg bg-gray-50 cursor-not-allowed"
                            />
                          </ReadOnlyTooltip>
                        </td>
                        <td className="p-4 text-center text-[#8C8C8C]">{item.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Governance Indicators */}
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <h3 className="text-[#0F172A] mb-6">지배구조 지표 (Governance)</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F6F8FB]">
                    <tr>
                      <th className="text-left p-4 text-[#0F172A]">지표</th>
                      <th className="text-center p-4 text-[#0F172A]">현재 값</th>
                      <th className="text-center p-4 text-[#0F172A]">목표</th>
                    </tr>
                  </thead>
                  <tbody>
                    {esgIndicators.governance.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="p-4 text-[#0F172A]">{item.indicator}</td>
                        <td className="p-4">
                          <ReadOnlyTooltip>
                            <Input
                              value={item.value}
                              disabled
                              className="text-center h-10 rounded-lg bg-gray-50 cursor-not-allowed"
                            />
                          </ReadOnlyTooltip>
                        </td>
                        <td className="p-4 text-center text-[#8C8C8C]">{item.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Reports & History Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Rating Trend */}
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <h3 className="text-[#0F172A] mb-6">월별 등급 추이</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="year" stroke="#8C8C8C" />
                  <YAxis stroke="#8C8C8C" domain={[60, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="url(#colorGradient)" 
                    strokeWidth={3}
                    dot={{ fill: '#5B3BFA', r: 6 }}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#5B3BFA" />
                      <stop offset="100%" stopColor="#00B4FF" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Submission History */}
            <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
              <h3 className="text-[#0F172A] mb-6">제출 이력</h3>
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 bg-[#F6F8FB] rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#5B3BFA]" />
                      <div>
                        <p className="text-[#0F172A] text-sm">{report.title}</p>
                        <p className="text-[#8C8C8C] text-xs">{report.date}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('report-viewer', companyId, report.id)}
                      className="rounded-lg text-[#5B3BFA]"
                    >
                      다운로드
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}