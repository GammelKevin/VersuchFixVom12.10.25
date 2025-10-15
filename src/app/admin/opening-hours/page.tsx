"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  X,
  Edit2,
  Loader2,
  Moon,
  Coffee,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

interface OpeningHour {
  id: number;
  day: string;
  open_time_1: string | null;
  close_time_1: string | null;
  open_time_2: string | null;
  close_time_2: string | null;
  closed: boolean | number;
}

export default function AdminOpeningHoursPage() {
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingHour, setEditingHour] = useState<OpeningHour | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOpeningHours();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOpeningHours = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/opening-hours");
      const data = await response.json();

      if (data.success) {
        setOpeningHours(data.data);
      } else {
        showToast("Fehler beim Laden der Öffnungszeiten", "error");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("Verbindungsfehler", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hour: OpeningHour) => {
    setEditingId(hour.id);
    setEditingHour({ ...hour });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingHour(null);
  };

  const handleSave = async () => {
    if (!editingHour) return;

    try {
      setSaveLoading(true);

      // Clean up the data before sending
      const cleanedHour = {
        ...editingHour,
        closed: editingHour.closed ? 1 : 0,
        // Convert empty strings to null
        open_time_1: editingHour.open_time_1?.trim() || null,
        close_time_1: editingHour.close_time_1?.trim() || null,
        open_time_2: editingHour.open_time_2?.trim() || null,
        close_time_2: editingHour.close_time_2?.trim() || null,
      };

      const response = await fetch("/api/opening-hours", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedHour),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showToast("Öffnungszeiten erfolgreich aktualisiert", "success");
          fetchOpeningHours();
          setEditingId(null);
          setEditingHour(null);
        } else {
          showToast(data.message || "Fehler beim Speichern", "error");
        }
      } else {
        showToast("Fehler beim Speichern", "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast("Fehler beim Speichern", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleFieldChange = (field: keyof OpeningHour, value: string | number | boolean | null) => {
    if (!editingHour) return;
    setEditingHour({ ...editingHour, [field]: value });
  };

  const formatTime = (time: string | null): string => {
    if (!time) return "";
    // Remove seconds from time format (HH:mm:ss -> HH:mm)
    return time.substring(0, 5);
  };

  const formatTimeDisplay = (hour: OpeningHour): string => {
    // Handle boolean/number conversion for closed
    const isClosed = hour.closed === true || hour.closed === 1;

    if (isClosed) return "Geschlossen";

    const hasTime1 = hour.open_time_1 && hour.close_time_1;
    const hasTime2 = hour.open_time_2 && hour.close_time_2;

    let timeStr = "";
    if (hasTime1) {
      timeStr = `${formatTime(hour.open_time_1)} - ${formatTime(hour.close_time_1)}`;
    }
    if (hasTime2) {
      timeStr += timeStr
        ? ` & ${formatTime(hour.open_time_2)} - ${formatTime(hour.close_time_2)}`
        : `${formatTime(hour.open_time_2)} - ${formatTime(hour.close_time_2)}`;
    }

    return timeStr || "Keine Zeiten eingetragen";
  };

  const getDayIcon = (day: string) => {
    const icons: { [key: string]: string } = {
      Montag: "💪",
      Dienstag: "✨",
      Mittwoch: "🌟",
      Donnerstag: "⚡",
      Freitag: "🎉",
      Samstag: "🌈",
      Sonntag: "☀️",
    };
    return icons[day] || "📅";
  };

  const isToday = (day: string) => {
    const days = [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ];
    const today = new Date().getDay();
    return days[today] === day;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Lade Öffnungszeiten...
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Öffnungszeiten verwalten
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Bearbeiten Sie die wöchentlichen Öffnungszeiten
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid gap-6">
          {openingHours.map((hour, index) => {
            const isClosed = hour.closed === true || hour.closed === 1;
            const todayHighlight = isToday(hour.day);

            return (
              <motion.div
                key={hour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 transition-all ${
                  editingId === hour.id
                    ? "border-blue-500 dark:border-blue-400 shadow-lg"
                    : todayHighlight
                      ? "border-green-500 dark:border-green-400"
                      : "border-gray-200 dark:border-slate-700"
                }`}
              >
                {editingId === hour.id ? (
                  /* Edit Mode */
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getDayIcon(hour.day)}</span>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {hour.day}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          disabled={saveLoading}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors disabled:opacity-50"
                        >
                          {saveLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Speichern
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Abbrechen
                        </button>
                      </div>
                    </div>

                    {/* Status Controls */}
                    <div className="grid grid-cols-1 gap-4">
                      <label className="flex items-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                        <input
                          type="checkbox"
                          checked={
                            editingHour?.closed === true ||
                            editingHour?.closed === 1
                          }
                          onChange={(e) =>
                            handleFieldChange("closed", e.target.checked)
                          }
                          className="w-5 h-5 text-red-600 rounded focus:ring-red-500 mr-3"
                        />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          🚫 Geschlossen (Ruhetag)
                        </span>
                      </label>
                    </div>

                    {/* Time Inputs */}
                    {!editingHour?.closed && editingHour?.closed !== 1 && (
                        <div className="space-y-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <label className="flex items-center text-sm font-medium text-blue-900 dark:text-blue-300 mb-3">
                              <Coffee className="w-4 h-4 mr-2" />
                              Hauptöffnungszeit
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  Von
                                </label>
                                <input
                                  type="time"
                                  value={editingHour?.open_time_1 || ""}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "open_time_1",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  Bis
                                </label>
                                <input
                                  type="time"
                                  value={editingHour?.close_time_1 || ""}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "close_time_1",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                            <label className="flex items-center text-sm font-medium text-purple-900 dark:text-purple-300 mb-3">
                              <Moon className="w-4 h-4 mr-2" />
                              Zweite Öffnungszeit (optional)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  Von
                                </label>
                                <input
                                  type="time"
                                  value={editingHour?.open_time_2 || ""}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "open_time_2",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  Bis
                                </label>
                                <input
                                  type="time"
                                  value={editingHour?.close_time_2 || ""}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "close_time_2",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  /* View Mode */
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{getDayIcon(hour.day)}</span>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            {hour.day}
                            {todayHighlight && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                                Heute
                              </span>
                            )}
                          </h3>
                          <div className="mt-2 flex items-center gap-3">
                            {isClosed && (
                              <span className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-full">
                                <X className="w-4 h-4 mr-1" />
                                Geschlossen
                              </span>
                            )}
                            {!isClosed && (
                              <span className="text-lg text-gray-700 dark:text-gray-300">
                                {formatTimeDisplay(hour)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEdit(hour)}
                        className="flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Bearbeiten
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
