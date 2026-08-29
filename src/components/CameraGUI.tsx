"use client";

import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { GUI } from "lil-gui";
import type { Controller } from "lil-gui";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";

// Dev-only live camera tuning. Position/rotation here are normally
// *derived* per view (baked at module load in interactiveObjects.ts via
// frameHotspot(BASE_POSITION, BASE_TARGET, worldPoint)), so dragging them
// won't correspond to anything reusable in source the way Zoom does — but
// they're still live-editable (not disabled) for direct in-browser
// exploration, matching isoroom-v3's CameraGUI. Euler (degrees), not
// quaternion: interactiveObjects.ts stores Transform.targetQuaternion and
// useCameraManager.ts's slerp tween both use quaternion directly, but XYZW
// components aren't something a human can reason about while dragging —
// Euler is only for this panel's human-facing editing/reading. cam.rotation
// and cam.quaternion are kept in sync automatically by three.js in both
// directions (Object3D wires each to update the other on change), so
// setting cam.rotation here is enough; no manual conversion needed.
export function CameraGUI({ camera }: { camera: RefObject<THREE.OrthographicCamera | null> }) {
  const controlsRef = useRef({
    posX: 0,
    posY: 0,
    posZ: 0,
    rotXDeg: 0,
    rotYDeg: 0,
    rotZDeg: 0,
    zoom: 0,
  });
  const controllersRef = useRef<Controller[]>([]);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const controls = controlsRef.current;
    const gui = new GUI({ title: "Camera" });
    gui.domElement.style.zIndex = "9999";

    const onPositionChange = () => {
      const cam = camera.current;
      if (!cam) return;
      gsap.killTweensOf(cam.position);
      cam.position.set(controls.posX, controls.posY, controls.posZ);
    };

    const onRotationChange = () => {
      const cam = camera.current;
      if (!cam) return;
      gsap.killTweensOf(cam.quaternion);
      cam.rotation.set(
        THREE.MathUtils.degToRad(controls.rotXDeg),
        THREE.MathUtils.degToRad(controls.rotYDeg),
        THREE.MathUtils.degToRad(controls.rotZDeg),
      );
    };

    const positionFolder = gui.addFolder("Position");
    const rotationFolder = gui.addFolder("Rotation (Euler, deg)");
    controllersRef.current = [
      positionFolder.add(controls, "posX", -200, 200).name("X").onChange(onPositionChange),
      positionFolder.add(controls, "posY", -200, 200).name("Y").onChange(onPositionChange),
      positionFolder.add(controls, "posZ", -200, 200).name("Z").onChange(onPositionChange),
      rotationFolder.add(controls, "rotXDeg", -180, 180).name("X").onChange(onRotationChange),
      rotationFolder.add(controls, "rotYDeg", -180, 180).name("Y").onChange(onRotationChange),
      rotationFolder.add(controls, "rotZDeg", -180, 180).name("Z").onChange(onRotationChange),
    ];

    // While a field is actively being dragged, useFrame below must not
    // overwrite the control with the live camera value.
    for (const controller of controllersRef.current) {
      controller.domElement.addEventListener("pointerdown", () => {
        draggingRef.current = true;
      });
    }
    window.addEventListener("pointerup", () => {
      draggingRef.current = false;
    });

    gui
      .add(controls, "zoom", 5, 300, 0.5)
      .name("Zoom (live)")
      .onChange((zoom: number) => {
        const cam = camera.current;
        if (!cam) return;
        gsap.killTweensOf(cam);
        cam.zoom = zoom;
        cam.updateProjectionMatrix();
      });

    if (camera.current) controls.zoom = camera.current.zoom;

    return () => {
      gui.destroy();
    };
  }, [camera]);

  useFrame(() => {
    if (process.env.NODE_ENV === "production") return;
    if (draggingRef.current) return;
    const cam = camera.current;
    if (!cam) return;

    const controls = controlsRef.current;
    controls.posX = cam.position.x;
    controls.posY = cam.position.y;
    controls.posZ = cam.position.z;
    controls.rotXDeg = THREE.MathUtils.radToDeg(cam.rotation.x);
    controls.rotYDeg = THREE.MathUtils.radToDeg(cam.rotation.y);
    controls.rotZDeg = THREE.MathUtils.radToDeg(cam.rotation.z);

    for (const controller of controllersRef.current) controller.updateDisplay();
  });

  return null;
}
