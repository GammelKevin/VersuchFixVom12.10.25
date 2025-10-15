"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

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

export function MenuSection() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data.categories);
      } else {
        setError(data.message || 'Fehler beim Laden der Speisekarte');
      }
    } catch (err) {
      setError('Fehler beim Laden der Speisekarte');
      console.error('Menu fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBadges = (item: MenuItem) => {
    const badges = [];
    if (item.vegetarian) badges.push({ name: "Vegetarisch", color: "bg-green-100 text-green-700" });
    if (item.vegan) badges.push({ name: "Vegan", color: "bg-green-200 text-green-800" });
    if (item.spicy) badges.push({ name: "Scharf", color: "bg-red-100 text-red-700" });
    if (item.gluten_free) badges.push({ name: "Glutenfrei", color: "bg-yellow-100 text-yellow-700" });
    if (item.homemade) badges.push({ name: "Hausgemacht", color: "bg-blue-100 text-blue-700" });
    if (item.recommended) badges.push({ name: "Empfehlung", color: "bg-purple-100 text-purple-700" });
    return badges;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Lade Speisekarte...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
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
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-4">
            Unsere Speisekarte
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Entdecken Sie authentische griechische Köstlichkeiten, 
            zubereitet nach traditionellen Familienrezepten.
          </p>
        </motion.div>

        {categories.map((category) => (
          <motion.div
            key={category.id}
            className="mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold font-serif text-blue-600 mb-2">
                {category.display_name || category.name}
              </h3>
              {category.description && (
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {category.description}
                </p>
              )}
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {category.items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  {item.image_path && (
                    <div className="mb-4 relative h-40 rounded-lg overflow-hidden">
                      <Image
                        src={`/static/uploads/${item.image_path}`}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 text-lg font-serif">
                      {item.name}
                    </h4>
                    <span className="text-blue-600 font-bold text-lg ml-2 flex-shrink-0">
                      €{Number(item.price).toFixed(2)}
                    </span>
                  </div>
                  
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  
                  {getBadges(item).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {getBadges(item).map((badge, badgeIndex) => (
                        <span
                          key={badgeIndex}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
                        >
                          {badge.name}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-gray-600 mb-6">
            Haben Sie Fragen zu unseren Gerichten oder benötigen Sie Informationen zu Allergenen?
          </p>
          <a 
            href="tel:+4909938230307" 
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Rufen Sie uns an: 09938 / 23 203 07
          </a>
        </motion.div>
      </div>
    </section>
  );
}

