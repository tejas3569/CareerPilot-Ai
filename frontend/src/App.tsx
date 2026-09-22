import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { JobMatchPage } from './pages/JobMatchPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { LearningRoadmapPage } from './pages/LearningRoadmapPage';
import { InterviewSimulatorPage } from './pages/InterviewSimulatorPage';
import { QuestionGeneratorPage } from './pages/QuestionGeneratorPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { GetStartedPage } from './pages/GetStartedPage';
import { ChatBotPage } from './pages/ChatBotPage';
import { AboutPage } from './pages/AboutPage';
import { AppLayout } from './components/layout/AppLayout';
import { NavRoute } from './components/layout/Sidebar';
import { Toast } from './components/common/Toast';
import { ToastMessage } from './types';

type PublicView = 'landing' | 'login' | 'register' | 'forgot_password';

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading, demoLogin } = useAuth();
  const [publicView, setPublicView] = useState<PublicView>('landing');
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('dashboard');
  const [routeHistory, setRouteHistory] = useState<NavRoute[]>(['dashboard']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('careerpilot_theme') === 'dark';
  });
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const navigateTo = (route: NavRoute) => {
    if (route === currentRoute) return;
    const nextHistory = routeHistory.slice(0, historyIndex + 1);
    nextHistory.push(route);
    setRouteHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setCurrentRoute(route);
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setCurrentRoute(routeHistory[prevIdx]);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < routeHistory.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setCurrentRoute(routeHistory[nextIdx]);
    }
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < routeHistory.length - 1;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('careerpilot_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('careerpilot_theme', 'light');
    }
  }, [darkMode]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ id: Math.random().toString(), message, type });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-indigo-600">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated flows
  if (!isAuthenticated) {
    if (publicView === 'login') {
      return (
        <>
          <LoginPage
            onNavigateRegister={() => setPublicView('register')}
            onNavigateForgotPassword={() => setPublicView('forgot_password')}
            onSuccess={() => setCurrentRoute('dashboard')}
          />
          <Toast toast={toast} onClose={() => setToast(null)} />
        </>
      );
    }

    if (publicView === 'register') {
      return (
        <>
          <RegisterPage
            onNavigateLogin={() => setPublicView('login')}
            onSuccess={() => setCurrentRoute('dashboard')}
          />
          <Toast toast={toast} onClose={() => setToast(null)} />
        </>
      );
    }

    if (publicView === 'forgot_password') {
      return (
        <>
          <ForgotPasswordPage onNavigateLogin={() => setPublicView('login')} />
          <Toast toast={toast} onClose={() => setToast(null)} />
        </>
      );
    }

    return (
      <>
        <LandingPage
          onGetStarted={() => setPublicView('register')}
          onTryDemo={async () => {
            try {
              await demoLogin();
              setCurrentRoute('dashboard');
            } catch {
              showToast('Demo mode initialization failed', 'error');
            }
          }}
          onLogin={() => setPublicView('login')}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // Authenticated App with Sidebar Layout
  return (
    <>
      <AppLayout
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
      >
        {currentRoute === 'get_started' && (
          <GetStartedPage onNavigate={navigateTo} />
        )}
        {currentRoute === 'dashboard' && (
          <DashboardPage onNavigate={navigateTo} />
        )}
        {currentRoute === 'resume' && (
          <ResumeAnalyzerPage
            onShowToast={showToast}
            onNavigateRoadmap={() => navigateTo('roadmap')}
          />
        )}
        {currentRoute === 'jobs' && (
          <JobMatchPage
            onShowToast={showToast}
            onNavigateRoadmap={() => navigateTo('roadmap')}
            onNavigateResume={() => navigateTo('resume')}
          />
        )}
        {currentRoute === 'skills' && (
          <SkillGapPage
            onShowToast={showToast}
            onNavigateRoadmap={() => navigateTo('roadmap')}
          />
        )}
        {currentRoute === 'roadmap' && (
          <LearningRoadmapPage onShowToast={showToast} />
        )}
        {currentRoute === 'interview' && (
          <InterviewSimulatorPage onShowToast={showToast} />
        )}
        {currentRoute === 'questions' && (
          <QuestionGeneratorPage onShowToast={showToast} />
        )}
        {currentRoute === 'chat' && (
          <ChatBotPage onShowToast={showToast} />
        )}
        {currentRoute === 'history' && (
          <HistoryPage onNavigate={navigateTo} />
        )}
        {currentRoute === 'profile' && (
          <ProfilePage onShowToast={showToast} />
        )}
        {currentRoute === 'about' && (
          <AboutPage
            onNavigateGetStarted={() => navigateTo('get_started')}
            onNavigateChat={() => navigateTo('chat')}
          />
        )}
      </AppLayout>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
