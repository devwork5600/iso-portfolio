"use client";

import { X } from "lucide-react";
import { interactiveObjects } from "@/data/interactiveObjects";
import useInteractionStore from "@/store/useInteractionStore";
import { SidebarClock } from "./SidebarClock";
import { SidebarContact } from "./SidebarContact";
import { SidebarLibrary } from "./SidebarLibrary";
import { SidebarParticles } from "./SidebarParticles";
import { SidebarPhotos } from "./SidebarPhotos";

export function Sidebar() {
  const clickedObject = useInteractionStore((s) => s.clickedObject);
  const setClickedObject = useInteractionStore((s) => s.setClickedObject);

  const activeObject = interactiveObjects.find((obj) => obj.name === clickedObject);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`bg-card fixed top-0 right-0 z-50 box-border h-full w-52 transform p-3 transition-transform duration-700 ease-in-out lg:w-80 lg:p-4 ${
        clickedObject ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {activeObject && (
        <div className="relative flex h-full flex-col">
          <button
            onClick={() => setClickedObject(null)}
            className="text-foreground hover:bg-background absolute top-0 right-0 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
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
