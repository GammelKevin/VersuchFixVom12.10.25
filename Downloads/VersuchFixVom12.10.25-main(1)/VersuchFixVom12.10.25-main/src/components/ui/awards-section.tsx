"use client";

import { motion } from "framer-motion";
import { FileText, Award } from "lucide-react";
import Image from "next/image";

export function AwardsSection() {
  const awards = [
    {
      id: 1,
      title: "Top Gastronom",
      subtitle: "Lokal des Jahres 2024",
      image: "/static/awards/LDJ_Herr_Anastasios_Spathis_A41-1.png",
      pdf: "/static/awards/LDJ Restaurant Alas A4.pdf",
      description: "Ausgezeichnet als Top Gastronom des Jahres",
    },
    {
      id: 2,
      title: "Griechische Küche",
      subtitle: "Lokal des Jahres 2024",
      image: "/static/awards/LDJ_Restaurant_Alas_A4-2.png",
      pdf: "/static/awards/LDJ Herr Anastasios Spathis A4.pdf",
      description: "Ausgezeichnet als bestes griechisches Restaurant",
    },
    {
      id: 3,
      title: "SDG Restaurant ALAS",
      subtitle: "Sterne der Gastronomie - Gold",
      image: "/static/awards/SDG_Restaurant_Alas_A4-3.png",
      pdf: "/static/awards/SDG Restaurant Alas A4.pdf",
      description: "Zertifiziert für nachhaltige Gastronomie",
    },
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="awards"
      className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors"
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Award className="w-10 h-10 text-yellow-500 mr-2" />
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white">
              Unsere Auszeichnungen
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Wir sind stolz auf die Anerkennung unserer Gäste und der Fachwelt
            für unsere authentische griechische Küche und herzliche
            Gastfreundschaft.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {awards.map((award, index) => (
            <motion.div
              key={award.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariants}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-8">
                <div className="relative h-48 mb-6 flex items-center justify-center">
                  <Image
                    src={award.image}
                    alt={award.title}
                    width={300}
                    height={192}
                    className="max-h-full w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {award.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                  {award.id === 3 ? (
                    <>
                      Sterne der Gastronomie -{" "}
                      <span className="text-yellow-500 font-bold">Gold</span>
                    </>
                  ) : (
                    award.subtitle
                  )}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                  {award.description}
                </p>
                <a
                  href={award.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium group"
                >
                  <FileText className="w-5 h-5" />
                  <span>PDF ansehen</span>
                  <motion.span
                    className="ml-1"
                    initial={{ x: 0 }}
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    →
                  </motion.span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
