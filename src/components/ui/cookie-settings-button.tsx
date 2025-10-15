"use client";

import { motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { useCookieConsent } from "@/context/cookie-consent-context";
import { CookieSettingsModal } from "./cookie-settings-modal";

export function CookieSettingsButton() {
  const { consent, openSettings, settingsOpen, closeSettings } =
    useCookieConsent();

  // Only show if consent has been given
  if (!consent) return null;

  return (
    <>
      <motion.button
        onClick={openSettings}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-6 left-6 z-[9998] p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all group"
        title="Cookie-Einstellungen"
      >
        <Cookie className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </motion.button>

      <CookieSettingsModal isOpen={settingsOpen} onClose={closeSettings} />
    </>
  );
}
