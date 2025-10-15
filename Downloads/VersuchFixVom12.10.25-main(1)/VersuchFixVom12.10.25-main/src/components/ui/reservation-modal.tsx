"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Phone } from "lucide-react";
import { useEffect } from "react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  
  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              aria-label="Modal schließen"
            >
              <X size={18} className="text-gray-600" />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <div className="mb-6">
                <Phone className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">
                  Reservierung
                </h2>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                Reservierungen sind aus organisatorischen Gründen ausschließlich 
                telefonisch möglich.
              </p>
              
              <p className="text-gray-600 mb-6">
                Sie erreichen uns unter:
              </p>
              
              <a 
                href="tel:+4909938230307"
                className="inline-block w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
              >
                <Phone className="inline-block w-5 h-5 mr-2" />
                09938 / 23 203 07
              </a>
              
              <p className="text-sm text-gray-500">
                Wir freuen uns auf Ihren Anruf und nehmen Ihre Reservierung 
                gerne persönlich entgegen!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

