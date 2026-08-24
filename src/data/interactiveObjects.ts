import * as THREE from "three";
import { baseFraming, frameHotspot } from "@/lib/cameraFraming";

// The room's fixed isometric camera (mirrors Scene.tsx's CAMERA_POSITION /
// CAMERA_TARGET) — the single source of truth Scene.tsx and RoomParallax.tsx
// both import, instead of each hardcoding their own copy.
export const BASE_POSITION = new THREE.Vector3(9.3, 11.395654, 10);
export const BASE_TARGET = new THREE.Vector3(0, 4.55654, 0);

export interface Transform {
  readonly targetPosition: [number, number, number];
  readonly targetQuaternion: [number, number, number, number];
  zoom: number;
}

function toTransform(worldPoint: THREE.Vector3 | null, zoom: number): Transform {
  const framing = worldPoint
    ? frameHotspot(BASE_POSITION, BASE_TARGET, worldPoint)
    : baseFraming(BASE_POSITION, BASE_TARGET);
  return {
    targetPosition: framing.position.toArray(),
    targetQuaternion: framing.quaternion.toArray() as [number, number, number, number],
    zoom,
  };
}

function deviceTransforms(worldPoint: THREE.Vector3 | null, desktopZoom: number) {
  return {
    desktop: toTransform(worldPoint, desktopZoom),
    tablet: toTransform(worldPoint, desktopZoom * 0.82),
    mobile: toTransform(worldPoint, desktopZoom * 0.65),
  };
}

export interface IntroSetting {
  name: string;
  desktop: Transform;
  tablet: Transform;
  mobile: Transform;
}

// IntroView (16) matches Scene.tsx's previous INTRO_ZOOM, derived from a
// projected-bbox script. InitialView (the "home" resting shot) started from
// that same script's RESTING_ZOOM (40) but is now a hand-tuned value — bump
// it directly to zoom in/out on the home view.
export const introSettings: IntroSetting[] = [
  { name: "IntroView", ...deviceTransforms(null, 16) },
  { name: "InitialView", ...deviceTransforms(null, 47) },
];

export interface TechItem {
  icon: string;
  name: string;
}
export interface ProjectItem {
  name: string;
  url: string;
}
export type InteractiveBlock =
  | { type: "text"; content: string }
  | { type: "techList"; items: TechItem[] }
  | { type: "projectList"; items: ProjectItem[] };

export interface InteractiveObject {
  name: string;
  desktop: Transform;
  tablet: Transform;
  mobile: Transform;
  title: string;
  text?: string;
  blocks?: InteractiveBlock[];
}

// World positions of each hitbox's box center, from HitBoxes.tsx.
const CLOCK_POS = new THREE.Vector3(-5.224, 8.93, 5.051);
const LIBRARY_POS = new THREE.Vector3(6.194, 7.314, -3.256);
const CONTACT_POS = new THREE.Vector3(5.317, 5.371, 7.335);
const PARTICLES_POS = new THREE.Vector3(3.486, 9.749, -3.662);
const PHOTOS_POS = new THREE.Vector3(-5.236, 8.402, 0.147);

// Placeholder zoom values — starting guesses, meant to be hand-tuned live
// in-browser (the one genuinely per-hotspot constant that needs eyeballing).
export const interactiveObjects: InteractiveObject[] = [
  {
    name: "Library",
    ...deviceTransforms(LIBRARY_POS, 110),
    title: "Library",
    blocks: [
      {
        type: "text",
        content:
          "A shelf of the tools I reach for most. Swap this copy for your own stack breakdown.",
      },
      {
        type: "techList",
        items: [
          { icon: "/icons/html-5.svg", name: "HTML" },
          { icon: "/icons/css-3.svg", name: "CSS" },
          { icon: "/icons/js.svg", name: "JavaScript" },
          { icon: "/icons/react.svg", name: "React" },
          { icon: "/icons/nextjs.svg", name: "Next.js" },
          { icon: "/icons/tailwind.svg", name: "Tailwind" },
          { icon: "/icons/nodejs.svg", name: "Node.js" },
          { icon: "/icons/gsap.svg", name: "GSAP" },
        ],
      },
    ],
  },
  {
    name: "Clock",
    ...deviceTransforms(CLOCK_POS, 150),
    title: "Clock",
    text: "Placeholder copy — a short note about timing, process, or whatever this corner is meant to represent.",
  },
  {
    name: "Particles",
    ...deviceTransforms(PARTICLES_POS, 90),
    title: "Particles",
    text: "A morphing particle shader experiment, built with Three.js and custom GLSL — click to toggle between shapes. Placeholder copy — describe the technique here.",
  },
  {
    name: "Contact",
    ...deviceTransforms(CONTACT_POS, 160),
    title: "Contact",
    text: "Always open to new projects — reach out, or grab my details below.",
  },
  {
    name: "Photos",
    ...deviceTransforms(PHOTOS_POS, 70),
    title: "Photos",
    blocks: [
      {
        type: "text",
        content: "A few real projects, framed on the wall. Swap these placeholder titles/links for the real ones.",
      },
      {
        type: "projectList",
        items: [
          { name: "Project One", url: "#" },
          { name: "Project Two", url: "#" },
          { name: "Project Three", url: "#" },
          { name: "Project Four", url: "#" },
          { name: "Project Five", url: "#" },
        ],
      },
    ],
  },
];
