"use client"; // Client Component for Framer Motion

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

export default function AnimatedLayout({ children }: AnimatedLayoutProps) {
  const pathname = usePathname();

  const pageVariants = {
    hidden: { opacity: 0, y: 20 }, // start slightly down and invisible
    enter: { opacity: 1, y: 0 },   // fade in and slide up
    exit: { opacity: 0, y: -20 },  // fade out and slide up
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname} // triggers animation on route change
        variants={pageVariants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
