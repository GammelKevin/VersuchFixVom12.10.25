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
      ? "bg-black/20 dark:bg-black/40 border-b border-white/10 dark:border-white/5"
      : "bg-gray-900/95 dark:bg-gray-900/98 border-b border-gray-700/50 dark:border-gray-800/50"
  );

  return (
    <>
      <nav className={navClasses}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo/logo.png"
                  alt="Restaurant ALAS"
                  width={120}
                  height={60}
                  className="h-12 md:h-14 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-white transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              <div className="ml-4">
                <ThemeSwitcher />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isOpen ? "auto" : 0,
              opacity: isOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              "md:hidden overflow-hidden",
              isOpen ? "border-t border-white/10" : "",
            )}
          >
            <div className="py-4 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="px-4 py-2 flex items-center">
                <span className="text-white/60 text-sm mr-3">Theme:</span>
                <ThemeSwitcher />
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
    </>
  );
}
