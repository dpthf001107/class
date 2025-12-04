import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Shield, Sparkles } from "lucide-react";
import type { UserRole } from "@/types";

interface LoginScreenProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("Super Admin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5B3BFA] via-[#7C5DFF] to-[#00B4FF] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-2xl mb-6">
            <Sparkles className="w-10 h-10 text-[#5B3BFA]" />
          </div>
          <h1 className="text-white mb-2">AIFIX Admin Portal</h1>
          <p className="text-white/80">ESG Management SaaS Platform</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-[24px] shadow-2xl p-8 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-[#5B3BFA]" />
            <h2 className="text-[#0F172A]">관리자 로그인</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@aifix.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-gray-200 focus:border-[#5B3BFA] focus:ring-[#5B3BFA]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-gray-200 focus:border-[#5B3BFA] focus:ring-[#5B3BFA]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twoFactor">2FA 인증코드 (선택)</Label>
              <Input
                id="twoFactor"
                type="text"
                placeholder="000000"
                value={twoFactor}
                onChange={(e) => setTwoFactor(e.target.value)}
                className="h-12 rounded-xl border-gray-200 focus:border-[#5B3BFA] focus:ring-[#5B3BFA]"
                maxLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">역할 선택 (데모용)</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl gradient-aifix hover:gradient-aifix-hover transition-all duration-300 shadow-lg"
            >
              로그인
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-[#8C8C8C] hover:text-[#5B3BFA] transition-colors">
              비밀번호를 잊으셨나요?
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/60 text-sm">
          © 2024 AIFIX. All rights reserved.
        </div>
      </div>
    </div>
  );
}
