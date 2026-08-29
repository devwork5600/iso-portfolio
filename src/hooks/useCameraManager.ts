"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";
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

  // Stable proxy object driving the quaternion slerp tween below — must
  // persist across effect re-runs (unlike a fresh {t: 0} literal each time)
  // so gsap.killTweensOf can find and interrupt an in-flight one when the
  // user switches views again before it finishes.
  const quaternionProgress = useRef({ t: 0 }).current;

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

    gsap.killTweensOf([cam.position, cam.quaternion, cam, quaternionProgress]);

    gsap.to(cam.position, {
      duration,
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      ease,
      overwrite: true,
    });

    // Quaternions don't linearly interpolate component-by-component — lerping
    // x/y/z/w independently (as gsap.to(cam.quaternion, {x, y, z, w}) did)
    // produces a non-unit, warped rotation at every point except the exact
    // start/end, since the correct path between two orientations is a great
    // circle (slerp), not a straight line through 4D quaternion space. This
    // was invisible while every view shared nearly the same fixed isometric
    // orientation (barely any rotation to interpolate), but once hotspots
    // got their own hand-tuned orientations (see interactiveObjects.ts's
    // customTransform) a large swing between two very different orientations
    // — e.g. InitialView's fixed angle to Photos' custom one — visibly
    // wobbles/warps mid-transition. Driving slerp via a plain 0->1 progress
    // tween keeps GSAP's easing/duration but interpolates rotation correctly.
    const startQuaternion = cam.quaternion.clone();
    const endQuaternion = targetQuaternion.clone();
    quaternionProgress.t = 0;
    gsap.to(quaternionProgress, {
      t: 1,
      duration,
      ease,
      overwrite: true,
      onUpdate: () => {
        cam.quaternion.slerpQuaternions(startQuaternion, endQuaternion, quaternionProgress.t);
      },
    });

    gsap.to(cam, {
      duration,
      zoom,
      ease,
      overwrite: true,
      onUpdate: () => cam.updateProjectionMatrix(),
    });
  }, [targetPosition, targetQuaternion, zoom, camera, quaternionProgress]);
}
