import { create } from "zustand";

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isTouchDevice: boolean;
  screenWidth: number;
  screenHeight: number;
  updateDimensions: (dimensions: { width: number; height: number }) => void;
}

export const useResponsiveStore = create<ResponsiveState>((set) => ({
  isMobile: false,
  isTablet: false,
  isDesktop: false,
  isPortrait: true,
  isLandscape: false,
  isTouchDevice: false,
  screenWidth: 0,
  screenHeight: 0,
  updateDimensions: ({ width, height }) =>
    set({
      isMobile: width < 1024,
      isTablet: width >= 1024 && width < 1280,
      isDesktop: width >= 1280,
      isPortrait: height > width,
      isLandscape: width >= height,
      isTouchDevice: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      screenWidth: width,
      screenHeight: height,
    }),
}));
