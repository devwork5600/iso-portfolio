# iso-portfolio

A 3D isometric-room portfolio — an interactive diorama you navigate to reach
projects, skills, and contact info, instead of a traditional scrolling page.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **React Three Fiber** / **three.js** — the 3D scene
- **@react-three/drei** — camera, model loading, and R3F helpers
- **GSAP** — camera tweening and UI entry animations
- **zustand** — app/interaction/camera state
- **Tailwind CSS** — UI shell styling

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/          Next.js routes
  components/   R3F scene components + UI shell
  store/        zustand stores (camera, interaction, UI state)
  data/         content/config for hotspots and camera transforms
  lib/          framing/camera math and other pure helpers
  hooks/        custom React hooks
  utils/        small shared utilities
```

## Roadmap

Built up in stages, from a bare rotating cube to the full experience —
see the commit history for the step-by-step build.
