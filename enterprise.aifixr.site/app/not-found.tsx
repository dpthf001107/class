'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // SPA 구조이므로 모든 경로를 루트로 리다이렉트
    router.replace('/');
  }, [router]);

  return null;
}

