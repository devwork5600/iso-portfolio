"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { InteractiveObject } from "@/data/interactiveObjects";
import { SidebarPanel } from "./SidebarPanel";

export function SidebarContact({ object }: { object: InteractiveObject }) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (!buttonRef.current) return;
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power3.out", delay: 1 },
      );
    },
    { dependencies: [object] },
  );

  return (
    <SidebarPanel object={object}>
      <Button ref={buttonRef} className="w-full opacity-0" asChild>
        <a href="#" download>
          Download business card
        </a>
      </Button>
    </SidebarPanel>
  );
}
