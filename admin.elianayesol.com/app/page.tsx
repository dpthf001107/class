"use client";

import { useState } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { Dashboard } from "@/components/Dashboard";
import { CorporateManagement } from "@/components/CorporateManagement";
import { UserManagement } from "@/components/UserManagement";
import { BillingManagement } from "@/components/BillingManagement";
import { MetricsManagement } from "@/components/MetricsManagement";
import { AuditLogs } from "@/components/AuditLogs";
import { SystemNotifications } from "@/components/SystemNotifications";
import type { User, UserRole } from "@/types";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string>("login");

  const handleLogin = (email: string, password: string, role: UserRole) => {
    // Mock login logic
    setCurrentUser({
      email,
      role,
      name: role === "Super Admin" ? "관리자" : "사용자",
    });
    setCurrentScreen("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen("login");
  };

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {currentScreen === "dashboard" && (
        <Dashboard
          user={currentUser}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === "corporate" && (
        <CorporateManagement
          user={currentUser}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === "users" && (
        <UserManagement
          user={currentUser}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === "billing" && (
        <BillingManagement
          user={currentUser}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === "metrics" && (
        <MetricsManagement
          user={currentUser}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === "audit" && (
        <AuditLogs
          user={currentUser}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === "system" && (
        <SystemNotifications
          user={currentUser}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

