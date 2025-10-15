"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ReservationPopup } from "./reservation-popup";

export function VideoHero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [videosToPlay, setVideosToPlay] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedVideos, setPreloadedVideos] = useState<HTMLVideoElement[]>(
    [],
  );
  const [showReservationPopup, setShowReservationPopup] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState({
    hero_title: "Restaurant ALAS",
    hero_subtitle: "Willkommen bei",
    hero_badge: "Restaurant ALAS - Moos",
    hero_description: "Authentische griechische Küche in gemütlicher Atmosphäre",
  });

  useEffect(() => {
    fetch('/api/settings?category=content', {
      cache: 'no-store'  // Prevent Next.js from caching settings
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(prev => ({ ...prev, ...data.data.settings }));
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  useEffect(() => {
    // Fixed videos - always the same 3 videos
    const videoList = [
      "/videos/restaurant-hero-1.mp4",
      "/videos/restaurant-hero-2.mp4",
      "/videos/restaurant-hero-3.mp4",
    ];

    setVideosToPlay(videoList);

    // Preload all videos
    const preloadVideos = async () => {
      const loadedVideos: HTMLVideoElement[] = [];

      for (let i = 0; i < videoList.length; i++) {
        const video = document.createElement("video");
        video.src = videoList[i];
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;

        // Load only metadata first for faster initial load
        if (i === 0) {
          // First video loads fully
          video.load();
          video.onloadeddata = () => {
            if (i === 0) {
              setIsLoading(false);
            }
          };
        } else {
          // Other videos load metadata only
          video.preload = "metadata";
        }

        loadedVideos.push(video);
      }

      setPreloadedVideos(loadedVideos);
    };

    preloadVideos();
  }, []); // Empty array = run only once on mount

  // Preload next video when current is playing
  useEffect(() => {
    if (
      preloadedVideos.length > 0 &&
      currentVideoIndex < preloadedVideos.length - 1
    ) {
      const nextVideo = preloadedVideos[currentVideoIndex + 1];
      if (nextVideo.preload === "metadata") {
        nextVideo.preload = "auto";
        nextVideo.load();
      }
    }
  }, [currentVideoIndex, preloadedVideos]);

  const handleVideoEnd = () => {
    if (videosToPlay.length > 1) {
      setCurrentVideoIndex((prev) => (prev + 1) % videosToPlay.length);
    }
  };

  const handleVideoError = () => {
    console.error("Video failed to load:", videosToPlay[currentVideoIndex]);
    setVideoError(true);
    setIsLoading(false);
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-gray-900"
    >
      {/* Loading Screen - Shows immediately */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 z-50 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-blue-600/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-white text-base sm:text-lg font-light">Restaurant ALAS</p>
          </div>
        </div>
      )}

      {/* Video Background */}
      {videosToPlay.length > 0 && !videoError ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVideoIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            <video
              ref={videoRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto max-w-none"
              autoPlay
              muted
              loop={videosToPlay.length === 1}
              playsInline
              preload="auto"
              onEnded={handleVideoEnd}
              onError={handleVideoError}
              onCanPlayThrough={() => setIsLoading(false)}
            >
              <source src={videosToPlay[currentVideoIndex]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </AnimatePresence>
      ) : (
        /* Fallback - dark background if videos fail */
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900" />
      )}

      {/* Overlay - optimized for mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70 sm:from-black/40 sm:via-transparent sm:to-black/60" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 pt-14 sm:pt-16 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 30 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto w-full"
        >
          {settings.hero_badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: isLoading ? 0 : 1,
                scale: isLoading ? 0.9 : 1,
              }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-block mb-4 sm:mb-6"
            >
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-xs sm:text-sm font-medium border border-white/20">
                {settings.hero_badge}
              </span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
          >
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light mb-2 text-blue-300">
              {settings.hero_subtitle}
            </span>
            {settings.hero_title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2"
          >
            {settings.hero_description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto"
          >
            <a
              href="/speisekarte"
              className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-all transform hover:scale-105 active:scale-95 shadow-lg text-sm sm:text-base touch-manipulation"
            >
              Speisekarte ansehen
            </a>
            <button
              onClick={() => setShowReservationPopup(true)}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-md text-white rounded-lg font-semibold hover:bg-white/20 active:bg-white/30 transition-all transform hover:scale-105 active:scale-95 shadow-lg border border-white/20 text-sm sm:text-base touch-manipulation"
            >
              Tisch reservieren
            </button>
          </motion.div>
        </motion.div>

        {/* Video Progress Indicator - Mobile optimized */}
        {videosToPlay.length > 1 && !videoError && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              {videosToPlay.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentVideoIndex
                      ? "w-6 sm:w-8 bg-white"
                      : "w-1 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Scroll Indicator - Mobile optimized */}
        {!isLoading && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            onClick={scrollToContent}
            className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 touch-manipulation"
            aria-label="Scroll down"
          >
            <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-bounce" />
          </motion.button>
        )}
      </div>

      {/* Reservation Popup */}
      <ReservationPopup
        isOpen={showReservationPopup}
        onClose={() => setShowReservationPopup(false)}
      />
    </div>
  );
}
