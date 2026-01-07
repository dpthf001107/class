'use client';

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';
import { useStore } from 'zustand';
import { getAuthStore, AuthStoreType, AuthStore } from './auth.store';

// ============================================
// Provider Pattern for Next.js 16
// ============================================

// Context 생성
const AuthStoreContext = createContext<AuthStoreType | null>(null);

// Provider Props
interface AuthStoreProviderProps {
  children: ReactNode;
}

// Provider 컴포넌트
export function AuthStoreProvider({ children }: AuthStoreProviderProps) {
  // useRef로 스토어 인스턴스를 한 번만 생성 (리렌더링 시 재생성 방지)
  // 싱글톤 인스턴스를 사용하여 서비스 레이어와 동일한 스토어 공유
  const storeRef = useRef<AuthStoreType | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);
  
  // 클라이언트 사이드에서만 스토어 생성 (SSR 방지)
  useEffect(() => {
    setIsClient(true);
    if (!storeRef.current) {
      storeRef.current = getAuthStore() as AuthStoreType;
    }
  }, []);

  // 서버 사이드 렌더링 중에는 null을 전달
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <AuthStoreContext.Provider value={storeRef.current || null}>
      {children}
    </AuthStoreContext.Provider>
  );
}

// Custom Hook: 스토어 사용
export function useAuthStore<T>(selector: (state: AuthStore) => T): T {
  const store = useContext(AuthStoreContext);
  
  if (!store) {
    throw new Error('useAuthStore must be used within AuthStoreProvider');
  }
  
  return useStore(store, selector);
}

// Custom Hook: 전체 스토어 사용
export function useAuthStoreAll(): AuthStore {
  const store = useContext(AuthStoreContext);
  
  if (!store) {
    throw new Error('useAuthStore must be used within AuthStoreProvider');
  }
  
  return useStore(store);
}

