"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import Image from "next/image";

interface MenuItemCardProps {
  imageUrl?: string | null;
  name: string;
  description?: string;
  price: number;
  badges?: Array<{ name: string; color: string; emoji: string }>;
  isAdminMode?: boolean;
  onImageUpload?: () => void;
  searchTerm?: string;
  className?: string;
}

const MenuItemCard = React.forwardRef<HTMLDivElement, MenuItemCardProps>(
  (
    {
      className,
      imageUrl,
      name,
      description,
      price,
      badges = [],
      isAdminMode = false,
      onImageUpload,
      searchTerm
    },
    ref
  ) => {
    // Highlight function
    const highlightText = (text: string) => {
      if (!searchTerm) return text;
      
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const parts = text.split(regex);
      
      return parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 px-1 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      );
    };
    // Animation variants
    const cardVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      hover: { scale: 1.02, transition: { duration: 0.2 } },
    };

    const buttonVariants = {
      tap: { scale: 0.95 },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative flex flex-col w-full max-w-sm overflow-hidden rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm hover:shadow-md dark:hover:shadow-slate-900/50 transition-all group border-gray-200 dark:border-slate-700 h-full",
          className
        )}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        {/* Image Section - Only render if image exists */}
        {imageUrl && (
          <div className="relative overflow-hidden rounded-t-xl">
            <div className="relative h-48 w-full">
              <Image
                src={imageUrl.startsWith('/') ? imageUrl : `/static/uploads/${imageUrl}`}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Admin Upload Button */}
            {isAdminMode && onImageUpload && (
              <div className="absolute top-3 right-3">
                <motion.button
                  onClick={onImageUpload}
                  variants={buttonVariants}
                  whileTap="tap"
                  className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-lg transition-colors"
                  title="Bild ändern"
                >
                  <Upload className="w-4 h-4 text-gray-700" />
                </motion.button>
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className={cn(
          "flex flex-col flex-grow p-4 text-left",
          !imageUrl && "p-6" // More padding when no image
        )}>
          {/* Admin Upload Area - Only when no image exists */}
          {!imageUrl && isAdminMode && onImageUpload && (
            <motion.button
              onClick={onImageUpload}
              className="mb-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Bild hinzufügen</span>
            </motion.button>
          )}

          {/* Item Name */}
          <h3 className="text-lg font-semibold leading-tight text-gray-900 dark:text-white mb-2 font-serif line-clamp-2">
            {highlightText(name)}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed line-clamp-3">
              {highlightText(description)}
            </p>
          )}
          {!description && (
            <div className="h-[3.75rem] mb-3" />
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
                >
                  <span className="mr-1">{badge.emoji}</span>
                  {badge.name}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="mt-auto pt-2">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {Number(price).toFixed(2)}€
            </span>
          </div>
        </div>
      </motion.div>
    );
  }
);

MenuItemCard.displayName = "MenuItemCard";

export { MenuItemCard };
