import React, { useState, ReactNode } from 'react';
import { Sidebar, NavRoute } from './Sidebar';
import { Navbar } from './Navbar';

interface AppLayoutProps {
  children: ReactNode;
  currentRoute: NavRoute;
  onNavigate: (route: NavRoute) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onGoBack?: () => void;
  onGoForward?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentRoute,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#FAF5EE] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 w-full">
        <Navbar
          onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onNavigate={onNavigate}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onGoBack={onGoBack}
          onGoForward={onGoForward}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
