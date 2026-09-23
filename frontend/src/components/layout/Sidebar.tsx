import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Target,
  Compass,
  Map,
  MessageSquareCode,
  BookOpen,
  History,
  UserCircle,
  LogOut,
  Sparkles,
  Bot,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type NavRoute =
  | 'get_started'
  | 'dashboard'
  | 'resume'
  | 'jobs'
  | 'skills'
  | 'roadmap'
  | 'interview'
  | 'questions'
  | 'chat'
  | 'history'
  | 'profile'
  | 'about';

interface SidebarProps {
  currentRoute: NavRoute;
  onNavigate: (route: NavRoute) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { logout, isDemo, user } = useAuth();

  const navItems = [
    { id: 'get_started' as NavRoute, label: 'Get Started', icon: <Sparkles className="w-5 h-5 text-indigo-500" /> },
    { id: 'dashboard' as NavRoute, label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'resume' as NavRoute, label: 'Resume Analyzer', icon: <FileText className="w-5 h-5" /> },
    { id: 'jobs' as NavRoute, label: 'Job Match', icon: <Target className="w-5 h-5" /> },
    { id: 'skills' as NavRoute, label: 'Skill Gaps', icon: <Compass className="w-5 h-5" /> },
    { id: 'roadmap' as NavRoute, label: 'Learning Roadmap', icon: <Map className="w-5 h-5" /> },
    { id: 'interview' as NavRoute, label: 'Interview Simulator', icon: <MessageSquareCode className="w-5 h-5" /> },
    { id: 'questions' as NavRoute, label: 'Question Bank', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'chat' as NavRoute, label: 'AI Career Chat', icon: <Bot className="w-5 h-5" /> },
    { id: 'history' as NavRoute, label: 'History', icon: <History className="w-5 h-5" /> },
    { id: 'profile' as NavRoute, label: 'Profile', icon: <UserCircle className="w-5 h-5" /> },
    { id: 'about' as NavRoute, label: 'About Us', icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header (Click to return Home / Dashboard) */}
        <button
          type="button"
          onClick={() => {
            onNavigate('dashboard');
            onCloseMobile();
          }}
          className="h-16 flex items-center gap-3 px-6 border-b border-slate-200/80 dark:border-slate-800/80 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors w-full cursor-pointer group"
          title="Return to Dashboard Home"
        >
          <img
            src="/logo.png"
            alt="CareerPilot AI"
            className="w-9 h-9 rounded-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform object-cover"
          />
          <div>
            <h1 className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none">
              CareerPilot <span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">
              Placement Copilot
            </p>
          </div>
        </button>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className={`${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
                {item.id === 'interview' && (
                  <span className="ml-auto px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded">
                    AI
                  </span>
                )}
                {item.id === 'chat' && (
                  <span className="ml-auto px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/80 dark:text-emerald-300 rounded">
                    AI CHAT
                  </span>
                )}
                {item.id === 'get_started' && (
                  <span className="ml-auto px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 rounded">
                    START
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Demo Mode & User Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
          {isDemo && (
            <div className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Demo Student Mode
              </span>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                Full AI features enabled with local vector matching.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 uppercase flex-shrink-0">
                {user?.profile?.name ? user.profile.name[0] : 'S'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {user?.profile?.name || 'Student'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
