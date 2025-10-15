"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, Clock } from "lucide-react";

interface ReservationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Settings {
  contact_phone?: string;
  contact_phone_formatted?: string;
  reservation_note?: string;
  reservation_message?: string;
}

export function ReservationPopup({ isOpen, onClose }: ReservationPopupProps) {
  const [settings, setSettings] = useState<Settings>({
    contact_phone: '09938 2320307',
    contact_phone_formatted: '+4909938230307',
    reservation_note: 'Reservierungen sind aus organisatorischen Gründen ausschließlich telefonisch möglich',
    reservation_message: 'Wir freuen uns auf Ihren Anruf und nehmen Ihre Reservierung gerne persönlich entgegen!'
  });

  // Fetch settings
  useEffect(() => {
    fetch('/api/settings?category=contact', {
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(prev => ({ ...prev, ...data.data.settings }));
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent background scrolling when popup is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.3,
            }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-slate-900 rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors"
                  aria-label="Schließen"
                >
                  <X size={20} />
                </button>

                <h2 className="text-2xl font-serif text-white">
                  Tischreservierung
                </h2>
              </div>

              {/* Content */}
              <div className="p-8 bg-white dark:bg-slate-900">
                <div className="space-y-6">
                  {/* Info Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                  >
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                      {settings.reservation_note}
                    </p>
                  </motion.div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 dark:border-slate-700"></div>

                  {/* Contact Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-4"
                  >
                    <p className="text-gray-600 dark:text-gray-400">
                      Sie erreichen uns unter:
                    </p>

                    {/* Phone Number */}
                    <a
                      href={`tel:${settings.contact_phone_formatted?.replace(/[^+\d]/g, '')}`}
                      className="inline-flex items-center justify-center space-x-3 px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 group"
                    >
                      <Phone
                        className="text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors"
                        size={24}
                      />
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {settings.contact_phone}
                      </span>
                    </a>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {settings.reservation_message}
                    </p>
                  </motion.div>

                  {/* Opening Hours Hint */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 text-sm"
                  >
                    <Clock size={14} />
                    <span>
                      Unsere aktuellen Öffnungszeiten finden Sie auf der
                      Startseite
                    </span>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-3"
                  >
                    <a
                      href={`tel:${settings.contact_phone_formatted?.replace(/[^+\d]/g, '')}`}
                      className="flex-1 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Phone size={18} />
                      <span>Jetzt anrufen</span>
                    </a>
                    <button
                      onClick={onClose}
                      className="flex-1 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      Schließen
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
