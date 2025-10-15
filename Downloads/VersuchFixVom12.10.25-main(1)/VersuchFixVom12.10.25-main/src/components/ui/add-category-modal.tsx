"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/context/toast-context";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    description: "",
    order: 0,
    is_drink_category: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.display_name) {
      showToast("Bitte füllen Sie alle Pflichtfelder aus", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/menu/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showToast(`Kategorie "${formData.display_name}" erfolgreich erstellt! 🎉`, "success");
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: "",
          display_name: "",
          description: "",
          order: 0,
          is_drink_category: false,
        });
      } else {
        showToast("❌ " + (data.error || "Fehler beim Erstellen der Kategorie"), "error");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      showToast("❌ Fehler beim Erstellen der Kategorie", "error");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Neue Kategorie erstellen
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  disabled={loading}
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name (Internal) */}
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                    Interner Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="z.B. appetizers"
                    className="mt-1 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Display Name */}
                <div>
                  <Label htmlFor="display_name" className="text-gray-700 dark:text-gray-300">
                    Anzeigename *
                  </Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    placeholder="z.B. Vorspeisen"
                    className="mt-1 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                    Beschreibung
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Kurze Beschreibung der Kategorie"
                    className="mt-1 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    disabled={loading}
                  />
                </div>

                {/* Order */}
                <div>
                  <Label htmlFor="order" className="text-gray-700 dark:text-gray-300">
                    Reihenfolge
                  </Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-1 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                {/* Is Drink Category */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_drink"
                    checked={formData.is_drink_category}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_drink_category: checked as boolean })
                    }
                    className="border-gray-300 dark:border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    disabled={loading}
                  />
                  <Label
                    htmlFor="is_drink"
                    className="text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Ist eine Getränke-Kategorie
                  </Label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    disabled={loading}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Erstellen...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Kategorie erstellen
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}