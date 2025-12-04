'use client';

import { useState } from 'react';
import { ArrowRight, BarChart3, FileText, Scale, Lightbulb, Rocket, TrendingUp, Wrench } from 'lucide-react';
import Header from '@/components/Header';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';

export default function IntroPage() {
  const [activeMainTab, setActiveMainTab] = useState('intro');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogin = () => {
    console.log('Login action triggered');
    setIsLoginModalOpen(false);
  };

  const handleStartDiagnosis = () => {
    // ESG 진단 시작 로직
    console.log('ESG 진단 시작');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header 
        onLoginClick={handleLoginClick}
      />

      {/* Main Navigation */}
      <MainNavigation 
        activeTab={activeMainTab}
        setActiveTab={setActiveMainTab}
        onLoginRequired={handleLoginRequired}
      />

      {/* Hero Section */}
      <section className="pt-[200px] pb-20 bg-gradient-to-br from-[#0D4ABB]/5 via-[#00D4FF]/5 to-[#8B5CF6]/5">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-bold text-[#1a2332] mb-4 whitespace-nowrap" style={{ fontFamily: 'Inter Tight, Arial, sans-serif' }}>
            ESG 공시·평가·규제 대응, AIFix 하나로 끝!
          </h1>
          <p className="text-2xl text-gray-700 mb-8 font-semibold">
            최소 노력으로 최대 ESG 성과 달성
          </p>
          <button
            onClick={handleStartDiagnosis}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0D4ABB] to-[#00D4FF] text-white hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto"
          >
            바로 ESG 진단 시작
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Section 1: 핵심 기능 (3 Pillars) */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-[#0D4ABB] mb-12" style={{ fontFamily: 'Inter Tight, Arial, sans-serif' }}>
            핵심 기능 (3 Pillars)
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0D4ABB]/10 to-[#00D4FF]/10 border border-[#0D4ABB]/20 hover:shadow-xl transition-all">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0D4ABB] to-[#00D4FF] flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1a2332] mb-4">
                Pillar 1: ESG 자가진단 & 성과관리
              </h3>
              <ul className="space-y-3 text-gray-700 mb-4">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>연중 E(Environment), S(Social), G(Governance) 영역별 데이터 자유 입력</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>AI가 입력 시점까지의 데이터를 기반으로 실시간 자가진단 점수와 예측 등급 제공</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>결과는 기업 내부 전용, 외부 공유 불가</span>
                </li>
              </ul>
              <div className="mt-4 p-3 rounded-lg bg-[#0D4ABB]/10">
                <p className="text-sm font-semibold text-[#0D4ABB]">
                  💡 강조 포인트: 연중 실시간 점수 확인 가능
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#E91E8C]/10 to-[#8B5CF6]/10 border border-[#E91E8C]/20 hover:shadow-xl transition-all">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#E91E8C] to-[#8B5CF6] flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1a2332] mb-4">
                Pillar 2: GRI 기반 보고서 자동 생성 & 전문 윤문
              </h3>
              <ul className="space-y-3 text-gray-700 mb-4">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>입력 데이터를 기반으로 지속가능경영보고서 자동 작성</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>AI 윤문(TST 모델)로 문체 보정 → 전문가 수준 보고서 완성</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>산업별·계열사별 맞춤형 템플릿 적용 가능</span>
                </li>
              </ul>
              <div className="mt-4 p-3 rounded-lg bg-[#E91E8C]/10">
                <p className="text-sm font-semibold text-[#E91E8C]">
                  💡 강조 포인트: 보고서 완성도 높음, 시간·노력 절감
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#00D4FF]/10 to-[#0D4ABB]/10 border border-[#00D4FF]/20 hover:shadow-xl transition-all">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#0D4ABB] flex items-center justify-center mb-6">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1a2332] mb-4">
                Pillar 3: 규제 대응 & ESRS Lite 연계
              </h3>
              <ul className="space-y-3 text-gray-700 mb-4">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>EU CSRD, CSDDD 등 글로벌 ESG 규제 변화 실시간 반영</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>GRI/K-ESG 데이터를 ESRS Lite 기준과 매핑하여 핵심 주제 중심 선제 준비 가능</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>RAG 기반 AI FIXER가 출처 기반 정확한 답변 제공</span>
                </li>
              </ul>
              <div className="mt-4 p-3 rounded-lg bg-[#00D4FF]/10">
                <p className="text-sm font-semibold text-[#00D4FF]">
                  💡 강조 포인트: 규제 변화에 신속·정확 대응
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: ESG 등급 관리 프로세스 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-[#0D4ABB] mb-12" style={{ fontFamily: 'Inter Tight, Arial, sans-serif' }}>
            ESG 등급 관리 프로세스
          </h2>

          {/* Process Flow Icons */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-[#0D4ABB] flex items-center justify-center text-white text-2xl">
                ⏱️
              </div>
              <span className="text-sm text-gray-600">연중 입력</span>
            </div>
            <ArrowRight className="w-8 h-8 text-gray-400" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-[#00D4FF] flex items-center justify-center text-white text-2xl">
                📊
              </div>
              <span className="text-sm text-gray-600">실시간 점수</span>
            </div>
            <ArrowRight className="w-8 h-8 text-gray-400" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-2xl">
                🏆
              </div>
              <span className="text-sm text-gray-600">최종 등급 공개</span>
            </div>
          </div>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-gray-300 bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-[#0D4ABB] to-[#00D4FF]">
                  <th className="border border-gray-300 px-6 py-4 text-left font-semibold text-white">구분</th>
                  <th className="border border-gray-300 px-6 py-4 text-left font-semibold text-white">자가진단</th>
                  <th className="border border-gray-300 px-6 py-4 text-left font-semibold text-white">최종 ESG 등급(공식)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-6 py-4 font-semibold text-gray-800 bg-gray-50">데이터 반영</td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">연중 발생 이슈 즉시 반영</td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">회계연도 종료일 기준 확정 (1월~12월, 4월~다음 해 3월 기준)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-6 py-4 font-semibold text-gray-800 bg-gray-50">조회 가능 여부</td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">기업 내부 전용</td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">모든 사람이 확인 가능 (홈페이지 방문자, 투자자 등)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-6 py-4 font-semibold text-gray-800 bg-gray-50">등급 공개 시점</td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">비공개</td>
                  <td className="border border-gray-300 px-6 py-4 text-gray-700">회계연도 종료 후 공식 보고서 발간 시점 (1년에 최대 2회)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 3: 기대 효과 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-[#0D4ABB] mb-12" style={{ fontFamily: 'Inter Tight, Arial, sans-serif' }}>
            기대 효과
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0D4ABB]/10 to-[#00D4FF]/10 border border-[#0D4ABB]/20">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-8 h-8 text-[#0D4ABB]" />
                <h3 className="text-2xl font-semibold text-[#0D4ABB]">사회적 효과</h3>
              </div>
              <p className="text-gray-700 text-lg">ESG 진입 장벽 완화, 중소기업 ESG 역량 강화</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#E91E8C]/10 to-[#8B5CF6]/10 border border-[#E91E8C]/20">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="w-8 h-8 text-[#E91E8C]" />
                <h3 className="text-2xl font-semibold text-[#E91E8C]">경제적 효과</h3>
              </div>
              <p className="text-gray-700 text-lg">보고서 작성과 진단 비용·시간 절감, 글로벌 밸류체인 경쟁력 향상</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#00D4FF]/10 to-[#0D4ABB]/10 border border-[#00D4FF]/20">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-[#00D4FF]" />
                <h3 className="text-2xl font-semibold text-[#00D4FF]">경영적 효과</h3>
              </div>
              <p className="text-gray-700 text-lg">리스크 조기 대응, 새로운 ESG 비즈니스 기회 발굴</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#E91E8C]/10 border border-[#8B5CF6]/20">
              <div className="flex items-center gap-3 mb-4">
                <Wrench className="w-8 h-8 text-[#8B5CF6]" />
                <h3 className="text-2xl font-semibold text-[#8B5CF6]">기술적 효과</h3>
              </div>
              <p className="text-gray-700 text-lg">AI 기반 전문 문서 작성 솔루션 시장 선도</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 마무리 CTA */}
      <section className="py-20 bg-gradient-to-r from-[#0D4ABB] via-[#00D4FF] to-[#8B5CF6]">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Inter Tight, Arial, sans-serif' }}>
            AIFix 하나로 최소 리소스로 최대 ESG 성과 달성
          </h2>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={handleStartDiagnosis}
              className="px-8 py-4 rounded-2xl bg-white text-[#0D4ABB] hover:shadow-xl hover:scale-105 transition-all font-semibold"
            >
              지금 시작하기
            </button>
            <button
              onClick={handleLoginClick}
              className="px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white border-2 border-white hover:bg-white/30 transition-all font-semibold"
            >
              무료 체험
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
