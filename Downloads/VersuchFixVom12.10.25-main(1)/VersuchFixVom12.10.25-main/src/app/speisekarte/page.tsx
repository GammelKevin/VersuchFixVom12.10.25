"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { MenuItemCard } from "@/components/ui/menu-item-card";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_path: string | null;
  vegetarian: boolean;
  vegan: boolean;
  spicy: boolean;
  gluten_free: boolean;
  lactose_free: boolean;
  kid_friendly: boolean;
  alcohol_free: boolean;
  contains_alcohol: boolean;
  homemade: boolean;
  sugar_free: boolean;
  recommended: boolean;
}

interface MenuCategory {
  id: number;
  name: string;
  display_name: string;
  description: string;
  order: number;
  is_drink_category: boolean;
  items: MenuItem[];
}

export default function SpeisekartePage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [settings, setSettings] = useState({
    contact_phone: '09938 / 23 203 07',
    contact_phone_formatted: '+4909938230307',
    contact_email: 'info@restaurant-alas.de'
  });

  useEffect(() => {
    fetchMenuData();

    fetch('/api/settings?category=contact')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(prev => ({ ...prev, ...data.data.settings }));
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  const fetchMenuData = async () => {
    try {
      const response = await fetch("/api/menu", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      const data = await response.json();

      if (data.success) {
        setCategories(data.data.categories);
      } else {
        setError(data.message || "Fehler beim Laden der Speisekarte");
      }
    } catch (err) {
      setError("Fehler beim Laden der Speisekarte");
      console.error("Menu fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Use useMemo for filtered categories to avoid initialization issues
  const filteredCategories = useMemo(() => {
    const filterItems = (items: MenuItem[]) => {
      return items.filter((item) => {
        // Search term filter
        const matchesSearch =
          !searchTerm ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase());

        // Badge filters
        const matchesFilters =
          selectedFilters.length === 0 ||
          selectedFilters.every((filter) => {
            switch (filter) {
              case "vegetarian":
                return item.vegetarian;
              case "vegan":
                return item.vegan;
              case "spicy":
                return item.spicy;
              case "gluten_free":
                return item.gluten_free;
              case "recommended":
                return item.recommended;
              case "homemade":
                return item.homemade;
              default:
                return true;
            }
          });

        return matchesSearch && matchesFilters;
      });
    };

    return categories
      .map((category) => ({
        ...category,
        items: filterItems(category.items),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, searchTerm, selectedFilters]);

  // Auto-expand categories when searching
  useEffect(() => {
    if (searchTerm || selectedFilters.length > 0) {
      // Expand all categories that have matching items
      const categoriesToExpand = new Set<number>();
      filteredCategories.forEach((category) => {
        if (category.items.length > 0) {
          categoriesToExpand.add(category.id);
        }
      });
      setExpandedCategories(categoriesToExpand);
    }
  }, [searchTerm, selectedFilters, filteredCategories]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedFilters([]);
  };

  const getBadges = (item: MenuItem) => {
    const badges = [];
    if (item.vegetarian)
      badges.push({
        name: "Vegetarisch",
        emoji: "🥕",
        color: "bg-green-100 text-green-700",
      });
    if (item.vegan)
      badges.push({
        name: "Vegan",
        emoji: "🌱",
        color: "bg-green-200 text-green-800",
      });
    if (item.spicy)
      badges.push({
        name: "Scharf",
        emoji: "🌶️",
        color: "bg-red-100 text-red-700",
      });
    if (item.gluten_free)
      badges.push({
        name: "Glutenfrei",
        emoji: "🌾",
        color: "bg-yellow-100 text-yellow-700",
      });
    if (item.alcohol_free)
      badges.push({
        name: "Alkoholfrei",
        emoji: "🍺❌",
        color: "bg-blue-100 text-blue-700",
      });
    if (item.contains_alcohol)
      badges.push({
        name: "Enthält Alkohol",
        emoji: "🍺",
        color: "bg-orange-100 text-orange-700",
      });
    if (item.homemade)
      badges.push({
        name: "Hausgemacht",
        emoji: "🏠",
        color: "bg-purple-100 text-purple-700",
      });
    if (item.recommended)
      badges.push({
        name: "Empfehlung",
        emoji: "⭐",
        color: "bg-yellow-100 text-yellow-800",
      });
    return badges;
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Lade Speisekarte...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
          <div className="text-center text-red-600">
            <p>Fehler beim Laden der Speisekarte: {error}</p>
            <button
              onClick={fetchMenuData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 pt-20 transition-colors">
        <div className="container mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white mb-4">
              Unsere Speisekarte
            </h1>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Suchen Sie nach Gerichten, Zutaten oder Beschreibungen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm hover:shadow-md dark:shadow-slate-900/20"
              />
              {(searchTerm || selectedFilters.length > 0) && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                  title="Suche zurücksetzen"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { key: "vegetarian", label: "Vegetarisch", emoji: "🥕" },
                { key: "vegan", label: "Vegan", emoji: "🌱" },
                { key: "spicy", label: "Scharf", emoji: "🌶️" },
                { key: "gluten_free", label: "Glutenfrei", emoji: "🌾" },
                { key: "recommended", label: "Empfehlung", emoji: "⭐" },
                { key: "homemade", label: "Hausgemacht", emoji: "🏠" },
              ].map((filter) => (
                <motion.button
                  key={filter.key}
                  onClick={() => toggleFilter(filter.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedFilters.includes(filter.key)
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md"
                  }`}
                >
                  <span className="mr-1">{filter.emoji}</span>
                  {filter.label}
                </motion.button>
              ))}
            </div>

            {/* Search Results Info */}
            {(searchTerm || selectedFilters.length > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-4"
              >
                {filteredCategories.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400 p-4 bg-gray-100 dark:bg-slate-800 rounded-lg">
                    <p className="font-medium">Keine Gerichte gefunden</p>
                    <p className="text-sm mt-1">
                      Versuchen Sie es mit anderen Suchbegriffen oder Filtern.
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    <span className="font-medium">
                      {filteredCategories.reduce(
                        (total, cat) => total + cat.items.length,
                        0,
                      )}{" "}
                      Gerichte gefunden
                    </span>
                    {searchTerm && ` für "${searchTerm}"`}
                    {selectedFilters.length > 0 &&
                      ` mit ${selectedFilters.length} Filter${selectedFilters.length > 1 ? "n" : ""}`}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Categories */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredCategories.length === 0 &&
            (searchTerm || selectedFilters.length > 0) ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Keine Gerichte gefunden
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    Versuchen Sie es mit anderen Suchbegriffen oder entfernen
                    Sie einige Filter.
                  </p>
                </div>
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Alle Gerichte anzeigen
                </button>
              </motion.div>
            ) : (
              filteredCategories.map((category, index) => {
                const isExpanded = expandedCategories.has(category.id);
                const hasItems = category.items.length > 0;

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden"
                  >
                    {/* Category Header */}
                    <button
                      onClick={() => hasItems && toggleCategory(category.id)}
                      className={`w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                        hasItems
                          ? "hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                          : "cursor-default"
                      } transition-colors duration-200`}
                      disabled={!hasItems}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white font-serif">
                            {category.display_name || category.name}
                          </h2>
                          {category.description && (
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                              {category.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {!hasItems && (
                            <span className="text-sm text-gray-400 dark:text-gray-500">
                              Keine Artikel in dieser Kategorie gefunden.
                            </span>
                          )}
                          {hasItems && (
                            <div className="flex items-center">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Category Items */}
                    <AnimatePresence>
                      {isExpanded && hasItems && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 dark:border-slate-600"
                        >
                          <div className="px-6 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {category.items.map((item) => (
                                <MenuItemCard
                                  key={item.id}
                                  imageUrl={item.image_path}
                                  name={item.name}
                                  description={item.description}
                                  price={item.price}
                                  badges={getBadges(item)}
                                  searchTerm={searchTerm}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <motion.div
            className="text-center mt-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Kontakt
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Haben Sie Fragen zu unseren Gerichten oder benötigen Sie
                Informationen zu Allergenen?
              </p>
              <div className="space-y-2">
                <p className="text-gray-900 dark:text-white">
                  <strong>Telefon:</strong>{" "}
                  <a
                    href={`tel:${settings.contact_phone_formatted}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {settings.contact_phone}
                  </a>
                </p>
                <p className="text-gray-900 dark:text-white">
                  <strong>E-Mail:</strong>{" "}
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {settings.contact_email}
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
