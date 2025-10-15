"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  MoreVertical,
  Upload,
} from "lucide-react";
import { useToast } from "@/context/toast-context";
import { useConfirm } from "@/context/confirm-context";
import { MenuItemCard } from "@/components/ui/menu-item-card";
import { EditItemModal } from "@/components/ui/edit-item-modal";
import { AddCategoryModal } from "@/components/ui/add-category-modal";
import { AddDishModal } from "@/components/ui/add-dish-modal";

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

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(),
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  useEffect(() => {
    // Alle Kategorien standardmäßig erweitern
    fetchMenuData();
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
        // Alle Kategorien erweitern für den Admin-Bereich
        const allCategoryIds = new Set<number>(
          data.data.categories.map((cat: MenuCategory) => cat.id),
        );
        setExpandedCategories(allCategoryIds);
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

  const handleImageUpload = (itemId: number, itemName: string) => {
    // Create file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/jpg,image/png,image/webp";

    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        showToast("Lade Bild hoch... ⏳", "info");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("itemId", itemId.toString());

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (data.success) {
            await fetchMenuData();
            showToast(`Bild für "${itemName}" erfolgreich hochgeladen! 📸`, "success");
          } else {
            showToast("❌ Fehler beim Hochladen: " + data.error, "error");
          }
        } catch (error) {
          console.error("Upload error:", error);
          showToast("❌ Fehler beim Hochladen des Bildes", "error");
        }
      }
    };

    input.click();
  };

  const handleImageRemove = async (itemId: number, itemName: string) => {
    const confirmed = await showConfirm({
      title: "Bild entfernen?",
      message: `Möchten Sie das Bild von "${itemName}" wirklich entfernen?`,
      confirmText: "Bild entfernen",
      cancelText: "Abbrechen",
      type: "warning"
    });

    if (confirmed) {
      showToast("Entferne Bild...", "info");
      try {
        const response = await fetch(`/api/upload?itemId=${itemId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          await fetchMenuData();
          showToast(`Bild erfolgreich entfernt! 🗑️`, "success");
        } else {
          showToast("❌ Fehler beim Entfernen: " + data.error, "error");
        }
      } catch (error) {
        console.error("Remove error:", error);
        showToast("❌ Fehler beim Entfernen des Bildes", "error");
      }
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveItem = async (updatedItem: MenuItem) => {
    showToast("Speichere Änderungen... ⏳", "info");
    try {
      const response = await fetch("/api/menu/items", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      const data = await response.json();

      if (data.success) {
        await fetchMenuData();
        setIsEditModalOpen(false);
        showToast(`"${updatedItem.name}" erfolgreich aktualisiert! ✅`, "success");
      } else {
        showToast("❌ Fehler beim Aktualisieren: " + data.error, "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      showToast("❌ Fehler beim Aktualisieren des Gerichts", "error");
    }
  };

  const handleDeleteItem = async (itemId: number, itemName: string) => {
    const confirmed = await showConfirm({
      title: "Gericht löschen?",
      message: `Möchten Sie "${itemName}" wirklich löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden.`,
      confirmText: "Löschen",
      cancelText: "Abbrechen",
      type: "danger"
    });

    if (confirmed) {
      showToast("Lösche Gericht...", "info");
      try {
        const response = await fetch(`/api/menu/items?id=${itemId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          await fetchMenuData();
          showToast(`"${itemName}" wurde erfolgreich gelöscht! 🗑️`, "success");
        } else {
          showToast("Fehler beim Löschen: " + data.error, "error");
        }
      } catch (error) {
        console.error("Delete error:", error);
        showToast("❌ Fehler beim Löschen des Gerichts", "error");
      }
    }
  };

  const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
    const confirmed = await showConfirm({
      title: "Kategorie löschen?",
      message: `Möchten Sie die Kategorie "${categoryName}" wirklich löschen?\n\nHinweis: Kategorien mit Gerichten können nicht gelöscht werden.`,
      confirmText: "Kategorie löschen",
      cancelText: "Abbrechen",
      type: "danger"
    });

    if (confirmed) {
      showToast("Lösche Kategorie...", "info");
      try {
        const response = await fetch(`/api/menu/categories?id=${categoryId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          await fetchMenuData();
          showToast(`Kategorie "${categoryName}" wurde erfolgreich gelöscht! 🗑️`, "success");
        } else {
          showToast("Fehler: " + data.error, "error");
        }
      } catch (error) {
        console.error("Delete category error:", error);
        showToast("❌ Fehler beim Löschen der Kategorie", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Lade Speisekarte...
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
                Zurück zum Dashboard
              </Link>
              <div className="border-l border-gray-300 dark:border-gray-600 h-6"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Speisekarte verwalten
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Gerichte und Kategorien bearbeiten
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/speisekarte"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Vorschau
              </Link>
              <button
                onClick={() => setIsAddCategoryModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Neue Kategorie
              </button>
              <button
                onClick={() => setIsAddDishModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Neues Gericht
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
            <div className="text-red-800 dark:text-red-400">
              <strong>Fehler:</strong> {error}
              <button
                onClick={fetchMenuData}
                className="ml-4 text-sm underline hover:no-underline"
              >
                Erneut versuchen
              </button>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Kategorien
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {categories.reduce((acc, cat) => acc + cat.items.length, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Gerichte gesamt
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {categories.reduce(
                (acc, cat) =>
                  acc + cat.items.filter((item) => item.vegetarian).length,
                0,
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Vegetarische Gerichte
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {categories.reduce(
                (acc, cat) =>
                  acc + cat.items.filter((item) => item.recommended).length,
                0,
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Empfehlungen
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {categories.map((category, index) => {
            const isExpanded = expandedCategories.has(category.id);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
              >
                {/* Category Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="flex items-center space-x-2 text-left"
                      >
                        <div className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-400">
                          {isExpanded ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {category.display_name || category.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {category.items.length} Gerichte
                            {category.description &&
                              ` • ${category.description}`}
                          </p>
                        </div>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        Reihenfolge: {category.order}
                      </span>
                      {category.is_drink_category && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                          Getränkekategorie
                        </span>
                      )}
                      <button
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Kategorie bearbeiten"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id, category.display_name || category.name)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Kategorie löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category Items */}
                {isExpanded && (
                  <div className="p-6">
                    {category.items.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <p>Keine Gerichte in dieser Kategorie</p>
                        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors">
                          Erstes Gericht hinzufügen
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {category.items.map((item) => (
                            <div key={item.id} className="relative">
                              <MenuItemCard
                                imageUrl={item.image_path}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                badges={getBadges(item)}
                                isAdminMode={true}
                                onImageUpload={() => handleImageUpload(item.id, item.name)}
                                className="h-full"
                              />

                              {/* Admin Controls Dropdown */}
                              <div className="absolute top-2 right-2">
                                <div className="relative">
                                  <button
                                    onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                                    className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 rounded-lg shadow-lg transition-all"
                                    title="Aktionen"
                                  >
                                    <MoreVertical className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                  </button>

                                  {openDropdownId === item.id && (
                                    <>
                                      {/* Backdrop to close dropdown */}
                                      <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setOpenDropdownId(null)}
                                      />

                                      {/* Dropdown Menu */}
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-20"
                                      >
                                        <div className="py-1">
                                          <button
                                            onClick={() => {
                                              handleImageUpload(item.id, item.name);
                                              setOpenDropdownId(null);
                                            }}
                                            className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                                          >
                                            <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm font-medium">
                                              {item.image_path ? 'Bild ändern' : 'Bild hochladen'}
                                            </span>
                                          </button>

                                          <button
                                            onClick={() => {
                                              handleEditItem(item);
                                              setOpenDropdownId(null);
                                            }}
                                            className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                                          >
                                            <Edit className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            <span className="text-sm font-medium">Gericht bearbeiten</span>
                                          </button>

                                          {item.image_path && (
                                            <>
                                              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                                              <button
                                                onClick={() => {
                                                  handleImageRemove(item.id, item.name);
                                                  setOpenDropdownId(null);
                                                }}
                                                className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                                              >
                                                <ImageIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                                <span className="text-sm font-medium">Bild entfernen</span>
                                              </button>
                                            </>
                                          )}

                                          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

                                          <button
                                            onClick={() => {
                                              handleDeleteItem(item.id, item.name);
                                              setOpenDropdownId(null);
                                            }}
                                            className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                            <span className="text-sm font-medium">Gericht löschen</span>
                                          </button>
                                        </div>
                                      </motion.div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <p className="text-lg mb-2">Keine Kategorien gefunden</p>
              <p>Erstellen Sie Ihre erste Speisekarte-Kategorie</p>
            </div>
            <button
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Erste Kategorie erstellen
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={selectedItem}
        onSave={handleSaveItem}
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSuccess={fetchMenuData}
      />

      {/* Add Dish Modal */}
      <AddDishModal
        isOpen={isAddDishModalOpen}
        onClose={() => setIsAddDishModalOpen(false)}
        onSuccess={fetchMenuData}
        categories={categories}
      />
    </div>
  );
}
