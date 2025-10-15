"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface FamilyStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FamilyStoryModal({ isOpen, onClose }: FamilyStoryModalProps) {
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 m-4">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 dark:text-white">
                  Eine Familie, Eine Vision
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-medium">
                  Die Geschichte einer Familie, die ihre Träume und Traditionen über Generationen bewahrt und weiterentwickelt.
                </p>

                <p className="text-gray-700 dark:text-gray-200 mb-6">
                  Von Griechenland nach Deutschland – die Geschichte unserer Familie ist eine Geschichte von Mut, Zusammenhalt und der Liebe zur Gastronomie.
                </p>

                <p className="text-gray-700 dark:text-gray-200 mb-6">
                  1988 wagten meine Eltern den mutigen Schritt, ihre Heimat Griechenland zu verlassen und in Deutschland ein neues Leben zu beginnen. Im Gepäck: traditionelle Rezepte, die Liebe zur griechischen Küche und der unerschütterliche Glaube an eine gemeinsame Zukunft.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                  Was Familie für uns bedeutet
                </h3>

                <p className="text-gray-700 dark:text-gray-200 mb-4">
                  Ein Familienbetrieb zu sein bedeutet für uns mehr als nur zusammen zu arbeiten. Es bedeutet:
                </p>

                <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 mb-6 space-y-2">
                  <li>Gemeinsame Werte und Traditionen zu pflegen</li>
                  <li>Jede Entscheidung im Sinne der Familie zu treffen</li>
                  <li>Authentizität in allem, was wir tun</li>
                  <li>Persönliche Betreuung unserer Gäste</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-200 mb-6">
                  Die Küche war schon immer das Herz unserer Familie. Hier wurden nicht nur Mahlzeiten zubereitet, sondern auch Geschichten erzählt, Traditionen weitergegeben und die Liebe zur griechischen Küche von einer Generation zur nächsten vererbt. Jedes Familienmitglied bringt seine eigenen Stärken und Ideen ein, was unser Restaurant zu etwas ganz Besonderem macht.
                </p>

                <p className="text-gray-700 dark:text-gray-200 mb-6">
                  Als die jüngere Generation 2017 in das Familiengeschäft einstieg, war es uns wichtig, die Balance zwischen Tradition und Innovation zu finden. Während die Eltern ihre jahrzehntelange Erfahrung und das Wissen um authentische griechische Küche einbringen, sorgt die neue Generation für frische Impulse und moderne Interpretationen.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                  Warum &quot;Alas&quot;?
                </h3>

                <p className="text-gray-700 dark:text-gray-200 mb-6">
                  Der Name &quot;Alas&quot; steht für alles, was unsere Familie ausmacht. Es ist mehr als ein Restaurant – es ist das Ergebnis jahrelanger harter Arbeit, gemeinsamer Träume und der Vision, authentische griechische Gastfreundschaft nach Deutschland zu bringen. Am 15. Dezember 2023 wurde dieser Traum mit der Eröffnung unseres Restaurants Wirklichkeit.
                </p>

                <p className="text-gray-700 dark:text-gray-200">
                  Heute, im Jahr 2025, führen wir diese Familientradition mit Stolz fort. Jeder Gast, der unser Restaurant betritt, wird Teil unserer erweiterten Familie. Wir teilen nicht nur unsere Speisen, sondern auch unsere Geschichte, unsere Kultur und unsere Leidenschaft für die griechische Küche.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

