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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-4xl max-h-[95vh] sm:max-h-[90vh]"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
              {/* Header */}
              <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white pr-2">
                  Cookie-Einstellungen
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors flex-shrink-0 touch-manipulation"
                  aria-label="Schließen"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6 overflow-y-auto flex-1">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                  Hier können Sie Ihre Cookie-Einstellungen anpassen. Wir
                  respektieren Ihre Privatsphäre.
                </p>

                <div className="space-y-3 sm:space-y-4">
                  {COOKIE_CATEGORIES.map((category) => {
                    const isSelected =
                      selectedCategories[
                        category.id as keyof typeof selectedCategories
                      ];

                    return (
                      <div
                        key={category.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6"
                      >
                        <div className="flex items-start justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                              <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                                {category.name}
                              </h3>
                              {category.required && (
                                <span className="px-2 py-0.5 sm:py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full whitespace-nowrap">
                                  Erforderlich
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 sm:mb-3 leading-relaxed">
                              {category.description}
                            </p>

                            <details className="text-xs sm:text-sm">
                              <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 active:text-blue-800 mb-2 touch-manipulation list-none flex items-center gap-1">
                                <span>Details anzeigen</span>
                                <span className="text-xs">▼</span>
                              </summary>
                              <div className="mt-2 space-y-2 pl-3 sm:pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                {category.cookies.map((cookie, idx) => (
                                  <div
                                    key={idx}
                                    className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm"
                                  >
                                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                                      {cookie.name}
                                    </div>
                                    <div className="text-xs leading-relaxed">
                                      <strong>Zweck:</strong> {cookie.purpose}
                                    </div>
                                    <div className="text-xs leading-relaxed">
                                      <strong>Dauer:</strong> {cookie.duration}
                                    </div>
                                    <div className="text-xs leading-relaxed">
                                      <strong>Anbieter:</strong> {cookie.provider}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>

                          <button
                            onClick={() => toggleCategory(category.id)}
                            disabled={category.required}
                            className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors flex-shrink-0 touch-manipulation ${
                              isSelected
                                ? "bg-blue-600"
                                : "bg-gray-300 dark:bg-gray-600"
                            } ${category.required ? "opacity-50 cursor-not-allowed" : ""}`}
                            aria-label={`${category.name} ${isSelected ? 'deaktivieren' : 'aktivieren'}`}
                          >
                            <span
                              className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform ${
                                isSelected ? "translate-x-6 sm:translate-x-7" : "translate-x-1"
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
              <div className="p-4 sm:p-5 md:p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2 sm:gap-2.5 md:gap-3 flex-shrink-0">
                <button
                  onClick={handleRejectOptional}
                  className="w-full px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 active:bg-gray-400 dark:active:bg-gray-600 font-medium transition-colors text-sm sm:text-base touch-manipulation"
                >
                  Nur essenzielle
                </button>
                <button
                  onClick={handleSave}
                  className="w-full px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 font-medium transition-colors shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Auswahl speichern
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="w-full px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg sm:rounded-xl hover:from-green-700 hover:to-green-800 active:from-green-800 active:to-green-900 font-medium transition-colors shadow-lg text-sm sm:text-base touch-manipulation"
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
