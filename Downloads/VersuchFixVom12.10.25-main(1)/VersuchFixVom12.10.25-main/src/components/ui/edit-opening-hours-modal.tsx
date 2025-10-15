"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Clock } from "lucide-react";

interface OpeningHour {
  id: number;
  day: string;
  open_time_1: string | null;
  close_time_1: string | null;
  open_time_2: string | null;
  close_time_2: string | null;
  closed: boolean;
}

interface EditOpeningHoursModalProps {
  isOpen: boolean;
  hour: OpeningHour | null;
  onClose: () => void;
  onSave: (hour: OpeningHour) => void;
  onChange: (field: keyof OpeningHour, value: string | number | boolean | null) => void;
}

export function EditOpeningHoursModal({
  isOpen,
  hour,
  onClose,
  onSave,
  onChange
}: EditOpeningHoursModalProps) {
  if (!hour) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 m-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Clock className="w-6 h-6 mr-2" />
                    {hour.day} bearbeiten
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Öffnungszeiten anpassen
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Geschlossen Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <label className="text-gray-900 dark:text-white font-medium">
                    Geschlossen
                  </label>
                  <button
                    onClick={() => onChange('closed', !hour.closed)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      hour.closed ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        hour.closed ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {!hour.closed && (
                  <>
                    {/* Erste Öffnungszeit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Vormittags/Hauptöffnungszeit
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="time"
                          value={hour.open_time_1 || ''}
                          onChange={(e) => onChange('open_time_1', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="time"
                          value={hour.close_time_1 || ''}
                          onChange={(e) => onChange('close_time_1', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Zweite Öffnungszeit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nachmittags/Abends (optional)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="time"
                          value={hour.open_time_2 || ''}
                          onChange={(e) => onChange('open_time_2', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="time"
                          value={hour.close_time_2 || ''}
                          onChange={(e) => onChange('close_time_2', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => onSave(hour)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Speichern
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

