"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import React, { useRef } from "react";
import { InteractiveObject } from "@/data/interactiveObjects";
import { textSplitter } from "@/utils/textSplitter";

/** Shared title + underline + staggered fade-in for every sidebar panel. */
interface SidebarPanelProps {
  object: InteractiveObject;
  children?: React.ReactNode;
}

export function SidebarPanel({ object, children }: SidebarPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !underlineRef.current) return;

      const q = gsap.utils.selector(containerRef);
      const letters = q(".inner-span") as HTMLElement[];
      const items = q(".tech-item, .project-item") as HTMLElement[];

      const tl = gsap.timeline({ delay: 0.4 });

      gsap.set(underlineRef.current, { transformOrigin: "left center", scaleX: 0 });
      tl.to(underlineRef.current, { scaleX: 1, duration: 0.8, ease: "power3.out" });

      tl.fromTo(letters, { opacity: 0 }, { opacity: 1, stagger: 0.02, ease: "power3.out" }, "-=0.2");

      tl.fromTo(
        items,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
        "-=0.2",
      );

      return () => {
        tl.kill();
      };
    },
    { scope: containerRef, dependencies: [object] },
  );

  return (
    <div ref={containerRef} className="flex h-full flex-col space-y-4 overflow-y-auto pb-4">
      <h2 className="sidebar-title inline-block text-xl font-semibold lg:text-2xl">
        <span className="relative inline-block">
          {object.title}
          <span
            ref={underlineRef}
            className="underline-span bg-primary block h-px origin-left scale-x-0"
          />
        </span>
      </h2>

      {object.text && <p className="text-lg leading-relaxed opacity-90">{textSplitter(object.text)}</p>}

      {object.blocks?.map((block, i) => {
        if (block.type === "text") {
          return (
            <p key={i} className="text-lg leading-relaxed opacity-90">
              {textSplitter(block.content)}
            </p>
          );
        }

        if (block.type === "techList") {
          return (
            <div key={i} className="flex flex-wrap gap-3">
              {block.items.map((item, idx) => (
                <div key={idx} className="tech-item flex flex-col items-center text-center">
                  <div className="relative h-8 w-8">
                    <Image src={item.icon} alt={item.name} fill className="object-contain" />
                  </div>
                  <span className="text-xs opacity-80">{item.name}</span>
                </div>
              ))}
            </div>
          );
        }

        if (block.type === "projectList") {
          return (
            <ul key={i} className="space-y-2">
              {block.items.map((item, idx) => (
                <li key={idx} className="project-item">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          );
        }

        return null;
      })}

      {children}
    </div>
  );
}
