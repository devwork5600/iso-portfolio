"use client";

import { Home, Image, Library, Mail, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import useExperienceUIStore from "@/store/useExperienceUIStore";
import useInteractionStore from "@/store/useInteractionStore";

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

export function NavPad() {
  const clickedObject = useInteractionStore((s) => s.clickedObject);
  const setClickedObject = useInteractionStore((s) => s.setClickedObject);
  const experienceStarted = useExperienceUIStore((s) => s.experienceStarted);

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 grid gap-1 rounded-xl border-2 border-zinc-800 bg-black/80 p-2 backdrop-blur-xl transition-opacity duration-500 lg:gap-2 ${
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
            className="bg-card flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg transition hover:scale-110 lg:h-14 lg:w-14"
            onClick={(e) => {
              e.stopPropagation();
              setClickedObject(name);
            }}
          >
            <Icon
              className="text-primary h-6 w-6 lg:h-7 lg:w-7"
              style={isActive ? { color: ACTIVE_COLOR } : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
