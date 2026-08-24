"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import useExperienceUIStore from "@/store/useExperienceUIStore";
import useInteractionStore from "@/store/useInteractionStore";

/**
 * The room geometry (walls/floor) fills the whole frame, so R3F's
 * onPointerMissed (which only fires when the raycaster hits nothing) never
 * fires reliably for "click elsewhere". Instead: a plain click listener that
 * checks the currently *hovered* hitbox at click time — select it if it's
 * not already selected, or deselect if nothing is hovered.
 */
export function InteractionHandler() {
  const { gl } = useThree();
  const experienceStarted = useExperienceUIStore((s) => s.experienceStarted);

  useEffect(() => {
    if (!experienceStarted) return;

    const canvas = gl.domElement;

    const handleClick = () => {
      const { hoveredObject, clickedObject, setClickedObject } = useInteractionStore.getState();

      if (hoveredObject && hoveredObject !== clickedObject) {
        setClickedObject(hoveredObject);
      } else if (!hoveredObject) {
        setClickedObject(null);
      }
    };

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [gl.domElement, experienceStarted]);

  return null;
}
