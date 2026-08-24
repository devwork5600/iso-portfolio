import * as THREE from "three";
import { create } from "zustand";

interface CameraState {
  targetPosition: THREE.Vector3;
  targetQuaternion: THREE.Quaternion;
  zoom: number;

  setCameraTarget: (pos: THREE.Vector3, quat: THREE.Quaternion, zoom?: number) => void;
}

const useCamera = create<CameraState>((set) => ({
  targetPosition: new THREE.Vector3(),
  targetQuaternion: new THREE.Quaternion(),
  zoom: 40,

  setCameraTarget: (pos, quat, zoom) =>
    set({
      targetPosition: pos.clone(),
      targetQuaternion: quat.clone(),
      zoom: zoom ?? 40,
    }),
}));

export default useCamera;
