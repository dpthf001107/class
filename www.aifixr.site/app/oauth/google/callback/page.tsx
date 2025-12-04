"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/authservice";
import Link from "next/link";

interface TitanicPassenger {
  rank: number;
  passengerId: string;
  name: string;
  survived: string;
  survivedText: string;
  pclass: string;
  pclassText: string;
  sex: string;
  age: string | null;
  fare: number;
  embarked: string | null;
}

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("구글 로그인 처리 중...");
  const [showTitanic, setShowTitanic] = useState(false);
  const [titanicData, setTitanicData] = useState<TitanicPassenger[]>([]);
  const [titanicLoading, setTitanicLoading] = useState(false);
  const [titanicError, setTitanicError] = useState<string | null>(null);

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
        } else {
          throw new Error(data.message || "로그인 실패");
        }
      } catch (error: any) {
        console.error("로그인 실패:", error);
        setStatus("error");
        setMessage(error.message || "로그인 처리 중 오류가 발생했습니다.");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  const fetchTitanicData = async () => {
    setTitanicLoading(true);
    setTitanicError(null);
    try {
      const response = await fetch("http://localhost:8080/api/titanic/top-10", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        setTitanicData(data.data);
        setShowTitanic(true);
      } else {
        setTitanicError(data.message || "데이터를 불러오는데 실패했습니다.");
      }
    } catch (error: any) {
      console.error("타이타닉 데이터 조회 실패:", error);
      setTitanicError(
        error.message || "타이타닉 데이터를 불러오는데 실패했습니다. 서버가 실행 중인지 확인해주세요."
      );
    } finally {
      setTitanicLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      {status === "loading" && (
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0D4ABB] mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div className="w-full max-w-md px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
            {/* 성공 아이콘 */}
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-pulse">
                <svg
                  className="h-12 w-12 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* 성공 메시지 */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                로그인 성공!
              </h1>
              <p className="text-gray-600">
                구글 로그인이 성공적으로 완료되었습니다.
              </p>
            </div>

            {/* 사용자 정보 표시 */}
            <div className="pt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">환영합니다!</p>
                <p className="text-base font-medium text-gray-900">
                  이제 서비스를 이용하실 수 있습니다.
                </p>
              </div>
            </div>

            {/* 버튼 */}
            <div className="pt-6 space-y-3">
              <button
                onClick={fetchTitanicData}
                disabled={titanicLoading}
                className="block w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {titanicLoading ? "로딩 중..." : "타이타닉 정보 확인"}
              </button>
              <Link
                href="/"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                홈으로 이동
              </Link>
              <button
                onClick={() => router.back()}
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                이전 페이지로
              </button>
            </div>

            {/* 추가 정보 */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                로그인 정보는 안전하게 저장되었습니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 타이타닉 정보 표시 */}
      {showTitanic && (
        <div className="w-full max-w-4xl px-6 mt-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                타이타닉 승객 중 요금이 높은 상위 10명
              </h2>
              <button
                onClick={() => setShowTitanic(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {titanicError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{titanicError}</p>
              </div>
            )}

            {titanicData.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">순위</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">이름</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">생존 여부</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">객실 등급</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">성별</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">나이</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">요금</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">탑승 항구</th>
                    </tr>
                  </thead>
                  <tbody>
                    {titanicData.map((passenger) => (
                      <tr key={passenger.passengerId} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 text-gray-900 font-medium">
                          {passenger.rank}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-gray-900">
                          {passenger.name}
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            passenger.survived === '1' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {passenger.survivedText}
                          </span>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-gray-700">
                          {passenger.pclassText}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-gray-700">
                          {passenger.sex}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-gray-700">
                          {passenger.age || 'N/A'}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-gray-900 font-semibold">
                          ${passenger.fare.toFixed(2)}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-gray-700">
                          {passenger.embarked || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="w-full max-w-md px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-red-600">로그인 실패</h1>
              <p className="text-gray-600">{message}</p>
            </div>
            <div className="pt-4">
              <Link
                href="/"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                홈으로 이동
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

