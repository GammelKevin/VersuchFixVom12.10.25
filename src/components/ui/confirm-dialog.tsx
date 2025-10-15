"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import { useEffect } from "react";

export type ConfirmType = "danger" | "warning" | "info";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  options: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
}

const typeIcons = {
  danger: <AlertCircle className="w-12 h-12 text-red-500" />,
  warning: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
  info: <Info className="w-12 h-12 text-blue-500" />,
};

const typeColors = {
  danger: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
  warning: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
};

export function ConfirmDialog({
  isOpen,
  options,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const type = options.type || "danger";
  const colors = typeColors[type];

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md"
          >
            <div
              className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 ${colors.border} overflow-hidden`}
            >
              {/* Header with Icon */}
              <div className={`${colors.bg} px-6 py-8 border-b ${colors.border}`}>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{typeIcons[type]}</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {options.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed whitespace-pre-line">
                  {options.message}
                </p>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  {options.cancelText || "Abbrechen"}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-4 py-3 ${colors.button} text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  autoFocus
                >
                  {options.confirmText || "Bestätigen"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
