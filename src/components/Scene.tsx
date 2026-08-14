"use client";

import { OrthographicCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// Fixed isometric angle: equal offset on X/Y/Z looking at the origin.
const CAMERA_POSITION: [number, number, number] = [10, 10, 10];

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.4;
    meshRef.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
}

export default function Scene() {
  return (
    <Canvas>
      <OrthographicCamera
        makeDefault
        position={CAMERA_POSITION}
        zoom={100}
        near={0.1}
        far={1000}
        onUpdate={(camera) => camera.lookAt(0, 0, 0)}
      />
      <RotatingCube />
    </Canvas>
  );
}
