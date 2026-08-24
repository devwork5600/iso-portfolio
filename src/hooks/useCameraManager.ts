"use client";

import gsap from "gsap";
import { useCallback, useEffect } from "react";
import * as THREE from "three";
import { interactiveObjects, introSettings } from "@/data/interactiveObjects";
import useCamera from "@/store/useCamera";
import useExperienceUIStore from "@/store/useExperienceUIStore";
import useInteractionStore from "@/store/useInteractionStore";
import { useResponsiveStore } from "@/store/useResponsiveStore";

export const CAMERA_TRANSITION_DURATION = 1.5;

export function useCameraManager({
  camera,
}: {
  camera: React.RefObject<THREE.OrthographicCamera | null>;
}) {
  const clickedObject = useInteractionStore((s) => s.clickedObject);
  const hasUserEntered = useExperienceUIStore((s) => s.hasUserEntered);

  const setCameraTarget = useCamera((s) => s.setCameraTarget);
  const targetPosition = useCamera((s) => s.targetPosition);
  const targetQuaternion = useCamera((s) => s.targetQuaternion);
  const zoom = useCamera((s) => s.zoom);

  const isMobile = useResponsiveStore((s) => s.isMobile);
  const isTablet = useResponsiveStore((s) => s.isTablet);

  const getTransformForDevice = useCallback(
    (name: string) => {
      const source =
        interactiveObjects.find((o) => o.name === name) ?? introSettings.find((o) => o.name === name);

      if (!source) return null;

      if (isMobile) return source.mobile;
      if (isTablet) return source.tablet;

      return source.desktop;
    },
    [isMobile, isTablet],
  );

  useEffect(() => {
    const viewName = hasUserEntered ? (clickedObject ?? "InitialView") : "IntroView";

    const config = getTransformForDevice(viewName);
    if (!config) return;

    const { targetPosition: pos, targetQuaternion: quat, zoom } = config;

    setCameraTarget(new THREE.Vector3().fromArray(pos), new THREE.Quaternion().fromArray(quat), zoom);
  }, [clickedObject, hasUserEntered, getTransformForDevice, setCameraTarget]);

  useEffect(() => {
    const cam = camera.current;
    if (!cam) return;

    const duration = CAMERA_TRANSITION_DURATION;
    const ease = "power3.inOut";

    gsap.killTweensOf([cam.position, cam.quaternion, cam]);

    gsap.to(cam.position, {
      duration,
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      ease,
      overwrite: true,
    });

    gsap.to(cam.quaternion, {
      duration,
      x: targetQuaternion.x,
      y: targetQuaternion.y,
      z: targetQuaternion.z,
      w: targetQuaternion.w,
      ease,
      overwrite: true,
    });

    gsap.to(cam, {
      duration,
      zoom,
      ease,
      overwrite: true,
      onUpdate: () => cam.updateProjectionMatrix(),
    });
  }, [targetPosition, targetQuaternion, zoom, camera]);
}
