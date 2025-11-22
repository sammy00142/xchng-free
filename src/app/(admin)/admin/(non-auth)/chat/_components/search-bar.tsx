"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useAdminChats } from "@/lib/hooks/new/admin/use-all-chats";

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const { searchQuery, setSearchQuery } = useAdminChats();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);
  const handleClear = () => setSearchQuery("");

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative flex items-center w-full max-w-screen-sm mx-auto"
        initial={false}
        animate={{
          width: isFocused ? "90%" : "88%",
        }}
        transition={{ duration: 0.15, ease: "easeInOut", mass: 0.4 }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          initial={false}
          animate={{
            scale: isFocused ? 0.9 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Search className="w-5 h-5 opacity-60" />
        </motion.div>
        <input
          type="text"
          className="w-full py-2 pl-10 pr-4 text-neutral-700 dark:text-neutral-100 leading-none bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 rounded-full outline-none focus:border-primary focus:ring-2 focus:ring-primary"
          placeholder="Search"
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={searchQuery}
          onChange={handleChange}
        />
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleClear}
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
