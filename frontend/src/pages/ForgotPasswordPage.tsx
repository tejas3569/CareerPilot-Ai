import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, Sparkles, AlertCircle, Sun, Moon } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { authApi } from '../api/endpoints';
import { getAuthErrorMessage } from '../utils/authErrors';

interface ForgotPasswordPageProps {
  onNavigateLogin: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigateLogin,
  darkMode = false,
  onToggleDarkMode,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your registered email address.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      // 1. Send genuine password reset email via Firebase Auth
      await sendPasswordResetEmail(auth, cleanEmail);
      setSubmitted(true);
    } catch (fbErr: any) {
      console.warn('Firebase password reset notice:', fbErr);
      // Fallback: try backend API as secondary attempt
      try {
        await authApi.forgotPassword(cleanEmail);
        setSubmitted(true);
      } catch {
        setError(getAuthErrorMessage(fbErr));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative transition-colors">
      {onToggleDarkMode && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
          </button>
        </div>
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img
          src="/logo.png"
          alt="CareerPilot AI"
          className="mx-auto w-14 h-14 rounded-2xl shadow-xl shadow-indigo-500/25 mb-4 object-cover"
        />
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Enter your registered email to receive password reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                A password reset email has been sent to <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>. Please check your inbox and spam folder, and click the link to reset your password.
              </p>
              <Button
                variant="outline"
                size="md"
                onClick={onNavigateLogin}
                className="mt-6 w-full"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  University / Personal Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Send Password Reset Link
              </Button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
