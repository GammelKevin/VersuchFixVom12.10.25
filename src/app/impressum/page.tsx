"use client";

import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ImpressumPage() {
  const [settings, setSettings] = useState({
    contact_phone: '09938 / 23 203 07',
    contact_phone_formatted: '+4909938230307',
    contact_email: 'info@restaurant-alas.de',
    contact_address_street: 'Bundesstraße 39',
    contact_address_city: '94554 Moos, Niederbayern'
  });

  useEffect(() => {
    fetch('/api/settings?category=contact')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(prev => ({ ...prev, ...data.data.settings }));
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 pt-20 transition-colors">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white mb-8">
              Impressum
            </h1>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 md:p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Angaben gemäß § 5 TMG
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Restaurant ALAS<br />
                  {settings.contact_address_street}<br />
                  {settings.contact_address_city}
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Vertreten durch
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Anastasios Spathis
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Kontakt
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Telefon: <a href={`tel:${settings.contact_phone_formatted}`} className="text-blue-600 dark:text-blue-400 hover:underline">{settings.contact_phone}</a><br />
                  E-Mail: <a href={`mailto:${settings.contact_email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{settings.contact_email}</a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Umsatzsteuer-ID
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                  DE XXX XXX XXX
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Aufsichtsbehörde
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Zuständige Aufsichtsbehörde:
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Gewerbeaufsichtsamt bei der Regierung von Niederbayern<br />
                  Gestütstraße 10<br />
                  84028 Landshut<br /><br />
                  Telefon: 0871 808-01<br />
                  Fax: 0871 808-1799<br />
                  E-Mail: <a href="mailto:poststelle@reg-nb.bayern.de" className="text-blue-600 dark:text-blue-400 hover:underline">poststelle@reg-nb.bayern.de</a><br />
                  Website: <a href="https://www.regierung.niederbayern.bayern.de" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">www.regierung.niederbayern.bayern.de</a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Datenschutzaufsicht
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Für datenschutzrechtliche Belange ist das Bayerische Landesamt für Datenschutzaufsicht zuständig:
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)<br />
                  Promenade 18<br />
                  91522 Ansbach<br /><br />
                  Telefon: 0981 180093-0<br />
                  Fax: 0981 180093-800<br />
                  Website: <a href="https://www.lda.bayern.de" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">www.lda.bayern.de</a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Anastasios Spathis<br />
                  {settings.contact_address_street}<br />
                  {settings.contact_address_city}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Streitschlichtung
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                  <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://ec.europa.eu/consumers/odr</a><br />
                  Unsere E-Mail-Adresse finden Sie oben im Impressum.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

