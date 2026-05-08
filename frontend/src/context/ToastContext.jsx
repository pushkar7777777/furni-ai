/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

const ToastContext = createContext(null);

const variants = {
  success: { border: "border-emerald-400/20", bg: "bg-emerald-500/10", text: "text-emerald-50", icon: CheckCircle2 },
  error: { border: "border-red-400/20", bg: "bg-red-500/10", text: "text-red-50", icon: TriangleAlert },
  info: { border: "border-sky-400/20", bg: "bg-sky-500/10", text: "text-sky-50", icon: Info }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const addToast = ({ title, message, variant = "info" }) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, title, message, variant }]);
    window.setTimeout(() => removeToast(id), 3200);
  };

  const value = useMemo(() => ({ addToast, removeToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-24 z-[100] flex w-[min(92vw,24rem)] flex-col gap-3">
        {toasts.map((toast) => {
          const styles = variants[toast.variant] || variants.info;
          const Icon = styles.icon;
          return (
            <div key={toast.id} className={`rounded-2xl border ${styles.border} ${styles.bg} p-4 shadow-xl backdrop-blur-xl`}>
              <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-5 w-5 ${styles.text}`} />
                <div className="flex-1">
                  {toast.title ? <p className={`text-sm font-bold ${styles.text}`}>{toast.title}</p> : null}
                  <p className={`text-sm ${styles.text}`}>{toast.message}</p>
                </div>
                <button type="button" onClick={() => removeToast(toast.id)} className="text-white/60 transition hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
