import * as THREE from "three";

/**
 * The room is viewed from a fixed isometric angle. To keep that look for
 * every hotspot, the camera is never rotated — only panned sideways
 * (perpendicular to the view direction) so a hotspot's world position lands
 * at screen center, and zoom changes. Because it's an orthographic camera,
 * panning without rotating keeps the view direction — and therefore the
 * quaternion — identical for every shot.
 */

const WORLD_UP = new THREE.Vector3(0, 1, 0);

export interface Framing {
  position: THREE.Vector3;
  target: THREE.Vector3;
  quaternion: THREE.Quaternion;
}

/**
 * Base framing of the room's fixed isometric camera: looking from
 * `basePosition` at `baseTarget`. Used as-is for InitialView/IntroView.
 */
export function baseFraming(basePosition: THREE.Vector3, baseTarget: THREE.Vector3): Framing {
  return panFraming(basePosition, baseTarget, 0, 0);
}

/**
 * Pan the base isometric camera by explicit amounts along its own
 * right/up basis vectors (screen-space sideways/vertical), without
 * changing its orientation — position and target shift by the identical
 * offset, so the direction between them (and therefore the quaternion) is
 * unchanged. This is the primitive `frameHotspot` builds on; use it
 * directly for a manual nudge (e.g. shifting a view a little up/down)
 * rather than centering on a specific world point.
 */
export function panFraming(
  basePosition: THREE.Vector3,
  baseTarget: THREE.Vector3,
  lateralRight: number,
  lateralUp: number,
): Framing {
  const forward = baseTarget.clone().sub(basePosition).normalize();
  const right = new THREE.Vector3().crossVectors(forward, WORLD_UP).normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();

  const position = basePosition.clone().addScaledVector(right, lateralRight).addScaledVector(up, lateralUp);
  const target = baseTarget.clone().addScaledVector(right, lateralRight).addScaledVector(up, lateralUp);

  const quaternion = new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().lookAt(position, target, WORLD_UP),
  );

  return { position, target, quaternion };
}

/**
 * Pan the base isometric camera so `worldPoint` is centered in frame,
 * without changing its orientation.
 */
export function frameHotspot(
  basePosition: THREE.Vector3,
  baseTarget: THREE.Vector3,
  worldPoint: THREE.Vector3,
): Framing {
  const forward = baseTarget.clone().sub(basePosition).normalize();
  const right = new THREE.Vector3().crossVectors(forward, WORLD_UP).normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();

  const offset = worldPoint.clone().sub(baseTarget);
  const lateralRight = offset.dot(right);
  const lateralUp = offset.dot(up);

  return panFraming(basePosition, baseTarget, lateralRight, lateralUp);
}
