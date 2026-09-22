import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-indigo-500" />,
  };

  const bgStyles = {
    success: 'border-emerald-200 bg-emerald-50/90 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-200',
    error: 'border-rose-200 bg-rose-50/90 text-rose-900 dark:bg-rose-950/80 dark:border-rose-800 dark:text-rose-200',
    info: 'border-indigo-200 bg-indigo-50/90 text-indigo-900 dark:bg-indigo-950/80 dark:border-indigo-800 dark:text-indigo-200',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md ${bgStyles[toast.type]}`}>
        {icons[toast.type]}
        <p className="text-sm font-semibold">{toast.message}</p>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:opacity-75 focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
