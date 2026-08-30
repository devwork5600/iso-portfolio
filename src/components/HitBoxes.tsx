"use client";

import { useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { JSX, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import useInteractionStore from "@/store/useInteractionStore";

// Ported from room4's HitBoxes.tsx hover/corner-scale interaction, adapted to
// this project's own hitboxes.glb (different room, different box/corner
// transforms — room4's hand-tuned position/scale literals are specific to
// its file, so these are read straight from gltfjsx's output instead).
// Hover writes to useInteractionStore (InteractionHandler reads it on click
// to drive CameraManager); a hitbox's corners stay pinned lit while it's the
// current clickedObject, not just on hover.
//
// The "Corners" meshes ship with huge, off-origin local vertex coordinates
// (tens of units, a leftover from however they were modeled/arrayed in
// Blender) brought back down by a small baked node scale (~0.034). Applying
// the hover pop-in animation directly to that baked scale would fight its
// correct final size, so each corners mesh is wrapped in a group that carries
// the baked position/rotation/scale, and GSAP instead tweens *that group's*
// scale between 0 and 1 — a multiplier on top of the correct baked size.
// hitboxes.glb is currently a test export, with all 5 hitboxes' box+corners
// now present (mostly named generically Cube002/Cube012-017, though
// Library's and Contact's boxes kept their Box_library/Box_ncotact names —
// the Box_x/Corners_x naming is inconsistent across test re-exports).
// Corners meshes are always the baked, no-scale-needed ones.
type GLTFResult = GLTF & {
  nodes: {
    Box_library: THREE.Mesh;
    Box_ncotact: THREE.Mesh;
    Box_particles: THREE.Mesh;
    Cube002: THREE.Mesh;
    Cube012: THREE.Mesh;
    Cube013: THREE.Mesh;
    Cube014: THREE.Mesh;
    Cube015: THREE.Mesh;
    Cube016: THREE.Mesh;
    Cube017: THREE.Mesh;
  };
};

function HitBoxTrigger({
  name,
  boxGeometry,
  boxPosition,
  boxRotation,
  boxScale,
  cornersGeometry,
  cornersPosition,
  cornersRotation,
  cornersScale,
  hitBoxMaterial,
  cornersMaterial,
}: {
  name: string;
  boxGeometry: THREE.BufferGeometry;
  boxPosition: [number, number, number];
  boxRotation?: [number, number, number];
  boxScale: [number, number, number];
  cornersGeometry: THREE.BufferGeometry;
  cornersPosition: [number, number, number];
  cornersRotation?: [number, number, number];
  cornersScale: number;
  hitBoxMaterial: THREE.Material;
  cornersMaterial: THREE.Material;
}) {
  const cornersGroupRef = useRef<THREE.Group>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const setHoveredObject = useInteractionStore((s) => s.setHoveredObject);
  const isSelected = useInteractionStore((s) => s.clickedObject === name);

  const animateCorners = (visible: boolean) => {
    if (!cornersGroupRef.current) return;
    tween.current?.kill();
    tween.current = gsap.to(cornersGroupRef.current.scale, {
      x: visible ? 1 : 0,
      y: visible ? 1 : 0,
      z: visible ? 1 : 0,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  // Force the corner highlight hidden whenever selection state changes —
  // once this hitbox is the camera's current focus, the highlight would
  // just clutter the framed shot, so it stays transparent regardless of
  // hover (onPointerOver/Out below already skip animating while selected).
  useEffect(() => {
    animateCorners(false);
  }, [isSelected]);

  return (
    <>
      <group ref={cornersGroupRef} position={cornersPosition} rotation={cornersRotation} scale={0}>
        <mesh geometry={cornersGeometry} material={cornersMaterial} scale={cornersScale} />
      </group>
      <mesh
        geometry={boxGeometry}
        material={hitBoxMaterial}
        position={boxPosition}
        rotation={boxRotation}
        scale={boxScale}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          setHoveredObject(name);
          if (!isSelected) animateCorners(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          setHoveredObject(null);
          if (!isSelected) animateCorners(false);
          document.body.style.cursor = "auto";
        }}
      />
    </>
  );
}

export function HitBoxes(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF("/models/hitboxes.glb") as unknown as GLTFResult;

  const hitBoxMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
    [],
  );

  const cornersMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d8b18d",
        emissive: "#d8b18d",
        emissiveIntensity: 2,
      }),
    [],
  );

  return (
    <group {...props} dispose={null}>
      <HitBoxTrigger
        name="Clock"
        boxGeometry={nodes.Cube002.geometry}
        boxPosition={[-5.224, 8.537, -0.852]}
        boxScale={[0.088, 0.824, 0.824]}
        cornersGeometry={nodes.Cube013.geometry}
        cornersPosition={[-5.135, 8.531, -0.792]}
        cornersScale={1}
        hitBoxMaterial={hitBoxMaterial}
        cornersMaterial={cornersMaterial}
      />
      <HitBoxTrigger
        name="Photos"
        boxGeometry={nodes.Cube012.geometry}
        boxPosition={[-5.236, 8.402, 4.272]}
        boxScale={[0.041, 1.18, 2.152]}
        cornersGeometry={nodes.Cube014.geometry}
        cornersPosition={[-5.236, 8.402, 4.272]}
        cornersScale={1}
        hitBoxMaterial={hitBoxMaterial}
        cornersMaterial={cornersMaterial}
      />
      <HitBoxTrigger
        name="Library"
        boxGeometry={nodes.Box_library.geometry}
        boxPosition={[6.194, 7.314, -3.256]}
        boxScale={[1.183, 0.456, 0.33]}
        cornersGeometry={nodes.Cube015.geometry}
        cornersPosition={[6.194, 7.314, -2.925]}
        cornersScale={1}
        hitBoxMaterial={hitBoxMaterial}
        cornersMaterial={cornersMaterial}
      />
      <HitBoxTrigger
        name="Particles"
        boxGeometry={nodes.Box_particles.geometry}
        boxPosition={[0, 0, 0]}
        boxScale={[1, 1, 1]}
        cornersGeometry={nodes.Cube016.geometry}
        cornersPosition={[3.486, 9.749, -3.022]}
        cornersScale={1}
        hitBoxMaterial={hitBoxMaterial}
        cornersMaterial={cornersMaterial}
      />
      <HitBoxTrigger
        name="Contact"
        boxGeometry={nodes.Box_ncotact.geometry}
        boxPosition={[5.317, 5.371, 7.335]}
        boxRotation={[0, -0.691, 0]}
        boxScale={[0.387, 0.175, 0.459]}
        cornersGeometry={nodes.Cube017.geometry}
        cornersPosition={[5.019, 5.371, 7.088]}
        cornersRotation={[0, 0.919, 0]}
        cornersScale={1}
        hitBoxMaterial={hitBoxMaterial}
        cornersMaterial={cornersMaterial}
      />
    </group>
  );
}

useGLTF.preload("/models/hitboxes.glb");
