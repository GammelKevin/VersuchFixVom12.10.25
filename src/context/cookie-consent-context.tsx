"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CONSENT_VERSION } from "@/lib/cookie-categories";

export interface ConsentState {
  essential: boolean; // Always true
  analytics: boolean;
}

interface ConsentContextType {
  consent: ConsentState | null;
  hasConsent: (category: keyof ConsentState) => boolean;
  updateConsent: (newConsent: ConsentState) => Promise<void>;
  showBanner: boolean;
  hideBanner: () => void;
  openSettings: () => void;
  settingsOpen: boolean;
  closeSettings: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

const CONSENT_KEY = "cookie_consent";
const CONSENT_VERSION_KEY = "cookie_consent_version";

export function useCookieConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return context;
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    // Check if consent exists and is current version
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    const storedVersion = localStorage.getItem(CONSENT_VERSION_KEY);

    if (storedConsent && storedVersion === CONSENT_VERSION) {
      // Valid consent exists
      try {
        const parsed = JSON.parse(storedConsent) as ConsentState;
        setConsent(parsed);
        setShowBanner(false);
      } catch {
        // Invalid consent, show banner
        setShowBanner(true);
      }
    } else {
      // No consent or outdated version, show banner
      setShowBanner(true);
    }
  }, []);

  const updateConsent = async (newConsent: ConsentState) => {
    // Always ensure essential is true
    const finalConsent: ConsentState = {
      ...newConsent,
      essential: true,
    };

    // Save to localStorage
    localStorage.setItem(CONSENT_KEY, JSON.stringify(finalConsent));
    localStorage.setItem(CONSENT_VERSION_KEY, CONSENT_VERSION);

    // Log consent to server
    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consent: finalConsent,
          version: CONSENT_VERSION,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to log consent:", error);
    }

    setConsent(finalConsent);
    setShowBanner(false);
    setSettingsOpen(false);

    // Reload page to activate/deactivate tracking
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const hasConsent = (category: keyof ConsentState): boolean => {
    if (!consent) return false;
    return consent[category] === true;
  };

  const hideBanner = () => {
    setShowBanner(false);
  };

  const openSettings = () => {
    setSettingsOpen(true);
  };

  const closeSettings = () => {
    setSettingsOpen(false);
  };

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasConsent,
        updateConsent,
        showBanner,
        hideBanner,
        openSettings,
        settingsOpen,
        closeSettings,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}
