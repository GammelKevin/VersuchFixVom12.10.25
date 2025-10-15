"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  RotateCcw,
  Calendar,
  RefreshCw
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

interface VisitorStats {
  today: { unique_visitors: number; total_visits: number };
  month: { unique_visitors: number; total_visits: number };
  year: { unique_visitors: number; total_visits: number };
  allTime: { unique_visitors: number; total_visits: number };
  recentVisitors: Array<{
    ip_address: string;
    page_visited: string;
    visit_time: string;
    device_type: string;
  }>;
  topPages: Array<{
    page_visited: string;
    visits: number;
  }>;
  hourlyStats: Array<{
    hour: string;
    visits: number;
  }>;
}

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStatistics();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchStatistics, 30000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStatistics = async () => {
    try {
      if (!loading) setRefreshing(true);
      const response = await fetch('/api/visitors');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        setError(null);
      } else {
        setError(data.error || 'Fehler beim Laden der Statistiken');
      }
    } catch (err) {
      setError('Fehler beim Laden der Statistiken');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Möchten Sie wirklich alle Besucherstatistiken zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      try {
        setRefreshing(true);
        const response = await fetch('/api/visitors?confirm=true', {
          method: 'DELETE',
        });
        const data = await response.json();
        
        if (data.success) {
          alert('Statistiken wurden erfolgreich zurückgesetzt');
          fetchStatistics();
        } else {
          alert('Fehler beim Zurücksetzen: ' + data.error);
        }
      } catch (error) {
        console.error('Reset error:', error);
        alert('Fehler beim Zurücksetzen der Statistiken');
      } finally {
        setRefreshing(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Statistiken...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Fehler: {error}</p>
          <button 
            onClick={fetchStatistics}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('de-DE');
  };

  const statCards = [
    {
      title: "Heute",
      unique: stats.today.unique_visitors,
      total: stats.today.total_visits,
      icon: <Clock className="w-5 h-5" />,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Dieser Monat",
      unique: stats.month.unique_visitors,
      total: stats.month.total_visits,
      icon: <Calendar className="w-5 h-5" />,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      title: "Dieses Jahr",
      unique: stats.year.unique_visitors,
      total: stats.year.total_visits,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Gesamt",
      unique: stats.allTime.unique_visitors,
      total: stats.allTime.total_visits,
      icon: <Globe className="w-5 h-5" />,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600 dark:text-orange-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Zurück zum Dashboard
              </Link>
              <div className="border-l border-gray-300 dark:border-gray-600 h-6"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Besucherstatistiken
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Echtzeit-Übersicht Ihrer Website-Besucher
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeSwitcher />
              
              <button
                onClick={fetchStatistics}
                disabled={refreshing}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${
                  refreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Aktualisieren
              </button>
              
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.unique}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Unique
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg bg-gray-50 dark:bg-slate-700`}>
                    <div className={stat.textColor}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Seitenaufrufe
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stat.total}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-8">
          {/* Recent Visitors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Letzte Besucher
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {process.env.NODE_ENV === 'development' ? 'Demo-IPs (Dev)' : 'Live-Daten'}
              </span>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {stats.recentVisitors.map((visitor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                      {visitor.device_type === 'Mobile' ? (
                        <Smartphone className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-mono text-gray-900 dark:text-white">
                        {visitor.ip_address}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {visitor.page_visited}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(visitor.visit_time)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {visitor.device_type}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}