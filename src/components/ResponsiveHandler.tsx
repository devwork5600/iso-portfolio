"use client";

import { useEffect } from "react";
import { useResponsiveStore } from "@/store/useResponsiveStore";

export function ResponsiveHandler() {
  const updateDimensions = useResponsiveStore((s) => s.updateDimensions);

  useEffect(() => {
    const handleResize = () => {
      updateDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [updateDimensions]);

  return null;
}
