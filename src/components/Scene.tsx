"use client";

import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { CameraGUI } from "@/components/CameraGUI";
import { CameraManager } from "@/components/CameraManager";
import { FloorGrid } from "@/components/FloorGrid";
import { HitBoxes } from "@/components/HitBoxes";
import { InteractionHandler } from "@/components/InteractionHandler";
import { PartOneModel } from "@/components/PartOneModel";
import { PartTwoModel } from "@/components/PartTwoModel";
import { PartThreeModel } from "@/components/PartThreeModel";
import { ParticlesModel } from "@/components/ParticlesModel";
import { RoomParallax } from "@/components/RoomParallax";
import { BASE_POSITION, BASE_TARGET, introSettings } from "@/data/interactiveObjects";
import { baseFraming } from "@/lib/cameraFraming";

// Fixed isometric angle, target and resting zoom derived from the
// *projected* (screen-space) bounding box of every mesh across all 5 parts
// (excluding Part-1's giant background ground plane, which is meant to
// extend past the frame) — not a plain world-Y bounding box. For an
// isometric camera, on-screen vertical extent is a mix of world Y *and* the
// room's diagonal X/Z footprint, so centering on the room's world-Y center
// alone undershoots: the true projected vertical extent is ~24.25 world
// units. Computed via a one-off script projecting every mesh's world AABB
// corners onto the camera's actual right/up basis vectors. These live in
// data/interactiveObjects.ts (BASE_POSITION/BASE_TARGET) so RoomParallax
// shares the exact same values instead of duplicating its own copy.
const CAMERA_POSITION: [number, number, number] = BASE_POSITION.toArray() as [number, number, number];

export default function Scene() {
  const cameraRef = useRef<THREE.OrthographicCamera>(null);

  // Seed the camera's initial orientation to match IntroView exactly, so
  // CameraManager's GSAP tween starts from the already-correct isometric
  // quaternion — only zoom visibly animates on entry, no spin-in flash.
  const initialQuaternion = useMemo(() => baseFraming(BASE_POSITION, BASE_TARGET).quaternion, []);
  const introZoom = introSettings.find((s) => s.name === "IntroView")!.desktop.zoom;

  return (
    <Canvas shadows flat gl={{ preserveDrawingBuffer: true }}>
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        position={CAMERA_POSITION}
        quaternion={initialQuaternion}
        zoom={introZoom}
        near={0.1}
        far={1000}
      />
      <CameraManager camera={cameraRef} />
      <CameraGUI camera={cameraRef} />
      <InteractionHandler />
      {/* <ambientLight intensity={0.6} /> */}
      {/* <directionalLight position={[5, 8, 4]} intensity={1.2} castShadow /> */}
      <Suspense fallback={null}>
        <RoomParallax>
          <PartOneModel />
          <PartTwoModel />
          <PartThreeModel />
          <ParticlesModel />
          <FloorGrid />
          <HitBoxes />
        </RoomParallax>
      </Suspense>
    </Canvas>
  );
}
