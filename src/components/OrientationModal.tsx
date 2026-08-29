"use client";

import { useCallback, useEffect, useState } from "react";

interface OrientationModalProps {
  onPortraitChange?: (isPortrait: boolean) => void;
}

export function OrientationModal({ onPortraitChange }: OrientationModalProps) {
  const [showModal, setShowModal] = useState(false);

  const checkOrientation = useCallback(() => {
    // Debounce for iOS Safari UI adjustment
    setTimeout(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Show modal only for portrait devices with width < 1024
      const portrait = height > width && width < 1024;

      setShowModal(portrait);
      if (onPortraitChange) onPortraitChange(portrait);
    }, 150);
  }, [onPortraitChange]);

  useEffect(() => {
    checkOrientation();

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    window.screen.orientation?.addEventListener("change", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
      window.screen.orientation?.removeEventListener("change", checkOrientation);
    };
  }, [checkOrientation]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 px-4 text-center text-white transition-opacity duration-500 ease-in-out ${
        showModal ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <h1 className="mb-4 text-2xl font-bold md:text-4xl">Veuillez tourner votre appareil en mode paysage</h1>
      <p className="text-lg md:text-xl">L&apos;expérience est optimisée pour le mode paysage.</p>
    </div>
  );
}
