"use client";

import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { GUI } from "lil-gui";
import type { Controller } from "lil-gui";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type * as THREE from "three";

// Dev-only live camera tuning. Position/quaternion here are normally
// *derived* per view (baked at module load in interactiveObjects.ts via
// frameHotspot(BASE_POSITION, BASE_TARGET, worldPoint)), so dragging them
// won't correspond to anything reusable in source the way Zoom does — but
// they're still live-editable (not disabled) for direct in-browser
// exploration, matching isoroom-v3's CameraGUI. Quaternion, not Euler:
// interactiveObjects.ts's Transform.targetQuaternion and
// useCameraManager.ts's GSAP tween both use quaternion directly — Euler
// never appears anywhere in the camera pipeline.
export function CameraGUI({ camera }: { camera: RefObject<THREE.OrthographicCamera | null> }) {
  const controlsRef = useRef({ posX: 0, posY: 0, posZ: 0, qx: 0, qy: 0, qz: 0, qw: 0, zoom: 0 });
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

    const onQuaternionChange = () => {
      const cam = camera.current;
      if (!cam) return;
      gsap.killTweensOf(cam.quaternion);
      cam.quaternion.set(controls.qx, controls.qy, controls.qz, controls.qw).normalize();
    };

    const positionFolder = gui.addFolder("Position");
    const quaternionFolder = gui.addFolder("Quaternion");
    controllersRef.current = [
      positionFolder.add(controls, "posX", -50, 50).name("X").onChange(onPositionChange),
      positionFolder.add(controls, "posY", -50, 50).name("Y").onChange(onPositionChange),
      positionFolder.add(controls, "posZ", -50, 50).name("Z").onChange(onPositionChange),
      quaternionFolder.add(controls, "qx", -1, 1).name("X").onChange(onQuaternionChange),
      quaternionFolder.add(controls, "qy", -1, 1).name("Y").onChange(onQuaternionChange),
      quaternionFolder.add(controls, "qz", -1, 1).name("Z").onChange(onQuaternionChange),
      quaternionFolder.add(controls, "qw", -1, 1).name("W").onChange(onQuaternionChange),
    ];

    // While a field is actively being dragged, useFrame below must not
    // overwrite the control with the live camera value — normalize() after
    // a quaternion edit, in particular, changes the other components too,
    // which would otherwise fight the field still under the pointer.
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
    controls.qx = cam.quaternion.x;
    controls.qy = cam.quaternion.y;
    controls.qz = cam.quaternion.z;
    controls.qw = cam.quaternion.w;

    for (const controller of controllersRef.current) controller.updateDisplay();
  });

  return null;
}
