"use client";

import { useProgress } from "@react-three/drei";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import useExperienceUIStore from "@/store/useExperienceUIStore";

// Ported from room4's Loader.tsx. Visual/animation code is unchanged; wired
// into useExperienceUIStore now that NavPad/Sidebar/CameraManager exist and
// need to react to load/enter state — a plain useEffect still covers the
// one-shot flip/curtain animations (no @gsap/react needed here).
export function Loader() {
  const { progress } = useProgress();
  const setAssetsLoaded = useExperienceUIStore((s) => s.setAssetsLoaded);
  const setHasUserEntered = useExperienceUIStore((s) => s.setHasUserEntered);
  const setIntroFinished = useExperienceUIStore((s) => s.setIntroFinished);
  const setExperienceStarted = useExperienceUIStore((s) => s.setExperienceStarted);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [canEnter, setCanEnter] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setDisplayProgress((prev) => Math.max(prev, Math.round(progress)));
    });
    return () => cancelAnimationFrame(id);
  }, [progress]);

  useEffect(() => {
    if (progress === 100 && cardRef.current && !canEnter) {
      setCanEnter(true);
      setAssetsLoaded(true);

      gsap.to(cardRef.current, {
        rotationX: -180,
        transformOrigin: "center center",
        force3D: true,
        duration: 1,
        ease: "power2.inOut",
        delay: 0.5,
      });
    }
  }, [progress, canEnter]);

  const handleEnter = () => {
    if (!topRef.current || !bottomRef.current) return;

    setHasUserEntered(true);

    gsap
      .timeline({
        onComplete: () => {
          setIsDone(true);
          setIntroFinished(true);
          setExperienceStarted(true);
        },
      })
      .to(topRef.current, { y: "-100%", duration: 1, ease: "power2.inOut" })
      .to(bottomRef.current, { y: "100%", duration: 1, ease: "power2.inOut" }, "<");
  };

  if (isDone) return null;

  // Wide enough for "Chargement" at text-2xl with a little margin either
  // side — bumped up from the original 120px, which fit "Loading" but
  // overlapped the card's rounded-rect border once the French label (10
  // chars vs. 7) took its place.
  const width = 180;
  const height = 100;
  const strokeWidth = 2;
  const perimeter = (width - strokeWidth) * 2 + (height - strokeWidth) * 2;
  const dashOffset = perimeter - (displayProgress / 100) * perimeter;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        ref={topRef}
        className="absolute top-0 right-0 left-0 flex h-[calc(50%+1px)] items-end justify-center bg-black"
      >
        <div className="relative h-[100px]" style={{ width, perspective: "1000px" }}>
          <div
            ref={cardRef}
            className="absolute top-[-30px] h-[100px] w-full text-2xl"
            style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
          >
            {/* FRONT SIDE */}
            <div
              className="absolute flex h-full w-full items-center justify-center text-[#d8b18d]"
              style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
            >
              <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="absolute"
              >
                <rect
                  x={strokeWidth / 2}
                  y={strokeWidth / 2}
                  width={width - strokeWidth}
                  height={height - strokeWidth}
                  rx="6"
                  ry="6"
                  stroke="currentColor"
                  strokeOpacity={0.2}
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                <rect
                  x={strokeWidth / 2}
                  y={strokeWidth / 2}
                  width={width - strokeWidth}
                  height={height - strokeWidth}
                  rx="6"
                  ry="6"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={perimeter}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.3s ease" }}
                />
              </svg>
              <span className="pointer-events-auto text-[#d8b18d]">Chargement</span>
            </div>

            {/* BACK SIDE */}
            <div
              className="absolute flex h-full w-full items-center justify-center"
              style={{ transform: "rotateX(180deg) translateZ(0)", backfaceVisibility: "hidden" }}
            >
              <button
                onClick={handleEnter}
                disabled={!canEnter}
                className={`pointer-events-auto h-full w-full rounded-md border-2 border-[#d8b18d] px-6 py-3 text-[#d8b18d] transition duration-300 ${
                  canEnter
                    ? "hover:bg-[#d8b18d] hover:text-black cursor-pointer opacity-100"
                    : "opacity-0"
                }`}
              >
                Entrer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={bottomRef}
        className="absolute right-0 bottom-0 left-0 h-[calc(50%+1px)] bg-black"
      />
    </div>
  );
}
