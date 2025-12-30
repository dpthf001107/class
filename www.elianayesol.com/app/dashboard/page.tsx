"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authservice";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push("/");
      return;
    }
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, [router]);

  const handleLogout = () => {
    AuthService.logout();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0D4ABB]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-[#1a2332]">대시보드</h1>
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">사용자 정보</h2>
          <div className="space-y-2">
            <p><strong>이름:</strong> {user.name}</p>
            <p><strong>이메일:</strong> {user.email}</p>
            {user.picture && (
              <img src={user.picture} alt={user.name} className="mt-4 h-16 w-16 rounded-full" />
            )}
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

