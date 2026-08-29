"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { Raycaster } from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import type { Line2, LineSegments2 } from "three-stdlib";

// Ported from room4's FloorGrid.tsx. Room4's room shell is a single
// axis-aligned cube, so its grid is plain min/max on world X/Z. This
// project's room floor (Part-1.glb's "Floor" node) is instead rotated
// 0.7775 rad about Y — read from the node's own transform (center
// [1.135786, 2.122397] on X/Z, local half-extent 5.261986 * scale 2.188312 =
// 11.514867) — so the whole grid (cell tests *and* the highlight square) is
// built in the floor's own local (unrotated) frame, not world X/Z. An
// axis-aligned grid under a 44.5deg-rotated room made every boundary cell
// straddle the room's actual diamond-shaped edge — highlighted squares
// visibly clipped into/out of the room instead of tiling flush against it.
//
// CELL_SIZE is derived so the room's footprint is exactly 5x5 cells, so
// "under the room" is a clean, exact block of cell indices rather than a
// separate continuous rotated-rect test that could disagree with the grid
// by a fraction of a cell at the boundary — while still landing close to
// room4's own hand-picked cell size (~4.755) for a comparable visual density.
//
// The highlight itself sits on the separate background "Plane" node
// (axis-aligned, Y=0.632848 vs the room floor's Y=1.856887), matching
// room4's behavior of only lighting up background cells outside the room.
//
// FloorGrid is rendered inside RoomParallax's tilting group, so the pointer
// event's `event.point` is true *world* space, already including whatever
// tilt is currently applied — but ROOM_CENTER_X/Z/ROOM_ROTATION_Y describe
// the room's fixed rest pose only. At rest (tilt = identity) those match, so
// this was invisible until the parallax tilt was added; under any nonzero
// tilt (particularly the pitch component, which rotates around a non-vertical
// axis and pulls the "flat" floor out of the world XZ plane) the two frames
// diverge and the highlight square lands nowhere near the actual hovered
// cell. Fixed by converting the pointer hit into this component's own outer
// group's local space first (outerGroupRef.worldToLocal), which cancels out
// every ancestor transform — RoomParallax's tilt included — before applying
// the room-rotation math below. The highlight <Line> stays a child of that
// same group, so it inherits the current tilt correctly once its input
// coordinates are right.
const ROOM_CENTER_X = 1.1357855796813965;
const ROOM_CENTER_Z = 2.12239670753479;
const ROOM_ROTATION_Y = 0.777501936758369;
const ROOM_HALF_EXTENT = 11.514866906061798;

const FLOOR_Y = 0.6328482031822205 + 0.02;

// Diamond point-to-point size (in the room's local frame) — sized so the
// room's footprint spans exactly 3 grid cells across (see isUnderRoom: the
// excluded block is a literal 3x3 = 9 cells at the center, not a geometric
// best-fit to the room's true diamond footprint in the UV frame — a plain
// index-block match is what actually reads right, since the two diamond
// shapes (room and grid cell) don't line up corner-to-corner).
const DIAMOND_SIZE = (ROOM_HALF_EXTENT * 2) / 3;

// The grid actually tiles in a frame rotated 45deg from the room's local
// X/Z — i.e. plain touching squares in that frame, which read as gapless
// diamonds back in local X/Z (see localToDiamondFrame/diamondFrameToLocal).
// Drawing diamonds by just rotating each square's own corners (an earlier
// version of this file) put each point at DIAMOND_SIZE/2 * sqrt(2) from its
// center, which overlaps the *next* cell over along the local axes — visibly
// confirmed by lighting up every cell at once (DEBUG_SHOW_ALL_CELLS): the
// crossing "X" shapes were literally cells overlapping their axis neighbors.
// A later fix (points at exactly DIAMOND_SIZE/2) stopped that overlap but
// only let diamonds touch along the local X/Z axes — nothing filled the
// gaps toward diagonal neighbors, which reads as extra "missing" diamonds
// especially near the room's corners. Building the grid in the rotated
// frame is the actual fix: it's the same trick as gltf UV tiling — a plain
// square grid, just viewed 45deg off-axis, tiles with zero gaps everywhere.
const GRID_STEP = DIAMOND_SIZE * Math.SQRT1_2;

// Large enough to cover the whole visible background regardless of camera framing.
const PLANE_SIZE = ROOM_HALF_EXTENT * 20;

// DEBUG: renders every cell in DEBUG_RANGE at once (skipping the room
// block), fully lit, instead of only the hovered one — for visually
// checking the whole grid's alignment/overlap in one shot. Remove before
// shipping.
const DEBUG_SHOW_ALL_CELLS = false;
const DEBUG_RANGE = 15;

// World point -> room-local (unrotated) frame.
function worldToLocal(worldX: number, worldZ: number): [number, number] {
  const dx = worldX - ROOM_CENTER_X;
  const dz = worldZ - ROOM_CENTER_Z;
  const cos = Math.cos(-ROOM_ROTATION_Y);
  const sin = Math.sin(-ROOM_ROTATION_Y);
  return [dx * cos - dz * sin, dx * sin + dz * cos];
}

// Room-local (unrotated) frame -> world point, inverse of worldToLocal.
function localToWorld(localX: number, localZ: number): [number, number] {
  const cos = Math.cos(ROOM_ROTATION_Y);
  const sin = Math.sin(ROOM_ROTATION_Y);
  return [localX * cos - localZ * sin + ROOM_CENTER_X, localX * sin + localZ * cos + ROOM_CENTER_Z];
}

// Room-local X/Z <-> the 45deg-rotated frame the grid tiles in. Standard
// rotation by 45deg (cos === sin === SQRT1_2), so it's its own near-inverse
// (diamondFrameToLocal undoes localToDiamondFrame exactly).
function localToDiamondFrame(localX: number, localZ: number): [number, number] {
  return [(localX + localZ) * Math.SQRT1_2, (localX - localZ) * Math.SQRT1_2];
}

function diamondFrameToLocal(u: number, v: number): [number, number] {
  return [(u + v) * Math.SQRT1_2, (u - v) * Math.SQRT1_2];
}

// Grid-frame cell boundaries fall at (index +/- 0.5) * GRID_STEP, so index 0
// is centered on the room's own local origin instead of on a grid line.
function toCellIndex(coord: number): number {
  return Math.floor(coord / GRID_STEP + 0.5);
}

// World-space diamond outline for grid cell (cellU, cellV) — a plain
// touching square in the rotated grid frame, converted corner-by-corner
// back to the room's local X/Z (where it reads as a diamond) and then to
// world space.
function cellDiamondPoints(cellU: number, cellV: number): [number, number, number][] {
  const u0 = cellU * GRID_STEP;
  const v0 = cellV * GRID_STEP;
  const half = GRID_STEP / 2;

  const gridCorners: [number, number][] = [
    [u0 - half, v0 - half],
    [u0 + half, v0 - half],
    [u0 + half, v0 + half],
    [u0 - half, v0 + half],
    [u0 - half, v0 - half],
  ];

  return gridCorners.map(([u, v]) => {
    const [localX, localZ] = diamondFrameToLocal(u, v);
    const [x, z] = localToWorld(localX, localZ);
    return [x, FLOOR_Y, z];
  });
}

// The room's true footprint, mapped into grid-cell indices, is itself a
// diamond (an L1 ball) in the UV frame — a geometric closest-point overlap
// test against that diamond was tried first, but the two diamond shapes
// (room vs. individual grid cell) don't share the same 45deg corners, so
// the "overlap" region came out as a rounded diamond of index cells
// (e.g. 25 cells at this DIAMOND_SIZE) instead of a clean block — reading
// as extra "missing" cells scattered past the room's actual visual edge.
// A plain literal 3x3 index block, centered on the room, is what actually
// reads right: exactly the 9 cells DIAMOND_SIZE was tuned to match the
// room's footprint against.
function isUnderRoom(cellU: number, cellV: number): boolean {
  return Math.abs(cellU) <= 1 && Math.abs(cellV) <= 1;
}

// DEBUG only — see DEBUG_SHOW_ALL_CELLS above.
function DebugAllCells() {
  const cells: [number, number][] = [];
  for (let cellU = -DEBUG_RANGE; cellU <= DEBUG_RANGE; cellU++) {
    for (let cellV = -DEBUG_RANGE; cellV <= DEBUG_RANGE; cellV++) {
      if (!isUnderRoom(cellU, cellV)) cells.push([cellU, cellV]);
    }
  }

  return (
    <>
      {cells.map(([cellU, cellV]) => (
        <Line
          key={`${cellU}_${cellV}`}
          points={cellDiamondPoints(cellU, cellV)}
          color="#d8b18d"
          lineWidth={2}
          toneMapped={false}
        />
      ))}
    </>
  );
}

export function FloorGrid() {
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);
  const outerGroupRef = useRef<Group>(null);
  const planeRef = useRef<Mesh>(null);
  const lineRef = useRef<Line2 | LineSegments2>(null);
  const opacityRef = useRef(0);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  // Dedicated Raycaster, separate from R3F's own — R3F only raycasts
  // against objects that carry a JSX pointer handler (its internal
  // `interaction` list), so the room's plain visual meshes (walls, sofa,
  // desk — none of which have handlers) are invisible to it and never
  // block this plane's onPointerMove, even when they're the thing actually
  // drawn under the cursor. Re-raycasting the *whole* scene from the same
  // ray on every move (same technique drei's <Html occlude> uses) finds
  // the true nearest hit regardless of handlers, so hovering room geometry
  // that sits in front of the background plane correctly suppresses it.
  const occluderRaycaster = useMemo(() => new Raycaster(), []);

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (!outerGroupRef.current || !planeRef.current) return;

    occluderRaycaster.set(event.ray.origin, event.ray.direction);
    // Line2/LineSegments2 (the drei <Line> highlight + debug grid) need
    // raycaster.camera set for their fat-line raycast — R3F's own shared
    // raycaster gets this from its internal compute step, but this
    // dedicated instance doesn't unless set explicitly.
    occluderRaycaster.camera = camera;
    const nearest = occluderRaycaster.intersectObjects(scene.children, true)[0];
    if (!nearest || nearest.object !== planeRef.current) {
      setHoveredCell(null);
      return;
    }

    const localPoint = outerGroupRef.current.worldToLocal(nearest.point.clone());
    const [localX, localZ] = worldToLocal(localPoint.x, localPoint.z);
    const [u, v] = localToDiamondFrame(localX, localZ);
    const cellU = toCellIndex(u);
    const cellV = toCellIndex(v);

    setHoveredCell(isUnderRoom(cellU, cellV) ? null : [cellU, cellV]);
  };

  const handlePointerLeave = () => {
    setHoveredCell(null);
  };

  // Snaps instantly to the hovered cell (no sliding) — only opacity animates.
  //
  // Drawn as a diamond (see cellDiamondPoints) rather than a plain
  // room-aligned square: ROOM_ROTATION_Y (44.5deg) happens to be very close
  // to the 45deg angle of this isometric camera's own screen axes, so a
  // plain square projects as a near-axis-aligned rectangle on screen — while
  // the floor's decorative herringbone texture (rotated independently of
  // ROOM_ROTATION_Y) reads as a 45deg diamond. Drawing a diamond instead
  // makes the highlight match that look rather than reading as a detached
  // rectangle next to it. Hover-testing above is untouched either way,
  // still keyed to the room's true edges.
  const highlightPoints = useMemo(() => {
    const [cellU, cellV] = hoveredCell ?? [0, 0];
    return cellDiamondPoints(cellU, cellV);
  }, [hoveredCell]);

  useFrame((_, delta) => {
    const material = lineRef.current?.material as { opacity: number } | undefined;
    if (!material) return;

    const lerpSpeed = 1 - Math.exp(-delta * 10);
    const targetOpacity = hoveredCell ? 1 : 0;
    opacityRef.current += (targetOpacity - opacityRef.current) * lerpSpeed;
    material.opacity = opacityRef.current;
  });

  return (
    <group ref={outerGroupRef}>
      <mesh
        ref={planeRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, FLOOR_Y, 0]}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[PLANE_SIZE, PLANE_SIZE]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {DEBUG_SHOW_ALL_CELLS ? (
        <DebugAllCells />
      ) : (
        <Line
          ref={lineRef}
          points={highlightPoints}
          color="#d8b18d"
          lineWidth={5.1}
          toneMapped={false}
          transparent
          opacity={0}
        />
      )}
    </group>
  );
}
