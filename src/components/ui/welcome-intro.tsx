"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface WelcomeIntroProps {
  userName: string;
  greeting: string;
  onComplete: () => void;
}

export function WelcomeIntro({ userName, greeting, onComplete }: WelcomeIntroProps) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      setTimeout(onComplete, 600);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        >
          {/* Animated Gradient Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />

          {/* Glassmorphism Overlay */}
          <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-br from-slate-900/40 via-blue-900/30 to-indigo-900/40" />

          {/* Floating Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -50, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: '100px 100px',
            }} />
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center px-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="space-y-12"
            >
              {/* Greeting with Glassmorphism */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl blur-xl" />
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl px-16 py-10 shadow-2xl">
                  <motion.h1
                    className="text-7xl md:text-8xl lg:text-9xl font-thin text-white tracking-tight"
                    initial={{ letterSpacing: "0.1em", opacity: 0 }}
                    animate={{ letterSpacing: "0.05em", opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                  >
                    {greeting}
                  </motion.h1>

                  {/* Animated Underline */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                    className="mt-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent origin-center"
                  />
                </div>
              </motion.div>

              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1 }}
                className="space-y-6"
              >
                <h2 className="text-4xl md:text-5xl font-light text-white/90 tracking-wide">
                  {userName}
                </h2>
                <motion.p
                  className="text-xl text-white/60 font-light tracking-wider uppercase text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                >
                  Admin Dashboard
                </motion.p>
              </motion.div>

              {/* Progress Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className="flex items-center justify-center space-x-3"
              >
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1.2, 1],
                      opacity: [0, 1, 0.6]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                    className="w-2 h-2 bg-white/80 rounded-full shadow-lg shadow-white/50"
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Decorative Corner Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -45 }}
              animate={{ opacity: 0.15, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="absolute -top-32 -left-32 w-64 h-64 border-2 border-white/20 rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: 45 }}
              animate={{ opacity: 0.1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute -bottom-32 -right-32 w-80 h-80 border-2 border-white/10 rounded-full"
            />

            {/* Additional decorative lines */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.1, scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.6 }}
              className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
