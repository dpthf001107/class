'use client';

import { Check, ArrowRight, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingSection() {
  const router = useRouter();

  const handleStartDiagnosis = () => {
    router.push('/intro');
  };

  const handleWatchDemo = () => {
    console.log('데모 영상 보기');
  };

  const handleContactEnterprise = () => {
    console.log('Enterprise 문의');
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="mb-4 text-3xl lg:text-4xl font-bold text-[#1a2332]" style={{ fontFamily: 'Inter Tight, Arial, sans-serif' }}>
            요금제 & 시작하기
          </h2>
          <p className="text-gray-600 text-lg">
            기업 규모에 맞는 최적의 솔루션을 선택하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* SME Pricing Card */}
          <div className="relative p-8 rounded-3xl bg-white border-2 border-gray-200 hover:border-[#0D4ABB] hover:shadow-2xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-[#1a2332] mb-2">SME 요금제</h3>
              <p className="text-gray-600">중소기업을 위한 맞춤형 솔루션</p>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#0D4ABB]">월 구독</span>
                <span className="text-gray-500">요금</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">간단 요약표 (추후 상세 정보 추가)</p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">ESG 자가진단</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">자동 보고서 생성</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">개선 가이드 제공</span>
              </li>
            </ul>

            {/* CTA Button */}
            <button
              onClick={handleStartDiagnosis}
              className="w-full px-6 py-4 rounded-2xl bg-[#0D4ABB] text-white hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 font-semibold"
            >
              무료 진단 시작
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Enterprise Card */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-[#0D4ABB] to-[#00D4FF] text-white hover:shadow-2xl transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-white/80">대기업 및 모기업을 위한 통합 솔루션</p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <span>공급망 ESG 모니터링</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <span>Enterprise Portal</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <span>맞춤형 컨설팅</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                <span>전담 지원</span>
              </li>
            </ul>

            {/* CTA Button */}
            <button
              onClick={handleContactEnterprise}
              className="w-full px-6 py-4 rounded-2xl bg-white text-[#0D4ABB] hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Phone className="w-5 h-5" />
              상담하기
            </button>
          </div>
        </div>

        {/* Additional CTAs */}
        <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={handleStartDiagnosis}
            className="px-8 py-4 rounded-2xl bg-[#0D4ABB] text-white hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 font-semibold"
          >
            무료 진단 시작
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={handleWatchDemo}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E91E8C] to-[#8B5CF6] text-white hover:shadow-xl hover:scale-105 transition-all font-semibold"
          >
            데모 영상 보기
          </button>
        </div>
      </div>
    </section>
  );
}

