"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/authservice";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("구글 로그인 처리 중...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 백엔드에서 리디렉션된 경우 (토큰이 쿼리 파라미터로 전달됨)
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");
        const success = searchParams.get("success");
        const error = searchParams.get("error");

        // 에러 처리
        if (error) {
          setStatus("error");
          setMessage(`로그인 실패: ${decodeURIComponent(error)}`);
          setTimeout(() => router.push("/"), 3000);
          return;
        }

        // 백엔드에서 리디렉션된 경우 (토큰이 이미 전달됨)
        if (success === "true" && token) {
          // JWT 토큰 저장
          localStorage.setItem("access_token", token);
          if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
          }

          setStatus("success");
          setMessage("로그인 성공!");
          // 로그인 성공 후 대시보드로 이동
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
          return;
        }

        // 기존 방식: code와 state로 백엔드에 요청
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code || !state) {
          throw new Error("인가 코드 또는 state가 없습니다.");
        }

        // 백엔드로 code 전송
        const data = await AuthService.handleGoogleCallback(code, state);

        if (data.success && data.token) {
          // JWT 토큰 저장
          localStorage.setItem("access_token", data.token);
          if (data.refreshToken) {
            localStorage.setItem("refresh_token", data.refreshToken);
          }
          if (data.user) {
            localStorage.setItem("user_info", JSON.stringify(data.user));
          }

          setStatus("success");
          setMessage("로그인 성공!");
          // 로그인 성공 후 대시보드로 이동
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          throw new Error(data.message || "로그인 실패");
        }
      } catch (error: any) {
        console.error("로그인 실패:", error);
        setStatus("error");
        setMessage(error.message || "로그인 처리 중 오류가 발생했습니다.");
        setTimeout(() => router.push("/"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB]">
      <div className="text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0D4ABB]"></div>
            <p className="text-lg text-gray-700">{message}</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-green-600">{message}</p>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-red-600">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

