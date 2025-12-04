import { useState } from 'react';
import { FileText, Download, Filter, Calendar, CheckSquare, Square } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ReportCenterProps {
  onNavigate: (screen: any, companyId?: string, reportId?: string) => void;
  onLogout: () => void;
}

const allReports = [
  { id: 'r1', company: '테크솔루션 주식회사', title: 'ESG 종합 평가 보고서', date: '2024.11.28', grade: 'A', size: '2.4 MB' },
  { id: 'r2', company: '그린에너지 코퍼레이션', title: 'ESG 종합 평가 보고서', date: '2024.11.25', grade: 'B', size: '2.1 MB' },
  { id: 'r3', company: '스마트제조 산업', title: 'ESG 종합 평가 보고서', date: '2024.11.22', grade: 'A', size: '2.3 MB' },
  { id: 'r4', company: '친환경 패키징', title: 'ESG 종합 평가 보고서', date: '2024.11.20', grade: 'B', size: '1.9 MB' },
  { id: 'r5', company: '디지털 솔루션즈', title: 'ESG 종합 평가 보고서', date: '2024.11.18', grade: 'A', size: '2.5 MB' },
  { id: 'r6', company: '바이오텍 연구소', title: 'ESG 종합 평가 보고서', date: '2024.11.15', grade: 'B', size: '2.2 MB' },
  { id: 'r7', company: '청정수자원', title: 'ESG 종합 평가 보고서', date: '2024.11.12', grade: 'A', size: '2.0 MB' },
  { id: 'r8', company: '스마트 물류', title: 'ESG 종합 평가 보고서', date: '2024.11.10', grade: 'C', size: '1.8 MB' },
];

export function ReportCenter({ onNavigate, onLogout }: ReportCenterProps) {
  const [sortBy, setSortBy] = useState<string>('newest');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());

  const toggleReportSelection = (id: string) => {
    const newSelection = new Set(selectedReports);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedReports(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedReports.size === filteredReports.length) {
      setSelectedReports(new Set());
    } else {
      setSelectedReports(new Set(filteredReports.map(r => r.id)));
    }
  };

  const filteredReports = allReports.filter(report => {
    const matchesGrade = gradeFilter === 'all' || report.grade === gradeFilter;
    return matchesGrade;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return b.date.localeCompare(a.date);
    } else {
      return a.date.localeCompare(b.date);
    }
  });

  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">
      <Sidebar currentPage="report-center" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[#0F172A] mb-2">보고서 다운로드 센터</h1>
            <p className="text-[#8C8C8C]">모든 ESG 평가 보고서를 다운로드할 수 있습니다</p>
          </div>

          {/* Filters & Actions */}
          <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 h-12 rounded-xl">
                    <SelectValue placeholder="정렬" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">최신순</SelectItem>
                    <SelectItem value="oldest">과거순</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="w-40 h-12 rounded-xl">
                    <SelectValue placeholder="등급" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 등급</SelectItem>
                    <SelectItem value="A">A 등급</SelectItem>
                    <SelectItem value="B">B 등급</SelectItem>
                    <SelectItem value="C">C 등급</SelectItem>
                    <SelectItem value="D">D 등급</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedReports.size > 0 && (
                <Button
                  className="bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] rounded-xl hover:shadow-[0_4px_20px_rgba(91,59,250,0.4)] transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  ZIP 다운로드 ({selectedReports.size}개 선택)
                </Button>
              )}
            </div>
          </Card>

          {/* Reports Grid */}
          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center gap-3 px-4">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-[#5B3BFA] hover:text-[#5B3BFA]/80 transition-colors"
              >
                {selectedReports.size === filteredReports.length ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
                <span>전체 선택</span>
              </button>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => {
                const isSelected = selectedReports.has(report.id);
                return (
                  <Card
                    key={report.id}
                    className={`p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] hover:shadow-[0_6px_30px_rgba(91,59,250,0.2)] transition-all cursor-pointer ${
                      isSelected ? 'ring-2 ring-[#5B3BFA]' : ''
                    }`}
                    onClick={() => toggleReportSelection(report.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReportSelection(report.id);
                        }}
                        className="p-1"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-[#5B3BFA]" />
                        ) : (
                          <Square className="w-5 h-5 text-[#8C8C8C]" />
                        )}
                      </button>
                    </div>

                    <h3 className="text-[#0F172A] mb-2">{report.company}</h3>
                    <p className="text-[#8C8C8C] mb-4">{report.title}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#8C8C8C]">ESG 등급</span>
                        <span className={`px-3 py-1 rounded-full ${
                          report.grade === 'A' ? 'bg-[#00B4FF]/10 text-[#00B4FF]' :
                          report.grade === 'B' ? 'bg-[#5B3BFA]/10 text-[#5B3BFA]' :
                          'bg-[#8C8C8C]/10 text-[#8C8C8C]'
                        }`}>
                          {report.grade}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#8C8C8C]">날짜</span>
                        <span className="text-[#0F172A]">{report.date}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#8C8C8C]">크기</span>
                        <span className="text-[#0F172A]">{report.size}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('report-viewer', '1', report.id);
                        }}
                        className="flex-1 rounded-xl"
                      >
                        보기
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] rounded-xl"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        다운로드
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}