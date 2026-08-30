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

// Per-device override for the deviceTransforms family: worldPoint stays
// optional (falls back to the desktop worldPoint, keeping the same pan)
// and zoom stays optional (falls back to the placeholder 0.82/0.65 scale
// of desktop) — so a hotspot can get a fully independent tablet/mobile
// shot (matching isoroom-v3's per-breakpoint hand-tuning) by supplying
// just the fields that need to change from the placeholder default.
interface PointDeviceOverride {
  worldPoint?: THREE.Vector3 | null;
  zoom?: number;
}

function deviceTransforms(
  worldPoint: THREE.Vector3 | null,
  desktopZoom: number,
  overrides?: { tablet?: PointDeviceOverride; mobile?: PointDeviceOverride },
) {
  const tabletPoint = overrides?.tablet?.worldPoint !== undefined ? overrides.tablet.worldPoint : worldPoint;
  const mobilePoint = overrides?.mobile?.worldPoint !== undefined ? overrides.mobile.worldPoint : worldPoint;

  return {
    desktop: toTransform(worldPoint, desktopZoom),
    tablet: toTransform(tabletPoint, overrides?.tablet?.zoom ?? desktopZoom * 0.82),
    mobile: toTransform(mobilePoint, overrides?.mobile?.zoom ?? desktopZoom * 0.65),
  };
}

// For hotspots hand-tuned directly via CameraGUI (position + Euler rotation
// dragged live, not derived from frameHotspot's fixed-isometric pan) —
// breaks from the "same orientation every view, only panned" rule the rest
// of the file follows, but that's the point: some shots (e.g. a wall-mounted
// object viewed flat-on) need their own free camera angle. Euler order
// 'XYZ' matches CameraGUI's cam.rotation.set(x, y, z) (three.js's default).
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

// Per-device override for customDeviceTransforms: position/eulerDeg/zoom
// each fall back independently to their desktop value (position/eulerDeg)
// or the placeholder 0.82/0.65 zoom scale — so a hotspot gets a fully
// independent tablet/mobile shot (matching isoroom-v3's per-breakpoint
// hand-tuning) by supplying just the fields that need to change.
interface CustomDeviceOverride {
  position?: [number, number, number];
  eulerDeg?: [number, number, number];
  zoom?: number;
}

function customDeviceTransforms(
  position: [number, number, number],
  eulerDeg: [number, number, number],
  desktopZoom: number,
  overrides?: { tablet?: CustomDeviceOverride; mobile?: CustomDeviceOverride },
) {
  return {
    desktop: customTransform(position, eulerDeg, desktopZoom),
    tablet: customTransform(
      overrides?.tablet?.position ?? position,
      overrides?.tablet?.eulerDeg ?? eulerDeg,
      overrides?.tablet?.zoom ?? desktopZoom * 0.82,
    ),
    mobile: customTransform(
      overrides?.mobile?.position ?? position,
      overrides?.mobile?.eulerDeg ?? eulerDeg,
      overrides?.mobile?.zoom ?? desktopZoom * 0.65,
    ),
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

// Same override shape as CustomDeviceOverride, but for the quaternion
// variant (quaternion instead of eulerDeg).
interface CustomDeviceOverrideQuat {
  position?: [number, number, number];
  quaternion?: [number, number, number, number];
  zoom?: number;
}

function customDeviceTransformsQuat(
  position: [number, number, number],
  quaternion: [number, number, number, number],
  desktopZoom: number,
  overrides?: { tablet?: CustomDeviceOverrideQuat; mobile?: CustomDeviceOverrideQuat },
) {
  return {
    desktop: customTransformQuat(position, quaternion, desktopZoom),
    tablet: customTransformQuat(
      overrides?.tablet?.position ?? position,
      overrides?.tablet?.quaternion ?? quaternion,
      overrides?.tablet?.zoom ?? desktopZoom * 0.82,
    ),
    mobile: customTransformQuat(
      overrides?.mobile?.position ?? position,
      overrides?.mobile?.quaternion ?? quaternion,
      overrides?.mobile?.zoom ?? desktopZoom * 0.65,
    ),
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
  // Tablet/mobile zoom hand-tuned live via CameraGUI (tablet at 1100x800,
  // mobile at 844x390 landscape) — position/rotation stay untouched
  // (worldPoint null -> baseFraming), since InitialView/IntroView are
  // always the fixed base isometric shot.
  { name: "InitialView", ...deviceTransforms(null, 47, { tablet: { zoom: 40.5 }, mobile: { zoom: 20 } }) },
];

export interface TechItem {
  icon: string;
  name: string;
}
// Per-project button styling, so each Photos link can read like a tiny
// piece of that site's own branding instead of one generic button style.
// textColor/bgColor are raw site-brand colors (not app theme tokens, so
// not Tailwind classes); borderRadius/font/fontSize/fontStyle are Tailwind
// utility classes, same convention as the rest of this file's UI strings.
export interface ProjectButtonStyle {
  textColor: string;
  bgColor: string;
  borderRadius: string;
  font: string;
  fontSize: string;
  fontStyle: string;
}

export interface ProjectItem {
  name: string;
  url: string;
  style: ProjectButtonStyle;
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
  /** Photos-only: link to the GitHub profile/repo, rendered as a button
   *  at the bottom of its sidebar panel. */
  githubUrl?: string;
}

// World positions of each hitbox's box center, from HitBoxes.tsx.
const CONTACT_POS = new THREE.Vector3(5.317, 5.371, 7.335);

// Placeholder position/rotation/zoom values — starting guesses, meant to
// be hand-tuned live in-browser at each breakpoint (resize to mobile/
// tablet width, adjust via CameraGUI, paste the numbers back in here).
// Tablet/mobile overrides below are dummy nudges in isoroom-v3's general
// spirit (each breakpoint gets its own independently hand-tuned shot, not
// just a scaled-down desktop zoom) — unverified in-browser, so treat the
// position/rotation numbers with real skepticism, not just zoom.
export const interactiveObjects: InteractiveObject[] = [
  {
    name: "Library",
    ...customDeviceTransforms([7.2, 7.8, 4.861888696806017], [-1.8, 1.44, 0.36], 300, {
      tablet: { position: [6.6, 7.8, 4.861888696806017], eulerDeg: [-1.8, 1.3, 0.36], zoom: 250 },
      // Hand-tuned live via CameraGUI at 390x844 (iPhone 12 Pro).
      mobile: { position: [6.5, 7.5, 4.8718], eulerDeg: [-1.8, 1.15, -0.1], zoom: 167 },
    }),
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
    ...customDeviceTransformsQuat([-4, 8.56, -1.47], [-0.00157, 0.726386, 0, 0.687284], 190, {
      tablet: { position: [-3.6, 8.56, -1.3], zoom: 160 },
      mobile: { position: [-3.2, 8.6, -1.1], zoom: 130 },
    }),
    title: "Horloge",
    text: "Placeholder copy — a short note about timing, process, or whatever this corner is meant to represent.",
  },
  {
    name: "Particles",
    ...customDeviceTransforms([5, 10, 4.861888696806017], [-1.8, 1.44, 0.3], 203, {
      // Hand-tuned live via CameraGUI at 1100x800.
      tablet: { position: [4.3, 9.6, 4.8618], eulerDeg: [-1.8, 1.3, 0.3], zoom: 162 },
      // Hand-tuned live via CameraGUI at 390x844 (iPhone 12 Pro).
      mobile: { position: [4, 9.8, 4.8618], eulerDeg: [-1.8, 1.15, 0.36], zoom: 106.5 },
    }),
    title: "Particules",
    text: "Une expérimentation de particules en morphing, réalisée avec Three.js et du GLSL sur-mesure — utilisez les boutons ci-dessous pour basculer entre les formes. Texte provisoire — à détailler.",
  },
  {
    name: "Contact",
    // Zoom hand-tuned live via CameraGUI at every tier (desktop at full
    // window width, tablet at 1100x800, mobile at 844x390 landscape) —
    // position/rotation confirmed unchanged from the desktop pan
    // (frameHotspot toward CONTACT_POS) at every tier.
    ...deviceTransforms(CONTACT_POS, 285.5, {
      tablet: { zoom: 244.5 },
      mobile: { zoom: 239 },
    }),
    title: "Contact",
    text: "Entre deux lignes de code et une gorgée de café, je suis toujours ouvert à de nouveaux projets. Télécharge ma carte de visite pour qu'on en parle !",
  },
  {
    name: "Photos",
    ...customDeviceTransforms([8.3, 8.4, 3], [-27, 89.64, 26.9], 190, {
      // Hand-tuned live via CameraGUI at 1100x800.
      tablet: { position: [2, 7.5, 2.7], eulerDeg: [-27, 100.44, 27], zoom: 164 },
      // Hand-tuned live via CameraGUI at 390x844 (iPhone 12 Pro). Rotation
      // read back within float noise of desktop's, so left unchanged.
      mobile: { position: [-4, 8.2, 4], eulerDeg: [-27, 89.64, 26.9], zoom: 118 },
    }),
    title: "Projets",
    githubUrl: "https://github.com/devwork5600",
    blocks: [
      {
        type: "text",
        content:
          "Explorez ma galerie : entre sites vitrines, boutiques en ligne et projets web interactifs, chaque création reflète une aventure unique.",
      },
      {
        // Order matches the wall's Photo-1..5 mesh order in PartTwoModel.tsx
        // (cocktail/cola/journal/lokko/nsfw) — each style pulled from that
        // site's real deployed colors/fonts (extracted via getComputedStyle
        // against the live page), not guessed.
        type: "projectList",
        items: [
          {
            name: "L'Élixir Doré",
            url: "https://cocktails-tan.vercel.app/",
            style: {
              textColor: "#d4af37",
              bgColor: "#1a1410",
              borderRadius: "rounded-md",
              font: "font-serif",
              fontSize: "text-lg",
              fontStyle: "italic",
            },
          },
          {
            // Real site: deep maroon page, cream/maroon nav pills — bg/
            // textColor already matched closely from that palette; radius
            // brought down from a full pill per feedback.
            name: "Breizh Cola",
            url: "https://breizh-cola-fawn.vercel.app/",
            style: {
              textColor: "#ffffff",
              bgColor: "#5d1622",
              borderRadius: "rounded-lg",
              font: "font-sans",
              fontSize: "text-xl",
              fontStyle: "not-italic",
            },
          },
          {
            // Real site ("La Voie de l'Info", an actualités/journal site):
            // header/footer navy (#0e1b30) instead of the CTA's rust-orange
            // — white text, sans (Geist — same family this app already
            // uses), 6px radius, medium weight.
            name: "La Voie de l'Info",
            url: "https://la-voie-de-l-info-web-five.vercel.app/",
            style: {
              textColor: "#ffffff",
              bgColor: "#0e1b30",
              borderRadius: "rounded-md",
              font: "font-sans font-medium",
              fontSize: "text-sm",
              fontStyle: "not-italic",
            },
          },
          {
            // Real site (Lokko marketplace): terracotta CTA (#c96442),
            // white text, sans medium weight, ~6px radius.
            name: "Lokko",
            url: "https://www.lokkohub.com/",
            style: {
              textColor: "#ffffff",
              bgColor: "#c96442",
              borderRadius: "rounded-md",
              font: "font-sans font-medium",
              fontSize: "text-base",
              fontStyle: "not-italic",
            },
          },
          {
            // Real site (NSFWGuard): blue accent (#5b8bd2), sharp 0px
            // corners, semibold sans — textColor corrected from an
            // earlier pink guess that didn't match anything on the site.
            name: "NSFW Protect",
            url: "https://nsfw-protect.com/",
            style: {
              textColor: "#5b8bd2",
              bgColor: "#0d0d0d",
              borderRadius: "rounded-none",
              font: "font-sans font-semibold",
              fontSize: "text-base",
              fontStyle: "not-italic",
            },
          },
        ],
      },
    ],
  },
];
