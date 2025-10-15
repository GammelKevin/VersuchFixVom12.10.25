"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Save, RotateCcw, Phone, Mail, MapPin, Facebook, Instagram, Type, Image as ImageIcon, CheckCircle2, XCircle } from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useState, useEffect } from "react";

interface Settings {
  [key: string]: string;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'content' | 'media'>('contact');
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();

      if (data.success) {
        setSettings(data.data.settings);
      } else {
        showMessage('error', 'Fehler beim Laden der Einstellungen');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showMessage('error', 'Fehler beim Laden der Einstellungen');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Prepare updates array
      const updates = Object.keys(settings).map(key => ({
        key,
        value: settings[key]
      }));

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Einstellungen erfolgreich gespeichert!');
        setHasChanges(false);

        // Refresh the page after a short delay to show updated content
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showMessage('error', data.message || 'Fehler beim Speichern');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', 'Fehler beim Speichern der Einstellungen');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Möchten Sie alle Änderungen verwerfen?')) {
      fetchSettings();
      setHasChanges(false);
      showMessage('success', 'Änderungen zurückgesetzt');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Lade Einstellungen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Zurück zum Dashboard
              </Link>
              <div className="border-l border-gray-300 dark:border-gray-600 h-6"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Website-Einstellungen
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Verwalten Sie Kontaktdaten, Inhalte und Medien
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ThemeSwitcher />
              {hasChanges && (
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Zurücksetzen</span>
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Speichert...' : 'Speichern'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="container mx-auto px-4 md:px-6 mt-4"
        >
          <div className={`flex items-center space-x-2 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        </motion.div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'contact'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Phone className="w-4 h-4 inline mr-2" />
            Kontaktinformationen
            {activeTab === 'contact' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'content'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Type className="w-4 h-4 inline mr-2" />
            Website-Inhalte
            {activeTab === 'content' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'media'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <ImageIcon className="w-4 h-4 inline mr-2" />
            Medien & Assets
            {activeTab === 'media' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8"
        >
          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-blue-600" />
                  Telefon
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefonnummer (Anzeige)
                    </label>
                    <input
                      type="text"
                      value={settings.contact_phone || ''}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                      placeholder="09938 2320307"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefonnummer (tel: Link)
                    </label>
                    <input
                      type="text"
                      value={settings.contact_phone_formatted || ''}
                      onChange={(e) => handleInputChange('contact_phone_formatted', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                      placeholder="+4909938230307"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-600" />
                  E-Mail
                </h3>
                <input
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="info@restaurant-alas.de"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Adresse
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Straße und Hausnummer
                    </label>
                    <input
                      type="text"
                      value={settings.contact_address_street || ''}
                      onChange={(e) => handleInputChange('contact_address_street', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                      placeholder="Bundesstr. 39"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        PLZ und Stadt
                      </label>
                      <input
                        type="text"
                        value={settings.contact_address_city || ''}
                        onChange={(e) => handleInputChange('contact_address_city', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                        placeholder="94554 Moos"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Region/Bundesland
                      </label>
                      <input
                        type="text"
                        value={settings.contact_address_region || ''}
                        onChange={(e) => handleInputChange('contact_address_region', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                        placeholder="Niederbayern"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                  <Instagram className="w-5 h-5 mr-2 text-pink-600" />
                  Social Media
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={settings.contact_facebook || ''}
                      onChange={(e) => handleInputChange('contact_facebook', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                      placeholder="https://www.facebook.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={settings.contact_instagram || ''}
                      onChange={(e) => handleInputChange('contact_instagram', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                      placeholder="https://www.instagram.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Hero-Sektion (Startseite)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Haupttitel
                    </label>
                    <input
                      type="text"
                      value={settings.hero_title || ''}
                      onChange={(e) => handleInputChange('hero_title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                      placeholder="Restaurant ALAS"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Untertitel
                    </label>
                    <input
                      type="text"
                      value={settings.hero_subtitle || ''}
                      onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                      placeholder="Willkommen bei"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Badge-Text
                    </label>
                    <input
                      type="text"
                      value={settings.hero_badge || ''}
                      onChange={(e) => handleInputChange('hero_badge', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                      placeholder="Restaurant ALAS - Moos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Beschreibung
                    </label>
                    <input
                      type="text"
                      value={settings.hero_description || ''}
                      onChange={(e) => handleInputChange('hero_description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                      placeholder="Authentische griechische Küche..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Über Uns Sektion
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Titel
                    </label>
                    <input
                      type="text"
                      value={settings.about_title || ''}
                      onChange={(e) => handleInputChange('about_title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                      placeholder="Über Restaurant ALAS"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Beschreibung
                    </label>
                    <textarea
                      value={settings.about_description || ''}
                      onChange={(e) => handleInputChange('about_description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                      placeholder="Herzlich willkommen im Restaurant ALAS..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Reservierung
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hinweistext (Hauptnachricht)
                    </label>
                    <textarea
                      value={settings.reservation_note || ''}
                      onChange={(e) => handleInputChange('reservation_note', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                      placeholder="Reservierungen sind ausschließlich telefonisch möglich..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Zusatztext
                    </label>
                    <textarea
                      value={settings.reservation_message || ''}
                      onChange={(e) => handleInputChange('reservation_message', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                      placeholder="Wir freuen uns auf Ihren Anruf..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Footer
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slogan/Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.footer_tagline || ''}
                    onChange={(e) => handleInputChange('footer_tagline', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                    placeholder="Authentische griechische Küche seit über 30 Jahren"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Logo
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo Dateipfad
                  </label>
                  <input
                    type="text"
                    value={settings.logo_path || ''}
                    onChange={(e) => handleInputChange('logo_path', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                    placeholder="/logo/logo.png"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Pfad relativ zum public-Ordner
                  </p>
                </div>
              </div>

              {/* Hero Videos removed - now hardcoded in video-hero component to prevent infinite loop */}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Hinweis:</strong> Dateien müssen manuell in den <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">/public</code> Ordner hochgeladen werden.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
