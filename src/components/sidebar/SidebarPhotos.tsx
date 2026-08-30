"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { InteractiveObject } from "@/data/interactiveObjects";
import { SidebarPanel } from "./SidebarPanel";

export function SidebarPhotos({ object }: { object: InteractiveObject }) {
  return (
    <SidebarPanel
      object={object}
      footer={
        object.githubUrl && (
          <Button className="w-full" asChild>
            <a href={object.githubUrl} target="_blank" rel="noreferrer">
              <span className="relative h-5 w-5">
                <Image src="/icons/github-svgrepo-com.svg" alt="" fill className="object-contain" />
              </span>
              Voir mon GitHub
            </a>
          </Button>
        )
      }
    />
  );
}
