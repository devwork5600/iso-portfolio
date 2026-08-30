"use client";

import { X } from "lucide-react";
import { interactiveObjects } from "@/data/interactiveObjects";
import useInteractionStore from "@/store/useInteractionStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";
import { SidebarClock } from "./SidebarClock";
import { SidebarContact } from "./SidebarContact";
import { SidebarLibrary } from "./SidebarLibrary";
import { SidebarParticles } from "./SidebarParticles";
import { SidebarPhotos } from "./SidebarPhotos";

// Sized off useResponsiveStore's own mobile/tablet/desktop split, same
// pattern as NavPad — not Tailwind's default lg: cutoff, which would lump
// the project's "tablet" range (1024-1279) in with desktop.
const SIZES = {
  mobile: { width: "w-44", padding: "p-2", closeButton: "h-7 w-7", closeIcon: "h-4 w-4" },
  tablet: { width: "w-52", padding: "p-3", closeButton: "h-8 w-8", closeIcon: "h-5 w-5" },
  desktop: { width: "w-80", padding: "p-4", closeButton: "h-8 w-8", closeIcon: "h-5 w-5" },
};

export function Sidebar() {
  const clickedObject = useInteractionStore((s) => s.clickedObject);
  const setClickedObject = useInteractionStore((s) => s.setClickedObject);
  const isMobile = useResponsiveStore((s) => s.isMobile);
  const isTablet = useResponsiveStore((s) => s.isTablet);

  const activeObject = interactiveObjects.find((obj) => obj.name === clickedObject);
  const size = isMobile ? SIZES.mobile : isTablet ? SIZES.tablet : SIZES.desktop;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`bg-card fixed top-0 right-0 z-50 box-border h-full ${size.width} transform ${size.padding} transition-transform duration-700 ease-in-out ${
        clickedObject ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {activeObject && (
        <div className="relative flex h-full flex-col">
          <button
            onClick={() => setClickedObject(null)}
            className={`text-foreground hover:bg-background absolute top-0 right-0 z-10 flex ${size.closeButton} cursor-pointer items-center justify-center rounded-md`}
            aria-label="Fermer"
          >
            <X className={size.closeIcon} />
          </button>
          {activeObject.name === "Library" && <SidebarLibrary object={activeObject} />}
          {activeObject.name === "Clock" && <SidebarClock object={activeObject} />}
          {activeObject.name === "Particles" && <SidebarParticles object={activeObject} />}
          {activeObject.name === "Contact" && <SidebarContact object={activeObject} />}
          {activeObject.name === "Photos" && <SidebarPhotos object={activeObject} />}
        </div>
      )}
    </div>
  );
}
