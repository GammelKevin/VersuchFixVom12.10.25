"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, Phone, MapPin, Loader2 } from "lucide-react";

interface OpeningHour {
  id: number;
  day: string;
  open_time_1: string | null;
  close_time_1: string | null;
  open_time_2: string | null;
  close_time_2: string | null;
  closed: boolean | number;
}

interface VacationSettings {
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
}

export function OpeningHours() {
  const [hours, setHours] = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [vacation, setVacation] = useState<VacationSettings | null>(null);
  const [settings, setSettings] = useState({
    contact_phone: '09938 / 23 203 07',
    contact_phone_formatted: '+4909938230307',
    contact_address_street: 'Bundesstraße 39',
    contact_address_city: '94554 Moos, Niederbayern'
  });

  useEffect(() => {
    fetchOpeningHours();
    fetchSettings();
    fetchVacation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings?category=contact', {
        cache: 'no-store'
      });
      const data = await response.json();
      if (data.success) {
        setSettings(prev => ({ ...prev, ...data.data.settings }));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const fetchOpeningHours = async () => {
    try {
      const response = await fetch("/api/opening-hours");
      const data = await response.json();

      if (data.success && data.data) {
        setHours(data.data);
      } else {
        // Use fallback data
        setHours(getDefaultHours());
      }
    } catch (err) {
      console.error("Error fetching hours:", err);
      setHours(getDefaultHours());
    } finally {
      setLoading(false);
    }
  };

  const fetchVacation = async () => {
    try {
      const response = await fetch("/api/vacation");
      const data = await response.json();

      if (data.success && data.data) {
        setVacation(data.data);
      }
    } catch (err) {
      console.error("Error fetching vacation:", err);
    }
  };

  const getDefaultHours = (): OpeningHour[] => [
    {
      id: 1,
      day: "Montag",
      open_time_1: "17:30",
      close_time_1: "23:00",
      open_time_2: null,
      close_time_2: null,
      closed: false,
    },
    {
      id: 2,
      day: "Dienstag",
      open_time_1: "17:30",
      close_time_1: "23:00",
      open_time_2: null,
      close_time_2: null,
      closed: false,
    },
    {
      id: 3,
      day: "Mittwoch",
      open_time_1: "17:30",
      close_time_1: "23:00",
      open_time_2: null,
      close_time_2: null,
      closed: false,
    },
    {
      id: 4,
      day: "Donnerstag",
      open_time_1: "17:30",
      close_time_1: "23:00",
      open_time_2: null,
      close_time_2: null,
      closed: false,
    },
    {
      id: 5,
      day: "Freitag",
      open_time_1: "17:30",
      close_time_1: "23:00",
      open_time_2: null,
      close_time_2: null,
      closed: false,
    },
    {
      id: 6,
      day: "Samstag",
      open_time_1: "17:30",
      close_time_1: "23:00",
      open_time_2: null,
      close_time_2: null,
      closed: false,
    },
    {
      id: 7,
      day: "Sonntag",
      open_time_1: "11:30",
      close_time_1: "14:30",
      open_time_2: "17:30",
      close_time_2: "23:00",
      closed: false,
    },
  ];

  // Helper to format time string (remove seconds from HH:MM:SS)
  const formatTime = (time: string | number | null | undefined): string => {
    if (!time) return "";
    const timeStr = String(time).trim();
    // Remove seconds: "17:00:00" → "17:00"
    return timeStr.substring(0, 5);
  };

  const formatTimeString = (hour: OpeningHour): string => {
    // Check if closed
    if (hour.closed || hour.closed === 1) return "Geschlossen";

    // Helper to check if a time value is valid
    const isValidTime = (time: string | number | null | undefined): boolean => {
      if (!time) return false;
      const timeStr = String(time).trim();
      return timeStr !== "" && timeStr !== "0" && timeStr !== "null";
    };

    // Build time string
    let result = "";

    if (isValidTime(hour.open_time_1) && isValidTime(hour.close_time_1)) {
      result = `${formatTime(hour.open_time_1)} - ${formatTime(hour.close_time_1)}`;
    }

    if (isValidTime(hour.open_time_2) && isValidTime(hour.close_time_2)) {
      if (result) {
        result += ` & ${formatTime(hour.open_time_2)} - ${formatTime(hour.close_time_2)}`;
      } else {
        result = `${formatTime(hour.open_time_2)} - ${formatTime(hour.close_time_2)}`;
      }
    }

    return result || "Geschlossen";
  };

  const getCurrentDay = () => {
    const days = [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ];
    return days[new Date().getDay()];
  };

  const currentDay = getCurrentDay();

  if (loading) {
    return (
      <section id="hours" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4">
              Öffnungszeiten
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Wir freuen uns auf Ihren Besuch! Reservierungen sind empfohlen.
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hours" className="py-12 sm:py-16 md:py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-3 sm:mb-4 px-2">
            Öffnungszeiten
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-2 leading-relaxed">
            Wir freuen uns auf Ihren Besuch! Reservierungen sind empfohlen.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Opening Hours Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800 rounded-2xl p-5 sm:p-6 md:p-8"
            >
              {/* Vacation Mode - Replaces Opening Hours */}
              {vacation?.is_active && vacation.start_date && vacation.end_date ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                  <div className="text-center space-y-6">
                    {/* Vacation Icon */}
                    <div className="flex justify-center">
                      <div className="p-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full border-2 border-orange-500/50">
                        <Calendar className="w-16 h-16 text-orange-400" />
                      </div>
                    </div>

                    {/* Vacation Title */}
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">
                        Wir sind im Urlaub
                      </h3>
                      <p className="text-orange-300 text-lg">
                        🏝️ Erholungspause
                      </p>
                    </div>

                    {/* Vacation Dates */}
                    <div className="p-6 bg-orange-600/10 border-2 border-orange-500/30 rounded-xl">
                      <p className="text-gray-300 mb-3">
                        Urlaubszeitraum:
                      </p>
                      <p className="text-2xl font-bold text-white mb-1">
                        {new Date(vacation.start_date).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-gray-400 mb-2">bis</p>
                      <p className="text-2xl font-bold text-white">
                        {new Date(vacation.end_date).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Friendly Message */}
                    <div className="pt-4">
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Wir freuen uns darauf, Sie danach wieder<br />
                        in unserem Restaurant begrüßen zu dürfen!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Normal Opening Hours */}
                  <div className="flex items-center mb-6 sm:mb-8">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mr-3 sm:mr-4 flex-shrink-0" />
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-serif">
                      Unsere Öffnungszeiten
                    </h3>
                  </div>

                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    {hours.map((hour) => {
                      const isToday = hour.day === currentDay;
                      const timeString = formatTimeString(hour);
                      const isClosed = timeString === "Geschlossen";

                      return (
                        <div
                          key={hour.id}
                          className={`flex justify-between items-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors duration-300 ${
                            isToday
                              ? "bg-blue-600/20 border border-blue-500/30"
                              : "hover:bg-gray-700/50"
                          }`}
                        >
                          <span
                            className={`font-semibold text-sm sm:text-base ${isToday ? "text-blue-300" : "text-white"}`}
                          >
                            {hour.day}
                            {isToday && (
                              <span className="ml-1 sm:ml-2 text-xs text-blue-400">
                                (Heute)
                              </span>
                            )}
                          </span>
                          <span
                            className={`text-sm sm:text-base ${isClosed ? "text-red-400" : "text-gray-300"}`}
                          >
                            {timeString}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* General Notice */}
                  <div className="mt-8 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 font-semibold mb-2 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Besondere Hinweise
                    </p>
                    <p className="text-sm text-gray-300">
                      An Feiertagen können sich die Öffnungszeiten ändern. Bitte
                      rufen Sie uns für aktuelle Informationen an.
                    </p>
                  </div>
                </>
              )}
            </motion.div>

            {/* Contact Info Card */}
            <motion.div
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 sm:p-6 md:p-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-serif mb-6 sm:mb-8">
                Reservierung & Kontakt
              </h3>

              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 mt-1 mr-3 sm:mr-4 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1 text-sm sm:text-base">Telefon</p>
                    <a
                      href={`tel:${settings.contact_phone_formatted}`}
                      className="text-blue-100 hover:text-white active:text-white transition-colors duration-300 text-sm sm:text-base touch-manipulation"
                    >
                      {settings.contact_phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mt-1 mr-3 sm:mr-4 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1 text-sm sm:text-base">Adresse</p>
                    <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                      {settings.contact_address_street}
                      <br />
                      {settings.contact_address_city}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-blue-500/30">
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Reservierung empfohlen</h4>
                <p className="text-blue-100 mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed">
                  Sichern Sie sich Ihren Platz in unserem beliebten Restaurant.
                  Wir freuen uns auf Ihren Besuch!
                </p>
                <a
                  href={`tel:${settings.contact_phone_formatted}`}
                  className="inline-block w-full py-2.5 sm:py-3 px-5 sm:px-6 bg-white text-blue-700 rounded-lg font-semibold text-center hover:bg-gray-100 active:bg-gray-200 transition-colors duration-300 touch-manipulation text-sm sm:text-base"
                >
                  Jetzt reservieren
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
