import React, { useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastContext, type ToastType } from './useToast';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[70] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 rounded-[var(--radius-surface)] border border-[var(--color-rule-strong)] bg-[color:var(--color-surface)] px-4 py-3 text-xs text-[color:var(--color-ink)] shadow-2xl max-w-md"
            style={{
              animation: 'toastIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="h-4 w-4 text-[color:var(--color-ok)] shrink-0" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="h-4 w-4 text-[color:var(--color-warning)] shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="h-4 w-4 text-[color:var(--color-instrument)] shrink-0" />
            )}

            <span className="flex-1 leading-relaxed text-[color:var(--color-ink-soft)]">
              {toast.message}
            </span>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="rounded p-1 text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)] transition cursor-pointer"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
