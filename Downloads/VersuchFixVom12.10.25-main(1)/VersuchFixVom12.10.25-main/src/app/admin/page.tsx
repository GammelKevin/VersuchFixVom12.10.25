"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Menu, Settings, BarChart3, Home, Eye, Users, LogOut, Palmtree } from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { WelcomeIntro } from "@/components/ui/welcome-intro";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    categories: 0,
    items: 0,
    todayVisitors: 0
  });
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [greeting, setGreeting] = useState("");
  const [showIntro, setShowIntro] = useState(true); // Start with true
  const [introCompleted, setIntroCompleted] = useState(false);

  useEffect(() => {
    // Set greeting based on time immediately
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Guten Morgen");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Guten Tag");
    } else if (hour >= 18 && hour < 22) {
      setGreeting("Guten Abend");
    } else {
      setGreeting("Gute Nacht");
    }

    // Check if intro should be shown immediately
    const hasShownIntro = sessionStorage.getItem('introShown');
    if (hasShownIntro) {
      setShowIntro(false);
      setIntroCompleted(true);
    }

    // Fetch user and quick stats
    Promise.all([
      fetch('/api/auth').then(r => r.json()),
      fetch('/api/menu').then(r => r.json()),
      fetch('/api/visitors').then(r => r.json())
    ]).then(([userData, menuData, visitorData]) => {
      if (userData.success) {
        setUser(userData.user);
        
        // If intro hasn't been shown, keep it showing
        if (!hasShownIntro) {
          sessionStorage.setItem('introShown', 'true');
        }
      } else {
        // If not authenticated, hide intro immediately
        setShowIntro(false);
        setIntroCompleted(true);
      }
      
      if (menuData.success) {
        setStats(prev => ({
          ...prev,
          categories: menuData.data.categories.length,
          items: menuData.data.total_items
        }));
      }
      if (visitorData.success) {
        setStats(prev => ({
          ...prev,
          todayVisitors: visitorData.data.today.unique_visitors
        }));
      }
    }).catch(console.error);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth', { method: 'DELETE' });
      if (response.ok) {
        // Clear intro flag so it shows again on next login
        sessionStorage.removeItem('introShown');
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const adminCards = [
    {
      title: "Öffnungszeiten verwalten",
      description: "Wöchentliche Öffnungszeiten und Ruhetage festlegen",
      href: "/admin/opening-hours",
      icon: Clock,
      iconColor: "text-slate-600 dark:text-slate-400"
    },
    {
      title: "Urlaubsmodus",
      description: "Globale Urlaubseinstellungen für das gesamte Restaurant",
      href: "/admin/vacation",
      icon: Palmtree,
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Speisekarte verwalten",
      description: "Gerichte hinzufügen, bearbeiten und Kategorien organisieren",
      href: "/admin/menu",
      icon: Menu,
      iconColor: "text-slate-600 dark:text-slate-400"
    },
    {
      title: "Besucherstatistiken",
      description: "Live-Tracking, IP-Adressen und detaillierte Analysen",
      href: "/admin/statistics",
      icon: BarChart3,
      iconColor: "text-slate-600 dark:text-slate-400"
    },
    {
      title: "Benutzerverwaltung",
      description: "Admin-Benutzer verwalten und neue Zugänge erstellen",
      href: "/admin/users",
      icon: Users,
      iconColor: "text-slate-600 dark:text-slate-400"
    },
    {
      title: "Website-Einstellungen",
      description: "Allgemeine Einstellungen und Konfiguration",
      href: "/admin/settings",
      icon: Settings,
      iconColor: "text-slate-600 dark:text-slate-400"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: introCompleted ? 0 : 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1] as const
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <>
      {/* Welcome Intro */}
      {showIntro && (
        <WelcomeIntro
          userName={user?.name || "Admin"}
          greeting={greeting || "Willkommen"}
          onComplete={() => {
            setShowIntro(false);
            setIntroCompleted(true);
          }}
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-lg border-b dark:border-slate-700">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-serif">
                Restaurant ALAS
              </h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: introCompleted ? 0.7 : 0, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-gray-600 dark:text-gray-400 mt-1"
              >
                Admin-Dashboard
              </motion.p>
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeSwitcher />
              
              <Link 
                href="/"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Zur Website
              </Link>
              
              <Link 
                href="/speisekarte"
                target="_blank"
                className="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Vorschau
              </Link>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Quick Stats */}
        <motion.div 
          className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: introCompleted ? 0 : 1 }}
        >
          {[
            { label: "Heutige Besucher", value: stats.todayVisitors, icon: BarChart3 },
            { label: "Menü-Kategorien", value: stats.categories, icon: Menu },
            { label: "Gerichte gesamt", value: stats.items, icon: Menu }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (introCompleted ? 0 : 1.2) + index * 0.1 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{stat.label}</p>
                  <p className="text-3xl font-light text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-xl">
                  <stat.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Admin Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {adminCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link href={card.href}>
                  <motion.div 
                    variants={cardHoverVariants}
                    className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-8 group overflow-hidden relative hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl group-hover:scale-110 transition-all duration-300">
                          <Icon className={`w-8 h-8 ${card.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                        </div>
                        
                        <motion.div 
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ x: 10 }}
                          whileHover={{ x: 0 }}
                        >
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                        </motion.div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                          {card.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                          {card.description}
                        </p>
                      </div>
                      
                      <motion.div 
                        className="mt-6 flex items-center text-gray-500 dark:text-gray-400 text-sm font-medium"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                          Öffnen
                        </span>
                        <motion.span 
                          className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                          initial={{ opacity: 0.5 }}
                          whileHover={{ opacity: 1 }}
                        >
                          →
                        </motion.span>
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          className="mt-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: introCompleted ? 0.3 : 1.8 }}
        >
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: introCompleted ? 0.5 : 2 }}
            >
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Restaurant ALAS Admin
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
                Verwalten Sie Ihre Restaurant-Website effizient. Alle Änderungen werden sofort live auf der Website sichtbar.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-center space-x-2 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: introCompleted ? 0.7 : 2.2 }}
            >
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      </div>
    </>
  );
}