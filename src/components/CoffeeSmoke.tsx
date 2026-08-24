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
// PartThreeModel.tsx's "Batman Mug" group's Object001 mesh (position
// [-0.012, -0.055, -0.035], scale 0.858) — i.e. this is meant to be
// rendered as a sibling of that mesh, inside the same outer group. The
// mug's local (pre-node-scale) bounding box top is Y ~ 0.098, so at
// Object001's own 0.858 scale the rim sits at roughly
// -0.055 + 0.098*0.858 ~= 0.029 in this shared frame. Starting guess —
// tune live in-browser like the other placeholder values in this project.
export const COFFEE_SMOKE_POSITION: [number, number, number] = [-0.012, 0.04, -0.035];
export const COFFEE_SMOKE_SCALE: [number, number, number] = [0.05, 0.16, 0.08];
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
