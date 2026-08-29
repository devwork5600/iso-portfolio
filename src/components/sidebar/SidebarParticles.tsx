"use client";

import { Button } from "@/components/ui/button";
import { InteractiveObject } from "@/data/interactiveObjects";
import { useMorphStore } from "@/store/useMorphStore";
import { SidebarPanel } from "./SidebarPanel";

export function SidebarParticles({ object }: { object: InteractiveObject }) {
  const setTargetIndex = useMorphStore((s) => s.setTargetIndex);

  return (
    <SidebarPanel object={object}>
      <div className="content-block flex gap-2 pt-2">
        <Button className="action-item" onClick={() => setTargetIndex(0)}>
          Three.js
        </Button>
        <Button className="action-item" onClick={() => setTargetIndex(1)}>
          Suzanne
        </Button>
      </div>
    </SidebarPanel>
  );
}
