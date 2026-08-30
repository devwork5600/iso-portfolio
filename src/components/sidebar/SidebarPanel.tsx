"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import React, { useRef } from "react";
import { InteractiveObject } from "@/data/interactiveObjects";
import { useResponsiveStore } from "@/store/useResponsiveStore";
import { textSplitter } from "@/utils/textSplitter";

/** Shared title + underline + staggered fade-in for every sidebar panel. */
interface SidebarPanelProps {
  object: InteractiveObject;
  children?: React.ReactNode;
  /** Rendered below the scrollable area, pinned to the panel's bottom
   *  instead of scrolling away with the rest of the content. */
  footer?: React.ReactNode;
}

// Sized off useResponsiveStore's own mobile/tablet/desktop split, same
// pattern as NavPad/Sidebar — tablet/desktop match the original fixed
// sizes (title never scaled past lg:text-2xl, body never scaled at all),
// mobile is the new smaller tier.
const TEXT_SIZES = {
  mobile: { title: "text-base", body: "text-sm" },
  tablet: { title: "text-xl", body: "text-lg" },
  desktop: { title: "text-2xl", body: "text-lg" },
};

export function SidebarPanel({ object, children, footer }: SidebarPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const isMobile = useResponsiveStore((s) => s.isMobile);
  const isTablet = useResponsiveStore((s) => s.isTablet);
  const textSize = isMobile ? TEXT_SIZES.mobile : isTablet ? TEXT_SIZES.tablet : TEXT_SIZES.desktop;

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

        // 1.2x speed over the original 0.04/0.04 (duration/stagger).
        letters.forEach((el) => allElements.push({ el, yOffset: 6, duration: 0.033, stagger: 0.033, scroll: 24 }));
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

      // The footer (e.g. Photos' GitHub button) lives outside this
      // container, so it isn't among the .content-block-scanned elements
      // above — schedule its own fade-in for once they're done. +0.25
      // covers the gap between the last item's start (globalTime, after
      // the loop) and its own 0.4s fade-in finishing, since items overlap
      // their stagger step (0.15s < 0.4s duration).
      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          globalTime + 0.25,
        );
      }

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
    <div className="flex h-full flex-col">
      <div
        ref={containerRef}
        className="flex-1 space-y-4 overflow-hidden pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <h2 className={`sidebar-title inline-block ${textSize.title} font-semibold`}>
          <span className="relative inline-block">
            {object.title}
            <span
              ref={underlineRef}
              className="underline-span block h-px origin-left scale-x-0 bg-[#d8b18d]"
            />
          </span>
        </h2>

        {object.text && (
          <p className={`content-block ${textSize.body} leading-relaxed opacity-90`}>{textSplitter(object.text)}</p>
        )}

        {object.blocks?.map((block, i) => {
          if (block.type === "text") {
            return (
              <p key={i} className={`content-block ${textSize.body} leading-relaxed opacity-90`}>
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
                    style={{ color: item.style.textColor, backgroundColor: item.style.bgColor }}
                    className={`project-item ${item.style.borderRadius} ${item.style.font} ${item.style.fontSize} ${item.style.fontStyle} flex h-12 items-center justify-center px-4 text-center font-semibold shadow-xs transition-transform hover:scale-[1.02]`}
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

      {footer && (
        <div ref={footerRef} className="panel-footer pt-3">
          {footer}
        </div>
      )}
    </div>
  );
}
