import React, { useEffect } from 'react';
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
  X,
  ChevronRight,
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

interface NavSection {
  title: string;
  items: {
    id: NavRoute;
    label: string;
    icon: React.ReactNode;
    tag?: string;
    tagVariant?: 'indigo' | 'emerald' | 'amber';
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { logout, isDemo, user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  const navSections: NavSection[] = [
    {
      title: 'Navigation',
      items: [
        {
          id: 'get_started',
          label: 'Get Started',
          icon: <Sparkles className="w-4 h-4 text-indigo-500" />,
          tag: 'START',
          tagVariant: 'indigo',
        },
        {
          id: 'dashboard',
          label: 'Command Center',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Career Engine',
      items: [
        {
          id: 'resume',
          label: 'ATS Resume Analyzer',
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: 'jobs',
          label: 'Semantic Job Match',
          icon: <Target className="w-4 h-4" />,
        },
        {
          id: 'skills',
          label: 'Skill Gap Matrix',
          icon: <Compass className="w-4 h-4" />,
        },
        {
          id: 'roadmap',
          label: 'Learning Roadmap',
          icon: <Map className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'AI Practice & Mentorship',
      items: [
        {
          id: 'interview',
          label: 'Mock Interview Room',
          icon: <MessageSquareCode className="w-4 h-4" />,
          tag: 'SIM',
          tagVariant: 'indigo',
        },
        {
          id: 'questions',
          label: 'Question Bank',
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          id: 'chat',
          label: 'AI Career Chat',
          icon: <Bot className="w-4 h-4 text-emerald-500" />,
          tag: 'AI',
          tagVariant: 'emerald',
        },
      ],
    },
    {
      title: 'Workspace',
      items: [
        {
          id: 'history',
          label: 'Activity History',
          icon: <History className="w-4 h-4" />,
        },
        {
          id: 'profile',
          label: 'Profile & Targets',
          icon: <UserCircle className="w-4 h-4" />,
        },
        {
          id: 'about',
          label: 'Platform Story',
          icon: <Info className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
        aria-label="Main sidebar navigation"
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200/80 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              onNavigate('dashboard');
              onCloseMobile();
            }}
            className="flex items-center gap-3 text-left group cursor-pointer"
            title="Go to Command Center"
          >
            <img
              src="/logo.png"
              alt="CareerPilot AI Logo"
              className="w-8 h-8 rounded-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform object-cover"
            />
            <div>
              <h1 className="font-extrabold text-sm tracking-normal text-slate-900 dark:text-white leading-none">
                CareerPilot <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
                Campus Copilot
              </p>
            </div>
          </button>

          {isOpenMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Grouped Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto scrollbar-none">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.title}
              </p>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-indigo-50/90 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 shadow-subtle font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`shrink-0 ${
                            isActive
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.tag && (
                        <span
                          className={`ml-2 px-1.5 py-0.2 rounded text-[9px] font-black tracking-wider uppercase shrink-0 ${
                            item.tagVariant === 'emerald'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          {item.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Demo Mode & User Footer */}
        <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2.5 bg-slate-50/50 dark:bg-slate-900/50">
          {isDemo && (
            <div className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                Demo Student Mode
              </span>
              <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80 mt-0.5 leading-snug">
                Full AI features enabled with local mock telemetry.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0 shadow-subtle">
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
              type="button"
              onClick={logout}
              title="Log out"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
