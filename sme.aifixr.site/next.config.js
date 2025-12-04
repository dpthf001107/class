/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // SPA 모드: 정적 파일로 export
  images: {
    unoptimized: true, // SPA 모드에서는 이미지 최적화 비활성화
    domains: [],
  },
  trailingSlash: true, // SPA 호환성을 위해 trailing slash 추가
}

module.exports = nextConfig

