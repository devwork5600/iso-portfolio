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

// For hotspots hand-tuned directly via CameraGUI (position + Euler rotation
// dragged live, not derived from frameHotspot's fixed-isometric pan) —
// breaks from the "same orientation every view, only panned" rule the rest
// of the file follows, but that's the point: some shots (e.g. a wall-mounted
// object viewed flat-on) need their own free camera angle. Euler order
// 'XYZ' matches CameraGUI's cam.rotation.set(x, y, z) (three.js's default).
// Tablet/mobile aren't hand-tuned per breakpoint yet, so they reuse the
// same desktop position/rotation and only scale zoom, same ratios as
// deviceTransforms — replace with their own customTransform() once tuned.
function customTransform(
  position: [number, number, number],
  eulerDeg: [number, number, number],
  zoom: number,
): Transform {
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(eulerDeg[0]),
    THREE.MathUtils.degToRad(eulerDeg[1]),
    THREE.MathUtils.degToRad(eulerDeg[2]),
    "XYZ",
  );
  return {
    targetPosition: position,
    targetQuaternion: new THREE.Quaternion().setFromEuler(euler).toArray() as [number, number, number, number],
    zoom,
  };
}

function customDeviceTransforms(
  position: [number, number, number],
  eulerDeg: [number, number, number],
  desktopZoom: number,
) {
  return {
    desktop: customTransform(position, eulerDeg, desktopZoom),
    tablet: customTransform(position, eulerDeg, desktopZoom * 0.82),
    mobile: customTransform(position, eulerDeg, desktopZoom * 0.65),
  };
}

// Same as customTransform/customDeviceTransforms above, but reads straight
// off CameraGUI's Quaternion panel (X/Y/Z/W) — no Euler round-trip.
function customTransformQuat(
  position: [number, number, number],
  quaternion: [number, number, number, number],
  zoom: number,
): Transform {
  return {
    targetPosition: position,
    targetQuaternion: new THREE.Quaternion(...quaternion).normalize().toArray() as [
      number,
      number,
      number,
      number,
    ],
    zoom,
  };
}

function customDeviceTransformsQuat(
  position: [number, number, number],
  quaternion: [number, number, number, number],
  desktopZoom: number,
) {
  return {
    desktop: customTransformQuat(position, quaternion, desktopZoom),
    tablet: customTransformQuat(position, quaternion, desktopZoom * 0.82),
    mobile: customTransformQuat(position, quaternion, desktopZoom * 0.65),
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
const CONTACT_POS = new THREE.Vector3(5.317, 5.371, 7.335);

// Placeholder zoom values — starting guesses, meant to be hand-tuned live
// in-browser (the one genuinely per-hotspot constant that needs eyeballing).
export const interactiveObjects: InteractiveObject[] = [
  {
    name: "Library",
    ...customDeviceTransforms([7.2, 7.8, 4.861888696806017], [-1.8, 1.44, 0.36], 300),
    title: "Bibliothèque",
    blocks: [
      {
        type: "text",
        content:
          "J’ai commencé mon parcours de développeur par une formation centrée sur les bases du web. Cette première expérience m’a permis d’acquérir une compréhension solide du développement et des fondamentaux du code.",
      },
      {
        type: "techList",
        items: [
          { icon: "/icons/html-5.svg", name: "HTML" },
          { icon: "/icons/css-3.svg", name: "CSS" },
          { icon: "/icons/js.svg", name: "JavaScript" },
          { icon: "/icons/sql.svg", name: "SQL" },
          { icon: "/icons/php.svg", name: "PHP" },
        ],
      },
      {
        type: "text",
        content:
          "Par la suite, je me suis orienté vers le MERN stack, ce qui m’a permis d’élargir mes compétences et de gagner en autonomie sur la création d’applications complètes, du front au back.",
      },
      {
        type: "techList",
        items: [
          { icon: "/icons/mongodb.svg", name: "MongoDB" },
          { icon: "/icons/express.svg", name: "Express" },
          { icon: "/icons/react.svg", name: "React" },
          { icon: "/icons/nodejs.svg", name: "Node.js" },
        ],
      },
      {
        type: "text",
        content:
          "Aujourd’hui, je travaille principalement avec un écosystème moderne que j’utilise pour concevoir des interfaces dynamiques, fluides et immersives.",
      },
      {
        type: "techList",
        items: [
          { icon: "/icons/nextjs.svg", name: "Next.js" },
          { icon: "/icons/typescript.svg", name: "TypeScript" },
          { icon: "/icons/tailwind.svg", name: "Tailwind" },
          { icon: "/icons/shadcn.svg", name: "shadcn/ui" },
          { icon: "/icons/gsap.svg", name: "GSAP" },
          { icon: "/icons/docker.svg", name: "Docker" },
        ],
      },
      {
        type: "text",
        content:
          "Toujours curieux et passionné, j’aime découvrir de nouveaux outils, expérimenter et me tenir à jour sur les dernières évolutions du développement web.",
      },
    ],
  },
  {
    name: "Clock",
    ...customDeviceTransformsQuat([-4, 8.56, -1.47], [-0.00157, 0.726386, 0, 0.687284], 190),
    title: "Horloge",
    text: "Placeholder copy — a short note about timing, process, or whatever this corner is meant to represent.",
  },
  {
    name: "Particles",
    ...customDeviceTransforms([5, 10, 4.861888696806017], [-1.8, 1.44, 0.3], 203),
    title: "Particules",
    text: "A morphing particle shader experiment, built with Three.js and custom GLSL — click to toggle between shapes. Placeholder copy — describe the technique here.",
  },
  {
    name: "Contact",
    ...deviceTransforms(CONTACT_POS, 160),
    title: "Contact",
    text: "Toujours ouvert à de nouveaux projets — n'hésitez pas à me contacter, ou récupérez mes coordonnées ci-dessous.",
  },
  {
    name: "Photos",
    ...customDeviceTransforms([8.3, 8.4, 3], [-27, 89.64, 26.9], 160),
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
