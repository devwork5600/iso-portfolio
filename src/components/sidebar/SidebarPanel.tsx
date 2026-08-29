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

      const container = containerRef.current;
      const underlineEl = underlineRef.current;
      const q = gsap.utils.selector(container);
      const blocks = q(".content-block") as HTMLElement[];

      const tl = gsap.timeline({ delay: 0.4 });

      gsap.set(underlineEl, { transformOrigin: "left center", scaleX: 0 });
      tl.to(underlineEl, { scaleX: 1, duration: 0.8, ease: "power3.out" });

      // Walk blocks in DOM order so each block's text finishes revealing
      // before its own icons/items start (text -> icons -> text -> icons...),
      // instead of animating every letter across the whole panel first and
      // every icon after.
      type ElementMeta = { el: HTMLElement; yOffset: number; duration: number; stagger: number; scroll: number };
      const allElements: ElementMeta[] = [];

      blocks.forEach((block) => {
        const letters = Array.from(block.querySelectorAll<HTMLElement>(".inner-span"));
        const items = Array.from(block.querySelectorAll<HTMLElement>(".tech-item, .project-item, .action-item"));

        letters.forEach((el) => allElements.push({ el, yOffset: 6, duration: 0.04, stagger: 0.04, scroll: 24 }));
        items.forEach((el) => allElements.push({ el, yOffset: 0, duration: 0.4, stagger: 0.15, scroll: 45.5 }));
      });

      allElements.forEach(({ el }) => gsap.set(el, { opacity: 0 }));

      let globalTime = 0.6;
      allElements.forEach(({ el, yOffset, duration, stagger, scroll }) => {
        tl.add(() => {
          gsap.fromTo(el, { opacity: 0, y: yOffset }, { opacity: 1, y: 0, duration, ease: "power2.out" });

          // Auto-scroll the panel to keep newly-revealed content in view.
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const distanceFromBottom = containerRect.bottom - rect.bottom;

          if (distanceFromBottom < scroll * 2) {
            gsap.to(container, { scrollTop: `+=${scroll}`, duration: 0.25, ease: "power2.out" });
          }
        }, globalTime);

        globalTime += stagger;
      });

      tl.eventCallback("onComplete", () => {
        container.style.overflowY = "auto";
      });

      return () => {
        tl.kill();
      };
    },
    { scope: containerRef, dependencies: [object] },
  );

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col space-y-4 overflow-hidden pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <h2 className="sidebar-title inline-block text-xl font-semibold lg:text-2xl">
        <span className="relative inline-block">
          {object.title}
          <span
            ref={underlineRef}
            className="underline-span block h-px origin-left scale-x-0 bg-[#d8b18d]"
          />
        </span>
      </h2>

      {object.text && (
        <p className="content-block text-lg leading-relaxed opacity-90">{textSplitter(object.text)}</p>
      )}

      {object.blocks?.map((block, i) => {
        if (block.type === "text") {
          return (
            <p key={i} className="content-block text-lg leading-relaxed opacity-90">
              {textSplitter(block.content)}
            </p>
          );
        }

        if (block.type === "techList") {
          return (
            <div key={i} className="content-block flex flex-wrap gap-3">
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
            <div key={i} className="content-block flex flex-col gap-3">
              {block.items.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="project-item bg-background flex h-12 items-center justify-center rounded-md px-4 text-center font-semibold shadow-xs transition-colors hover:bg-[#d8b18d] hover:text-black"
                >
                  <span className="truncate">{item.name}</span>
                </a>
              ))}
            </div>
          );
        }

        return null;
      })}

      {children}
    </div>
  );
}
