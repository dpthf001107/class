import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIFIX 소개 | AIFix 서비스 소개',
  description: 'AIFix(에이픽스)는 중소기업의 ESG 공시, 평가, 규제 대응을 한 번에 지원하는 AI 솔루션입니다. GRI 기반 보고서 자동 생성, 전문 윤문, K-ESG 기반 자가진단, ESRS Lite 연계 기능을 제공합니다.',
  keywords: 'AIFix, ESG, ESG 플랫폼, ESG 보고서, ESG 등급, 지속가능경영, GRI, K-ESG, ESRS Lite',
  openGraph: {
    title: 'AIFIX 소개 | AIFix 서비스 소개',
    description: 'AIFix(에이픽스)는 중소기업의 ESG 공시, 평가, 규제 대응을 한 번에 지원하는 AI 솔루션입니다.',
    type: 'website',
  },
};

export default function IntroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

