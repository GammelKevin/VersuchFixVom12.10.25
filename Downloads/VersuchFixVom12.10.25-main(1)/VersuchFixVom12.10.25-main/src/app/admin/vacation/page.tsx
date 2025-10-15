"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { parseDate } from "@internationalized/date";
import { JollyDatePicker } from "@/components/ui/date-picker";
import {
  ArrowLeft,
  Calendar,
  Save,
  Loader2,
  Palmtree,
  Info,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

interface VacationSettings {
  id: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminVacationPage() {
  const [settings, setSettings] = useState<VacationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchVacationSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchVacationSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/vacation");
      const data = await response.json();

      if (data.success && data.data) {
        setSettings(data.data);
        setIsActive(data.data.is_active);
        setStartDate(data.data.start_date);
        setEndDate(data.data.end_date);
      } else {
        showToast("Fehler beim Laden der Urlaubseinstellungen", "error");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("Verbindungsfehler", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);

      // Validation
      if (isActive && (!startDate || !endDate)) {
        showToast("Bitte geben Sie Start- und Enddatum ein", "warning");
        return;
      }

      const response = await fetch("/api/vacation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          is_active: isActive,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Urlaubseinstellungen erfolgreich gespeichert", "success");
        fetchVacationSettings();
      } else {
        showToast(data.error || "Fehler beim Speichern", "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast("Fehler beim Speichern", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Convert ISO datetime string to YYYY-MM-DD format for parseDate
  const toDateOnly = (dateStr: string | null): string | null => {
    if (!dateStr) return null;
    try {
      // Extract just the date part (YYYY-MM-DD) from ISO string
      return dateStr.split('T')[0];
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Lade Urlaubseinstellungen...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Zurück
              </Link>
              <div className="border-l border-gray-300 dark:border-gray-600 h-6"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Palmtree className="w-7 h-7 text-orange-500" />
                  Urlaubsmodus
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Globale Urlaubseinstellungen für das gesamte Restaurant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Current Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-6 rounded-xl shadow-lg border-2 ${
              settings?.is_active
                ? "bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700"
                : "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Info className="w-5 h-5" />
                Aktueller Status
              </h2>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  settings?.is_active
                    ? "bg-orange-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {settings?.is_active ? "🏝️ Im Urlaub" : "✅ Geöffnet"}
              </span>
            </div>
            {settings?.is_active && settings.start_date && settings.end_date && (
              <div className="mt-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                  <strong>Urlaubszeitraum:</strong>
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(settings.start_date)} bis{" "}
                  {formatDate(settings.end_date)}
                </p>
              </div>
            )}
          </motion.div>

          {/* Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Einstellungen bearbeiten
            </h2>

            <div className="space-y-6">
              {/* Activate Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div>
                  <label className="text-gray-900 dark:text-white font-medium block mb-1">
                    Urlaubsmodus aktivieren
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Wenn aktiviert, wird auf der Website ein Urlaubshinweis
                    angezeigt
                  </p>
                </div>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    isActive
                      ? "bg-orange-500"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      isActive ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Date Pickers */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Urlaub von
                      </label>
                      <JollyDatePicker
                        value={startDate ? parseDate(toDateOnly(startDate)!) : null}
                        onChange={(date) => setStartDate(date?.toString() || null)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Urlaub bis
                      </label>
                      <JollyDatePicker
                        value={endDate ? parseDate(toDateOnly(endDate)!) : null}
                        onChange={(date) => setEndDate(date?.toString() || null)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {startDate && endDate && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-900 dark:text-blue-300">
                        <strong>Vorschau:</strong> Das Restaurant ist vom{" "}
                        {formatDate(startDate)} bis {formatDate(endDate)} im
                        Urlaub.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  Änderungen speichern
                </button>
              </div>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Hinweis
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Der Urlaubsmodus wird prominent auf der Startseite bei den
              Öffnungszeiten angezeigt. Besucher sehen den Zeitraum und wissen,
              wann das Restaurant wieder öffnet.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
