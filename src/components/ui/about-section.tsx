"use client";

import { motion } from "framer-motion";
import { Award, Users, Clock, Heart, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { FamilyStoryModal } from "./family-story-modal";

export function AboutSection() {
  const [isFamilyStoryOpen, setIsFamilyStoryOpen] = useState(false);
  const [settings, setSettings] = useState({
    about_title: "Über Restaurant ALAS",
    about_description: "Herzlich willkommen im Restaurant ALAS! Seit über 30 Jahren servieren wir Ihnen authentische griechische Spezialitäten in familiärer Atmosphäre. Unser Restaurant wurde 2024 als \"Lokal des Jahres Deutschland\" für griechische Küche ausgezeichnet.",
  });

  useEffect(() => {
    fetch('/api/settings?category=content', {
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(prev => ({ ...prev, ...data.data.settings }));
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);
  
  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Traditionelle Küche",
      description: "Authentische griechische Rezepte, weitergegeben über Generationen"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Familienbetrieb",
      description: "Ein familiengeführtes Restaurant mit persönlichem Service"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Ausgezeichnet",
      description: "Lokal des Jahres Deutschland 2024 - Griechische Küche"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Über 30 Jahre",
      description: "Langjährige Erfahrung in der griechischen Gastfreundschaft"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-gray-900 mb-3 sm:mb-4 px-2">
            {settings.about_title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            {settings.about_description}
          </p>

          <motion.button
            onClick={() => setIsFamilyStoryOpen(true)}
            className="mt-5 sm:mt-6 inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium group touch-manipulation text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Unsere Familiengeschichte</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center group"
            >
              <div className="bg-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors duration-300">
                <div className="scale-90 sm:scale-100">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 px-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 sm:mt-12 md:mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 md:p-12 text-white text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 font-serif">
            Lokal des Jahres 2024
          </h3>
          <p className="text-base sm:text-lg md:text-xl mb-5 sm:mb-6 opacity-90 leading-relaxed px-2">
            Stolz darauf, als bestes griechisches Restaurant in Deutschland ausgezeichnet zu werden!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <a
              href="#menu"
              className="px-6 py-2.5 sm:px-8 sm:py-3 bg-white text-blue-700 rounded-full font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors duration-300 touch-manipulation text-sm sm:text-base"
            >
              Unsere Speisekarte
            </a>
            <a
              href="#contact"
              className="px-6 py-2.5 sm:px-8 sm:py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 active:bg-white/20 transition-colors duration-300 touch-manipulation text-sm sm:text-base"
            >
              Kontakt & Reservierung
            </a>
          </div>
        </motion.div>
      </div>
      
      <FamilyStoryModal 
        isOpen={isFamilyStoryOpen}
        onClose={() => setIsFamilyStoryOpen(false)}
      />
    </section>
  );
}
