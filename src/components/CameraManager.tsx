"use client";

import { RefObject } from "react";
import * as THREE from "three";
import { useCameraManager } from "@/hooks/useCameraManager";

export function CameraManager({ camera }: { camera: RefObject<THREE.OrthographicCamera | null> }) {
  useCameraManager({ camera });
  return null;
}
