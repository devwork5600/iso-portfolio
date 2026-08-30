"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, ReactNode } from "react";
import * as THREE from "three";
import useInteractionStore from "@/store/useInteractionStore";
import { BASE_POSITION, BASE_TARGET } from "@/data/interactiveObjects";

const WORLD_UP = new THREE.Vector3(0, 1, 0);

/**
 * Pointer-driven parallax tilt, ported from room4's RoomParallax.tsx. The
 * camera stays fixed and this group (the room) tilts toward the pointer.
 *
 * Only the vertical axis is rotated around the camera's local "right" vector
 * rather than world X, so tilting stays aligned with the diagonal isometric
 * framing instead of swinging a wall into view.
 *
 * Rotation pivots around BASE_TARGET (the room's calibrated center), not
 * world origin — room4's room happens to sit near the origin so it didn't
 * need this, but this project's room doesn't. Pivoting at the origin would
 * swing far corners (e.g. the room's bottom edge) by roughly
 * distance-from-origin * angle, easily enough to slide past the camera's
 * fixed orthographic frustum and clip. The nested group cancels
 * BASE_TARGET's offset so children still render at their normal world
 * position when the outer group's rotation is identity.
 *
 * Freezes whenever a hotspot is focused (clickedObject set), so it doesn't
 * fight CameraManager's focused shot.
 */
export function RoomParallax({ children }: { children: ReactNode }) {
  const { pointer } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const yaw = useRef(0);
  const pitch = useRef(0);

  const rightAxis = useMemo(() => {
    const forward = BASE_TARGET.clone().sub(BASE_POSITION).normalize();
    return new THREE.Vector3().crossVectors(forward, WORLD_UP).normalize();
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    if (useInteractionStore.getState().clickedObject) return;

    // Kept modest so the room doesn't tilt past the grazing angle where the
    // camera's fixed rays overshoot the visible geometry near the bottom of
    // frame. (Part-1.glb's re-export dropped the old background "Plane"
    // node this was originally tuned around — the same tilt limits are kept
    // since they still read correctly against the current room geometry.)
    const targetYaw = pointer.x * Math.PI * 0.012;
    const targetPitch = pointer.y * Math.PI * 0.018;

    yaw.current = THREE.MathUtils.lerp(yaw.current, targetYaw, 0.1);
    pitch.current = THREE.MathUtils.lerp(pitch.current, targetPitch, 0.1);

    const qYaw = new THREE.Quaternion().setFromAxisAngle(WORLD_UP, yaw.current);
    const qPitch = new THREE.Quaternion().setFromAxisAngle(rightAxis, pitch.current);
    groupRef.current.quaternion.copy(qYaw.multiply(qPitch));
  });

  return (
    <group ref={groupRef} position={BASE_TARGET}>
      <group position={[-BASE_TARGET.x, -BASE_TARGET.y, -BASE_TARGET.z]}>{children}</group>
    </group>
  );
}
