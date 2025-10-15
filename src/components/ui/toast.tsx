"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />
};

const toastColors = {
  success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
  error: "bg-gradient-to-r from-red-500 to-rose-600 text-white",
  info: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
  warning: "bg-gradient-to-r from-yellow-500 to-orange-600 text-white"
};

export function Toast({ toast, onClose }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (toast.duration && toast.duration > 0 && !isPaused) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration);

      // Progress bar animation
      const interval = setInterval(() => {
        setProgress((prev) => {
          const decrement = (100 / (toast.duration || 4000)) * 50;
          return Math.max(0, prev - decrement);
        });
      }, 50);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [toast, onClose, isPaused]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-sm ${toastColors[toast.type]} min-w-[320px] max-w-md overflow-hidden`}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
        <div
          className="h-full bg-white transition-all duration-50 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-shrink-0">
        {toastIcons[toast.type]}
      </div>

      <p className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</p>

      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors"
        aria-label="Schließen"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
