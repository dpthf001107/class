import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface ReportViewerProps {
  reportId: string;
  onNavigate: (screen: any, companyId?: string) => void;
  onLogout: () => void;
}

const reportList = [
  { id: 'r1', title: 'ESG 종합 평가 보고서', date: '2024.11.28', pages: 45 },
  { id: 'r2', title: '환경 경영 성과 분석', date: '2024.11.15', pages: 28 },
  { id: 'r3', title: '사회적 책임 이행 보고서', date: '2024.10.30', pages: 32 },
  { id: 'r4', title: '지배구조 평가 리포트', date: '2024.10.15', pages: 24 },
];

export function ReportViewer({ reportId, onNavigate, onLogout }: ReportViewerProps) {
  const currentReport = reportList.find(r => r.id === reportId) || reportList[0];

  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">
      <Sidebar currentPage="report-center" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => onNavigate('company-detail', '1')}
            className="mb-6 rounded-xl text-[#5B3BFA]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            기업 상세로 돌아가기
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Report List Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)]">
                <h3 className="text-[#0F172A] mb-4">보고서 목록</h3>
                <div className="space-y-2">
                  {reportList.map((report) => (
                    <div
                      key={report.id}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        report.id === reportId
                          ? 'bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white'
                          : 'bg-[#F6F8FB] hover:bg-gray-100'
                      }`}
                      onClick={() => onNavigate('report-viewer', '1', report.id)}
                    >
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 mt-1 flex-shrink-0" />
                        <div>
                          <p className={`text-sm mb-1 ${
                            report.id === reportId ? 'text-white' : 'text-[#0F172A]'
                          }`}>
                            {report.title}
                          </p>
                          <p className={`text-xs ${
                            report.id === reportId ? 'text-white/80' : 'text-[#8C8C8C]'
                          }`}>
                            {report.date} · {report.pages}페이지
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* PDF Viewer */}
            <div className="lg:col-span-3">
              <Card className="rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] overflow-hidden">
                {/* Viewer Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[#0F172A]">{currentReport.title}</h3>
                      <p className="text-[#8C8C8C]">{currentReport.date} · {currentReport.pages}페이지</p>
                    </div>
                    <Button className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] rounded-xl hover:shadow-[0_4px_20px_rgba(91,59,250,0.4)] transition-all">
                      <Download className="w-4 h-4 mr-2" />
                      PDF 다운로드
                    </Button>
                  </div>
                </div>

                {/* PDF Content Area */}
                <div className="bg-[#F6F8FB] p-8" style={{ minHeight: '800px' }}>
                  <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-12">
                    {/* Mock PDF Content */}
                    <div className="text-center mb-12">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF]" />
                      <h1 className="text-[#0F172A] mb-4">테크솔루션 주식회사</h1>
                      <h2 className="text-[#0F172A] mb-2">{currentReport.title}</h2>
                      <p className="text-[#8C8C8C]">{currentReport.date}</p>
                    </div>

                    <div className="space-y-8 text-[#0F172A]">
                      <section>
                        <h3 className="mb-4 pb-3 border-b border-gray-200">1. 개요</h3>
                        <p className="text-[#8C8C8C] leading-relaxed">
                          본 보고서는 테크솔루션 주식회사의 ESG(환경·사회·지배구조) 성과를 
                          종합적으로 평가한 문서입니다. AIFIX ESG 평가 시스템을 통해 수집된 
                          데이터를 기반으로 작성되었으며, 국제 ESG 평가 기준을 준수합니다.
                        </p>
                      </section>

                      <section>
                        <h3 className="mb-4 pb-3 border-b border-gray-200">2. 평가 결과 요약</h3>
                        <div className="bg-[#F6F8FB] p-6 rounded-xl">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[#8C8C8C] mb-1">종합 등급</p>
                              <p className="text-2xl">A등급 (87점)</p>
                            </div>
                            <div>
                              <p className="text-[#8C8C8C] mb-1">평가 기간</p>
                              <p className="text-2xl">2024년</p>
                            </div>
                            <div>
                              <p className="text-[#8C8C8C] mb-1">환경 (E)</p>
                              <p>85점</p>
                            </div>
                            <div>
                              <p className="text-[#8C8C8C] mb-1">사회 (S)</p>
                              <p>82점</p>
                            </div>
                            <div>
                              <p className="text-[#8C8C8C] mb-1">지배구조 (G)</p>
                              <p>88점</p>
                            </div>
                            <div>
                              <p className="text-[#8C8C8C] mb-1">전년 대비</p>
                              <p className="text-[#00B4FF]">+4점 ↑</p>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="mb-4 pb-3 border-b border-gray-200">3. 환경 성과 (Environmental)</h3>
                        <p className="text-[#8C8C8C] leading-relaxed mb-4">
                          테크솔루션은 탄소 배출 저감을 위한 적극적인 노력을 기울이고 있으며, 
                          재생에너지 사용 비율을 지속적으로 확대하고 있습니다.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-[#8C8C8C]">
                          <li>탄소 배출량 전년 대비 15% 감소</li>
                          <li>재생에너지 사용 비율 35% 달성</li>
                          <li>친환경 인증 제품 비율 80% 이상</li>
                          <li>폐기물 재활용률 92% 달성</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="mb-4 pb-3 border-b border-gray-200">4. 사회 성과 (Social)</h3>
                        <p className="text-[#8C8C8C] leading-relaxed mb-4">
                          직원 복지와 다양성 증진을 위한 다양한 프로그램을 운영하고 있으며, 
                          지역사회 공헌 활동을 활발히 전개하고 있습니다.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-[#8C8C8C]">
                          <li>여성 임원 비율 30% 달성</li>
                          <li>직원 교육 투자 전년 대비 25% 증가</li>
                          <li>산업재해율 업계 평균 대비 50% 낮음</li>
                          <li>지역사회 공헌 활동 연 120시간</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="mb-4 pb-3 border-b border-gray-200">5. 지배구조 성과 (Governance)</h3>
                        <p className="text-[#8C8C8C] leading-relaxed mb-4">
                          투명한 경영과 윤리경영을 실천하며, 이사회의 독립성과 전문성을 
                          지속적으로 강화하고 있습니다.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-[#8C8C8C]">
                          <li>사외이사 비율 60% 유지</li>
                          <li>이사회 참석률 95% 이상</li>
                          <li>윤리경영 교육 이수율 100%</li>
                          <li>내부고발 제도 운영 및 보호</li>
                        </ul>
                      </section>

                      <section className="pt-8 border-t border-gray-200">
                        <p className="text-center text-[#8C8C8C]">
                          본 보고서는 AIFIX ESG 평가 시스템에 의해 생성되었습니다.<br />
                          enterprise.aifixr.site
                        </p>
                      </section>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}