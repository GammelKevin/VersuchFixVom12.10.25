"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";
import Image from "next/image";
import Link from "next/link";

interface NavigationProps {
  variant?: "transparent" | "solid";
}

export function Navigation({ variant = "solid" }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Über Uns", href: "/#about" },
    { name: "Speisekarte", href: "/speisekarte" },
    { name: "Auszeichnungen", href: "/#awards" },
    { name: "Öffnungszeiten", href: "/#hours" },
    { name: "Kontakt", href: "/#contact" },
  ];

  const navClasses = cn(
    "fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300",
    variant === "transparent"
      ? "bg-black/30 dark:bg-black/50 border-b border-white/10 dark:border-white/5"
      : "bg-gray-900/95 dark:bg-gray-900/98 border-b border-gray-700/50 dark:border-gray-800/50"
  );

  return (
    <>
      <nav className={navClasses}>
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo/logo.png"
                  alt="Restaurant ALAS"
                  width={120}
                  height={60}
                  className="h-10 sm:h-12 md:h-14 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-white transition-colors duration-300 relative group text-sm xl:text-base font-medium"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              <div className="ml-4">
                <ThemeSwitcher />
              </div>
            </div>

            {/* Mobile/Tablet menu button */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeSwitcher />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors duration-300 touch-manipulation"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Navigation */}
          <motion.div
            initial={false}
            animate={{
              height: isOpen ? "auto" : 0,
              opacity: isOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "lg:hidden overflow-hidden",
              isOpen ? "border-t border-white/10" : "",
            )}
          >
            <div className="py-3 sm:py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20 rounded-lg transition-all duration-300 text-base sm:text-lg font-medium touch-manipulation"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </nav>
    </>
  );
}
