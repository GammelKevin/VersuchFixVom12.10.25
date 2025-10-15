"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";
import { useEffect, useState } from "react";

export function ContactSection() {
  const [settings, setSettings] = useState({
    contact_phone: '09938 / 23 203 07',
    contact_phone_formatted: '+4909938230307',
    contact_email: 'info@restaurant-alas.de',
    contact_address_street: 'Bundesstraße 39',
    contact_address_city: '94554 Moos, Niederbayern',
    contact_facebook: 'https://www.facebook.com/p/Griechisches-Restaurant-ALAS-61552077044507/',
    contact_instagram: 'https://www.instagram.com/griechischesrestaurantalas/'
  });

  useEffect(() => {
    fetch('/api/settings?category=contact', {
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

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-gray-900 mb-3 sm:mb-4 px-2">
            Kontakt & Anfahrt
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2 leading-relaxed">
            Besuchen Sie uns in Moos, Niederbayern. Wir freuen uns auf Sie!
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Kontakt Informationen */}
          <motion.div
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 mb-5 sm:mb-6">
                Restaurant ALAS
              </h3>

              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-1 mr-3 sm:mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                      Adresse
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {settings.contact_address_street}
                      <br />
                      {settings.contact_address_city}
                      <br />
                      Deutschland
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-1 mr-3 sm:mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                      Telefon
                    </h4>
                    <a
                      href={`tel:${settings.contact_phone_formatted}`}
                      className="text-blue-600 hover:text-blue-700 active:text-blue-800 transition-colors duration-300 text-sm sm:text-base touch-manipulation"
                    >
                      {settings.contact_phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-1 mr-3 sm:mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">E-Mail</h4>
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="text-blue-600 hover:text-blue-700 active:text-blue-800 transition-colors duration-300 text-sm sm:text-base break-all touch-manipulation"
                    >
                      {settings.contact_email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                  Folgen Sie uns
                </h4>
                <div className="flex space-x-3 sm:space-x-4">
                  <a
                    href={settings.contact_facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 active:bg-blue-800 transition-colors duration-300 touch-manipulation"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href={settings.contact_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 active:from-purple-700 active:to-pink-700 transition-all duration-300 touch-manipulation"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Google Maps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-lg h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2658.123456789012!2d12.123456789012345!3d48.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBundesstra%C3%9Fe%2039%2C%2094554%20Moos!5e0!3m2!1sde!2sde!4v1234567890123!5m2!1sde!2sde"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title="Restaurant ALAS Standort"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
