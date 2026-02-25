import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  navigationState: "idle" | "submitting" | "loading";
}

const MIN_DISPLAY_TIME = 300; // ms
const ANIMATION_DURATION = 0.3; // seconds

export function Layout({ children, navigationState }: LayoutProps) {
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    if (navigationState === "loading") {
      setShowProgressBar(true);
      setStartTime(Date.now());
    } else if (navigationState === "idle" && showProgressBar) {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_DISPLAY_TIME) {
        const remainingTime = MIN_DISPLAY_TIME - elapsedTime;
        const timer = setTimeout(() => {
          setShowProgressBar(false);
        }, remainingTime);
        return () => clearTimeout(timer);
      } else {
        setShowProgressBar(false);
      }
    }
  }, [navigationState, showProgressBar, startTime]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <motion.div
        className="fixed top-0 left-0 h-1 bg-primary z-[9999]"
        initial={{ width: 0 }}
        animate={{ width: showProgressBar ? "100%" : "0%" }}
        transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}