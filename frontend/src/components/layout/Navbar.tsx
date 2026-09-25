import React from 'react';
import { Menu, Sun, Moon, Sparkles, User, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NavRoute } from './Sidebar';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onNavigate: (route: NavRoute) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onGoBack?: () => void;
  onGoForward?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  canGoBack = false,
  canGoForward = false,
  onGoBack,
  onGoForward,
}) => {
  const { user, isDemo } = useAuth();

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-3.5 sm:px-8 flex items-center justify-between w-full shadow-subtle transition-colors">
      {/* Left side: Hamburger (mobile) + Arrow Keys + Target role badge */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95 transition-all cursor-pointer"
          title="Open Menu"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Navigation Arrow Keys (Back & Forward) */}
        <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-subtle">
          <button
            type="button"
            onClick={onGoBack}
            disabled={!canGoBack}
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer focus-visible:outline-none"
            title="Go Back (Previous Page)"
            aria-label="Go back to previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onGoForward}
            disabled={!canGoForward}
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer focus-visible:outline-none"
            title="Go Forward (Next Page)"
            aria-label="Go forward to next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Target Role & Demo Indicator */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/70 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-subtle">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="text-slate-400 dark:text-slate-500">Target:</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {user?.profile?.target_role || 'Software Developer'}
            </span>
          </div>

          {isDemo && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Demo Mode
            </span>
          )}
        </div>
      </div>

      {/* Right side: Get Started CTA + Dark mode toggle + User profile shortcut */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onNavigate('get_started')}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs shadow-sm hover:shadow-indigo-500/20 transition-all cursor-pointer border border-transparent"
          title="Go directly to Get Started guide"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Get Started</span>
        </button>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer active:scale-95"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 pl-1.5 pr-2.5 sm:pr-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
          aria-label="View user profile"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-subtle ring-2 ring-indigo-500/20">
            {user?.profile?.name ? user.profile.name[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
          </div>
          <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200">
            {user?.profile?.name || 'My Profile'}
          </span>
        </button>
      </div>
    </header>
  );
};
