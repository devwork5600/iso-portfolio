"use client";

import { useTexture, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Ported from isoroom-v3's src/experience/components/smoke/Smoke.tsx +
// shaders/coffeeSmoke/{vertex,fragment}.glsl, inlined as template strings
// (this project has no raw-loader/glslify-loader webpack config for .glsl
// imports) and using drei's shaderMaterial + extend, matching the pattern
// already established by ParticlesModel.tsx's morphParticlesMaterial.
//
// A single scrolling-noise plane: samples a Perlin noise texture, scrolls
// the sample UV upward over time to fake rising steam, remaps it into an
// alpha mask, and feathers the plane's edges so there's no visible border.

const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

void main() {
  vec2 smokeUv = vUv;
  smokeUv.x *= 0.5;
  smokeUv.y *= 0.3;
  smokeUv.y -= uTime * 0.07;

  float smoke = texture2D(uPerlinTexture, smokeUv).r;

  smoke = smoothstep(0.5, 1.0, smoke);

  smoke *= smoothstep(0.0, 0.2, vUv.x);
  smoke *= smoothstep(1.0, 0.8, vUv.x);
  smoke *= smoothstep(0.0, 0.1, vUv.y);
  smoke *= smoothstep(1.0, 0.3, vUv.y);

  gl_FragColor = vec4(1.0, 0.878, 0.761, smoke);
}
`;

const CoffeeSmokeMaterial = shaderMaterial(
  { uTime: 0, uPerlinTexture: null },
  vertexShader,
  fragmentShader,
);

extend({ CoffeeSmokeMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    coffeeSmokeMaterial: ThreeElements["shaderMaterial"];
  }
}

// Local-frame position/scale, expressed in the same coordinate frame as
// PartThreeModel.tsx's "Batman Mug" group's Object001/coffe meshes
// (position ~[-0.012, -0.055..-0.061, -0.035], scale 0.858) — i.e. this is
// meant to be rendered as a sibling of those meshes, inside the same outer
// group. X/Z and the surface Y are anchored to the real "coffe" mesh added
// in a later Part-3 re-export (the coffee liquid disc): its local geometry
// center, run through that mesh's own position/rotation(-0.257 rad Y)/
// scale, lands at roughly (0.014, 0.02, 0.028) in this shared frame — the
// mug's rim (from Object001's bbox) sits slightly above that at Y ~0.029.
//
// planeGeometry is centered on its own origin, so pinning POSITION's Y
// directly to the coffee surface would leave half the plane sunk below it
// (visually reading as smoke "in the coffee" instead of rising off it).
// Instead POSITION.y is derived as surface + half of SCALE's Y, so the
// plane's *bottom* edge sits on the coffee surface and stays pinned there
// even if SCALE is retuned later. Starting guess — tune live in-browser
// like the other placeholder values in this project.
const COFFEE_SURFACE_X = 0.014;
const COFFEE_SURFACE_Y = 0.02;
const COFFEE_SURFACE_Z = 0.028;
export const COFFEE_SMOKE_SCALE: [number, number, number] = [0.05, 0.16, 0.08];
export const COFFEE_SMOKE_POSITION: [number, number, number] = [
  COFFEE_SURFACE_X,
  COFFEE_SURFACE_Y + COFFEE_SMOKE_SCALE[1] / 2,
  COFFEE_SURFACE_Z,
];
export const COFFEE_SMOKE_ROTATION_Y = -0.257 + Math.PI / 16;

export function CoffeeSmoke() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const perlinTexture = useTexture("/textures/perlin.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  });

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uPerlinTexture.value = perlinTexture;
    }
  }, [perlinTexture]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh
      position={COFFEE_SMOKE_POSITION}
      scale={COFFEE_SMOKE_SCALE}
      rotation={[0, COFFEE_SMOKE_ROTATION_Y, 0]}
    >
      <planeGeometry args={[1, 1, 8, 64]} />
      <coffeeSmokeMaterial ref={materialRef} side={THREE.DoubleSide} transparent depthWrite={false} />
    </mesh>
  );
}

useTexture.preload("/textures/perlin.png");
