"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { useCookieConsent } from "@/context/cookie-consent-context";
import { COOKIE_CATEGORIES } from "@/lib/cookie-categories";

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CookieSettingsModal({
  isOpen,
  onClose,
}: CookieSettingsModalProps) {
  const { consent, updateConsent } = useCookieConsent();
  const [selectedCategories, setSelectedCategories] = useState({
    essential: true,
    analytics: false,
  });

  useEffect(() => {
    if (consent) {
      setSelectedCategories(consent);
    }
  }, [consent]);

  const toggleCategory = (categoryId: string) => {
    if (categoryId === "essential") return;
    setSelectedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId as keyof typeof prev],
    }));
  };

  const handleSave = () => {
    updateConsent(selectedCategories);
  };

  const handleAcceptAll = () => {
    updateConsent({
      essential: true,
      analytics: true,
    });
  };

  const handleRejectOptional = () => {
    updateConsent({
      essential: true,
      analytics: false,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-4xl max-h-[90vh] m-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Cookie-Einstellungen
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Hier können Sie Ihre Cookie-Einstellungen anpassen. Wir
                  respektieren Ihre Privatsphäre.
                </p>

                <div className="space-y-4">
                  {COOKIE_CATEGORIES.map((category) => {
                    const isSelected =
                      selectedCategories[
                        category.id as keyof typeof selectedCategories
                      ];

                    return (
                      <div
                        key={category.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {category.name}
                              </h3>
                              {category.required && (
                                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                  Erforderlich
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              {category.description}
                            </p>

                            <details className="text-sm">
                              <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-2">
                                Details anzeigen
                              </summary>
                              <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                {category.cookies.map((cookie, idx) => (
                                  <div
                                    key={idx}
                                    className="text-gray-600 dark:text-gray-400"
                                  >
                                    <div className="font-medium text-gray-900 dark:text-white">
                                      {cookie.name}
                                    </div>
                                    <div className="text-xs">
                                      Zweck: {cookie.purpose}
                                    </div>
                                    <div className="text-xs">
                                      Speicherdauer: {cookie.duration}
                                    </div>
                                    <div className="text-xs">
                                      Anbieter: {cookie.provider}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>

                          <button
                            onClick={() => toggleCategory(category.id)}
                            disabled={category.required}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                              isSelected
                                ? "bg-blue-600"
                                : "bg-gray-300 dark:bg-gray-600"
                            } ${category.required ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                isSelected ? "translate-x-7" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRejectOptional}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                  Nur essenzielle
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Auswahl speichern
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-medium transition-colors shadow-lg"
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
