'use client';

import { BarChart3, FileText, Network, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PillarSection() {
  const router = useRouter();

  const pillars = [
    {
      icon: BarChart3,
      title: 'Pillar 1: ESG 등급 진단',
      subtitle: 'K-ESG ↔ ESRS Lite 토글',
      description: 'K-ESG와 ESRS Lite 기준을 자동으로 매핑하여 두 기준을 한 번에 대응할 수 있습니다.',
      iconColor: 'bg-[#0D4ABB]',
      cardBg: 'from-[#0D4ABB]/10 to-[#00D4FF]/10',
      borderColor: 'border-[#0D4ABB]/20'
    },
    {
      icon: FileText,
      title: 'Pillar 2: ESG 보고서 자동화',
      subtitle: 'GRI 기반 + 전문 윤문',
      description: '입력한 데이터를 기반으로 GRI 표준에 맞는 ESG 보고서를 자동 생성하고, AI 윤문으로 전문성을 높입니다.',
      iconColor: 'bg-[#E91E8C]',
      cardBg: 'from-[#E91E8C]/10 to-[#8B5CF6]/10',
      borderColor: 'border-[#E91E8C]/20'
    },
    {
      icon: Network,
      title: 'Pillar 3: 공급망 ESG 모니터링',
      subtitle: 'Enterprise Portal',
      description: '협력사들의 ESG 현황을 한눈에 모니터링하고 리스크를 조기 발견하여 대응할 수 있습니다.',
      iconColor: 'bg-[#00D4FF]',
      cardBg: 'from-[#00D4FF]/10 to-[#0D4ABB]/10',
      borderColor: 'border-[#00D4FF]/20'
    }
  ];

  const handleLearnMore = () => {
    router.push('/intro');
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="mb-4 text-[#1a2332]">AIFix 3 Pillar 솔루션</h2>
          <p className="text-gray-600">
            ESG 진단부터 보고서, 공급망 모니터링까지 한 플랫폼에서
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-2xl bg-gradient-to-br ${pillar.cardBg} border-2 ${pillar.borderColor} hover:shadow-2xl transition-all duration-300`}
              style={{
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl ${pillar.iconColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <pillar.icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="mb-3 text-2xl font-bold text-[#1a2332]" style={{ fontFamily: 'Inter Tight, Arial, sans-serif' }}>
                {pillar.title}
              </h3>

              {/* Subtitle */}
              <p className="mb-4 text-base font-semibold text-gray-700">
                {pillar.subtitle}
              </p>

              {/* Description */}
              <p className="mb-6 text-gray-600 leading-relaxed" style={{ fontSize: '16px' }}>
                {pillar.description}
              </p>

              {/* Learn More Button */}
              <button
                onClick={handleLearnMore}
                className="group/btn flex items-center gap-2 text-[#0D4ABB] font-semibold hover:gap-3 transition-all"
              >
                자세히 보기
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

