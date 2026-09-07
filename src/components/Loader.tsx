"use client";

import { useProgress } from "@react-three/drei";
import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import useExperienceUIStore from "@/store/useExperienceUIStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";

// Ported from room4's Loader.tsx, then reworked: the original was a 3D
// flip card (rotateX + preserve-3d + backface-visibility) where the whole
// card — frame and label both — rotated to swap "Chargement" for "Entrer".
// Firefox has a confirmed single-frame rasterization glitch on that combo
// — right as the back face crossed into view at a steep angle, it painted
// as a flat filled block before the border/text caught up on the next
// frame (verified by frame-stepping a slowed-down recording; not a
// CSS/hover-state bug — several rounds of will-change/opacity/visibility
// mitigations reduced but never eliminated it).
//
// Now the frame (the button + its progress-ring border) never moves at
// all — only the label inside rolls from "Chargement" to "Entrer", via a
// plain vertical translateY (with a Z dip at the midpoint for a
// cylinder-roll depth cue). No rotation, no backface anywhere, so that
// whole class of Firefox bug no longer applies. The button stays
// disabled/non-interactive until the roll finishes and "Entrer" has fully
// settled into place.
//
// Sized off useResponsiveStore's own mobile/tablet/desktop split, same
// pattern as NavPad/Sidebar/SidebarPanel — mobile gets a smaller card
// (was overflowing small viewports), tablet/desktop keep the original
// 180x100 size. lineHeight is the rolling text window's height (one row);
// cardOffset is the frame's vertical nudge (was a literal -30px, tied to
// the old fixed height).
const SIZES = {
  mobile: { width: 130, height: 68, cardOffset: -20, textSize: "text-lg", lineHeight: 24 },
  tablet: { width: 180, height: 100, cardOffset: -30, textSize: "text-2xl", lineHeight: 32 },
  desktop: { width: 180, height: 100, cardOffset: -30, textSize: "text-2xl", lineHeight: 32 },
};

const ROLL_DEPTH = 12; // px the label recedes (translateZ) at the midpoint of the roll

// Failsafe: if the loading state never resolves (see the useProgress race
// documented below), force the reveal after this long regardless — no
// visitor should ever be stuck on "Chargement" forever.
const FAILSAFE_MS = 15000;

export function Loader() {
  const { progress, total, loaded, active } = useProgress();
  const isMobile = useResponsiveStore((s) => s.isMobile);
  const isTablet = useResponsiveStore((s) => s.isTablet);
  const setAssetsLoaded = useExperienceUIStore((s) => s.setAssetsLoaded);
  const setHasUserEntered = useExperienceUIStore((s) => s.setHasUserEntered);
  const setIntroFinished = useExperienceUIStore((s) => s.setIntroFinished);
  const setExperienceStarted = useExperienceUIStore((s) => s.setExperienceStarted);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [canEnter, setCanEnter] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLDivElement>(null);
  // Mirrors `rolling` state but readable synchronously from the failsafe
  // timeout's closure below, which is fixed at mount (empty deps) and would
  // otherwise always see the stale initial `false` — a ref sidesteps that.
  const rollingRef = useRef(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setDisplayProgress((prev) => Math.max(prev, Math.round(progress)));
    });
    return () => cancelAnimationFrame(id);
  }, [progress]);

  const startRoll = useCallback(() => {
    if (!rollRef.current || rollingRef.current) return;
    rollingRef.current = true;
    setRolling(true);
    setAssetsLoaded(true);

    // rollRef holds both labels stacked (Chargement, then Entrer) — -50%
    // of its own height is exactly one row's worth of travel. z is driven
    // off the same progress via a sine arc (0 at both ends, -ROLL_DEPTH at
    // the midpoint) for the cylinder-roll depth cue — needs the button's
    // `perspective` (below) to read visually. Only flips canEnter once the
    // roll has actually finished settling.
    const state = { t: 0 };
    gsap.to(state, {
      t: 1,
      duration: 1,
      ease: "power2.inOut",
      delay: 0.5,
      onUpdate: () => {
        if (!rollRef.current) return;
        gsap.set(rollRef.current, {
          yPercent: -50 * state.t,
          z: -ROLL_DEPTH * Math.sin(state.t * Math.PI),
        });
      },
      onComplete: () => setCanEnter(true),
    });
  }, [setAssetsLoaded]);

  useEffect(() => {
    // useProgress's `progress` percentage is computed off a module-level
    // running total (drei's Progress.js `saveLastTotalLoaded`) meant to
    // reset between loading "waves" — but useGLTF.preload() in each
    // Part*Model.tsx fires at module-eval time, before this component ever
    // mounts. If that preload wave finishes fast (warm HTTP cache — the
    // actual failure mode seen: every asset resolved in under 250ms), the
    // component tree's own useGLTF/useTexture calls hit R3F's resource
    // cache and resolve without touching the loading manager again, so no
    // further onProgress ever fires — `progress` can get stuck at whatever
    // non-100 value that first wave left behind, forever. `loaded`/`total`
    // are the raw manager item counts backing that percentage and aren't
    // subject to the same reset-math bug, so prefer them; `!active` catches
    // it via onLoad regardless of what the percentage says.
    const isFullyLoaded = total > 0 && loaded >= total && !active;
    if ((progress === 100 || isFullyLoaded) && !rolling) startRoll();
  }, [progress, total, loaded, active, rolling, startRoll]);

  useEffect(() => {
    // startRoll's own rollingRef guard (not React state) makes this safe to
    // call unconditionally even if normal completion already fired by then.
    const id = setTimeout(startRoll, FAILSAFE_MS);
    return () => clearTimeout(id);
  }, [startRoll]);

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

  const { width, height, cardOffset, textSize, lineHeight } = isMobile
    ? SIZES.mobile
    : isTablet
      ? SIZES.tablet
      : SIZES.desktop;
  const strokeWidth = 2;
  const perimeter = (width - strokeWidth) * 2 + (height - strokeWidth) * 2;
  const dashOffset = perimeter - (displayProgress / 100) * perimeter;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        ref={topRef}
        className="absolute top-0 right-0 left-0 flex h-[calc(50%+1px)] items-end justify-center bg-black"
      >
        <button
          onClick={handleEnter}
          disabled={!canEnter}
          // canEnter only flips true once the roll animation has finished —
          // a page that's already 100% loaded on mount briefly renders the
          // button disabled either way, so this can't diverge from SSR.
          // border-2 only kicks in once canEnter — before that the SVG
          // progress ring below draws the border instead, so the two don't
          // double up.
          className={`pointer-events-auto relative flex items-center justify-center rounded-md text-[#d8b18d] transition-colors duration-300 ${
            canEnter
              ? "border-2 border-[#d8b18d] hover:bg-[#d8b18d] hover:text-black cursor-pointer"
              : ""
          }`}
          style={{ top: cardOffset, width, height, perspective: 600 }}
        >
          {!canEnter && (
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              className="pointer-events-none absolute inset-0"
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
          )}

          <div className={`relative overflow-hidden ${textSize}`} style={{ width: "100%", height: lineHeight }}>
            <div ref={rollRef} className="absolute inset-x-0 top-0">
              <div className="flex items-center justify-center" style={{ height: lineHeight }}>
                Chargement
              </div>
              <div className="flex items-center justify-center" style={{ height: lineHeight }}>
                Entrer
              </div>
            </div>
          </div>
        </button>
      </div>

      <div
        ref={bottomRef}
        className="absolute right-0 bottom-0 left-0 h-[calc(50%+1px)] bg-black"
      />
    </div>
  );
}
