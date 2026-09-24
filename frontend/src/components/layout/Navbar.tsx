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
    <header className="sticky top-0 z-40 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-8 flex items-center justify-between w-full shadow-xs transition-colors">
      {/* Left side: Hamburger (mobile) + Arrow Keys + Target role badge */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button - The 3 lines menu */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-95 transition-all cursor-pointer"
          title="Open Menu"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Navigation Arrow Keys (Back & Forward) */}
        <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
          <button
            type="button"
            onClick={onGoBack}
            disabled={!canGoBack}
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Go Back (Previous Page)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onGoForward}
            disabled={!canGoForward}
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Go Forward (Next Page)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            <span>Target:</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {user?.profile?.target_role || 'Software Developer'}
            </span>
          </div>

          {isDemo && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-300/60">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Demo AI Mode
            </span>
          )}
        </div>
      </div>

      {/* Right side: Get Started button + Dark mode toggle + User profile shortcut */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onNavigate('get_started')}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer ring-1 ring-indigo-500/30"
          title="Go directly to Get Started guide"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Get Started</span>
        </button>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors focus:outline-none cursor-pointer active:scale-95"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 pl-1.5 pr-2.5 sm:pr-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left focus:outline-none cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-indigo-500/20">
            {user?.profile?.name ? user.profile.name[0] : <User className="w-3.5 h-3.5" />}
          </div>
          <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200">
            {user?.profile?.name || 'My Profile'}
          </span>
        </button>
      </div>
    </header>
  );
};
