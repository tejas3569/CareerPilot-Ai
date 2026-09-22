import React, { useState } from 'react';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateRegister,
  onNavigateForgotPassword,
  onSuccess,
}) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsDemoLoading(true);
    try {
      await demoLogin();
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to start demo session.');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none mb-4">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Sign In to CareerPilot <span className="text-indigo-600 dark:text-indigo-400">AI</span>
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Prepare smarter for your campus placements & internships.
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onNavigateForgotPassword}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold tracking-wider">
                Or Instant Preview
              </span>
            </div>
          </div>

          {/* Quick Demo Login */}
          <Button
            type="button"
            variant="outline"
            size="md"
            isLoading={isDemoLoading}
            onClick={handleDemoLogin}
            className="w-full border-amber-300/80 dark:border-amber-700/60 bg-amber-50/50 hover:bg-amber-100/60 text-amber-900 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 dark:text-amber-200"
            leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
          >
            Try Demo Student Account (Alex Chen)
          </Button>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={onNavigateRegister}
              className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Sign Up Free
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
