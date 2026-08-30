"use client";

import { Home, Image, Library, Mail, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import useExperienceUIStore from "@/store/useExperienceUIStore";
import useInteractionStore from "@/store/useInteractionStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";

const ACTIVE_COLOR = "#d8b18d";

// Cross layout: one hotspot per arm, "Home" in the middle returns to
// InitialView. Clock is reachable only by clicking the 3D clock directly
// (matching room4), so it's omitted here.
const CROSS_ITEMS: { name: string | null; Icon: LucideIcon; area: string }[] = [
  { name: "Photos", Icon: Image, area: "top" },
  { name: "Particles", Icon: Sparkles, area: "left" },
  { name: null, Icon: Home, area: "center" },
  { name: "Library", Icon: Library, area: "right" },
  { name: "Contact", Icon: Mail, area: "bottom" },
];

// Sized off useResponsiveStore's own mobile/tablet/desktop split (matching
// the same three tiers interactiveObjects.ts hand-tunes the camera per),
// not Tailwind's default sm/md/lg breakpoints — those cut off at 1024px,
// which would lump the project's "tablet" range (1024-1279) in with
// desktop instead of giving it its own size.
const SIZES = {
  mobile: { gap: "gap-1", padding: "p-1.5", cell: "h-10 w-10", icon: "h-5 w-5" },
  tablet: { gap: "gap-1.5", padding: "p-2", cell: "h-12 w-12", icon: "h-6 w-6" },
  desktop: { gap: "gap-2", padding: "p-2", cell: "h-14 w-14", icon: "h-7 w-7" },
};

export function NavPad() {
  const clickedObject = useInteractionStore((s) => s.clickedObject);
  const setClickedObject = useInteractionStore((s) => s.setClickedObject);
  const experienceStarted = useExperienceUIStore((s) => s.experienceStarted);
  const isMobile = useResponsiveStore((s) => s.isMobile);
  const isTablet = useResponsiveStore((s) => s.isTablet);

  const size = isMobile ? SIZES.mobile : isTablet ? SIZES.tablet : SIZES.desktop;

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 grid ${size.gap} ${size.padding} rounded-xl border-2 border-zinc-800 bg-black/80 backdrop-blur-xl transition-opacity duration-500 ${
        experienceStarted ? "pointer-events-auto opacity-100 delay-1000" : "pointer-events-none opacity-0"
      }`}
      style={{
        gridTemplateAreas: `". top ." "left center right" ". bottom ."`,
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
      }}
    >
      {CROSS_ITEMS.map(({ name, Icon, area }) => {
        const isActive = clickedObject === name;
        return (
          <div
            key={area}
            style={{ gridArea: area }}
            className={`bg-card flex ${size.cell} cursor-pointer items-center justify-center rounded-lg transition hover:scale-110`}
            onClick={(e) => {
              e.stopPropagation();
              setClickedObject(name);
            }}
          >
            <Icon className={`text-primary ${size.icon}`} style={isActive ? { color: ACTIVE_COLOR } : undefined} />
          </div>
        );
      })}
    </div>
  );
}
