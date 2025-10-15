"use client";

import { useEffect, useState } from "react";

export function Footer() {
  const [settings, setSettings] = useState({
    contact_phone: '09938 / 23 203 07',
    contact_phone_formatted: '+4909938230307',
    contact_email: 'info@restaurant-alas.de',
    contact_address_street: 'Bundesstraße 39',
    contact_address_city: '94554 Moos, Niederbayern',
    contact_facebook: 'https://www.facebook.com/p/Griechisches-Restaurant-ALAS-61552077044507/',
    contact_instagram: 'https://www.instagram.com/griechischesrestaurantalas/',
    footer_tagline: 'Restaurant ALAS. Alle Rechte vorbehalten.'
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

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold font-serif mb-4">Kontakt</h3>
            <p className="text-gray-400 mb-2">
              Telefon:{" "}
              <a
                href={`tel:${settings.contact_phone_formatted}`}
                className="hover:text-white transition-colors"
              >
                {settings.contact_phone}
              </a>
            </p>
            <p className="text-gray-400 mb-4">
              E-Mail:{" "}
              <a
                href={`mailto:${settings.contact_email}`}
                className="hover:text-white transition-colors"
              >
                {settings.contact_email}
              </a>
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Adresse</h4>
            <p className="text-gray-400 mb-2">{settings.contact_address_street}</p>
            <p className="text-gray-400">{settings.contact_address_city}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Folgen Sie uns</h4>
            <div className="flex space-x-4 mb-4">
              <a
                href={settings.contact_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={settings.contact_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <a
              href="/impressum"
              className="text-gray-400 hover:text-white transition-colors mr-4"
            >
              Impressum
            </a>
            <a
              href="/datenschutz"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Datenschutz
            </a>
          </div>
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} {settings.footer_tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
