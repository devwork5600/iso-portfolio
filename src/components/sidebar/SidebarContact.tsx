"use client";

import { Button } from "@/components/ui/button";
import { InteractiveObject } from "@/data/interactiveObjects";
import { SidebarPanel } from "./SidebarPanel";

export function SidebarContact({ object }: { object: InteractiveObject }) {
  return (
    <SidebarPanel object={object}>
      <div className="content-block">
        <Button className="action-item w-full" asChild>
          <a href="/pdf/visit-card.pdf" download>
            Télécharger ma carte de visite
          </a>
        </Button>
      </div>
    </SidebarPanel>
  );
}
