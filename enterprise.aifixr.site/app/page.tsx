'use client';

import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { EnterpriseDashboard } from './components/EnterpriseDashboard';
import { SMEList } from './components/SMEList';
import { CompanyDetail } from './components/CompanyDetail';
import { ReportViewer } from './components/ReportViewer';
import { ReportCenter } from './components/ReportCenter';
import { NotificationCenter } from './components/NotificationCenter';
import { ProfilePage } from './components/ProfilePage';

type Screen = 'login' | 'dashboard' | 'sme-list' | 'company-detail' | 'report-viewer' | 'report-center' | 'notifications' | 'profile';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication from localStorage
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      setCurrentScreen('dashboard');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen('dashboard');
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleNavigate = (screen: Screen, companyId?: string, reportId?: string) => {
    setCurrentScreen(screen);
    if (companyId) setSelectedCompanyId(companyId);
    if (reportId) setSelectedReportId(reportId);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen('login');
    setSelectedCompanyId(null);
    setSelectedReportId(null);
    localStorage.removeItem('isAuthenticated');
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {currentScreen === 'dashboard' && (
        <EnterpriseDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentScreen === 'sme-list' && (
        <SMEList onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentScreen === 'company-detail' && selectedCompanyId && (
        <CompanyDetail 
          companyId={selectedCompanyId} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
        />
      )}
      {currentScreen === 'report-viewer' && selectedReportId && (
        <ReportViewer 
          reportId={selectedReportId} 
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === 'report-center' && (
        <ReportCenter onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentScreen === 'notifications' && (
        <NotificationCenter onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentScreen === 'profile' && (
        <ProfilePage onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
    </div>
  );
}
