import * as THREE from "three";
import { JSX, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    ["-FREE-_Wall_Clock001"]: THREE.Mesh;
    ["22"]: THREE.Mesh;
    H: THREE.Mesh;
    M: THREE.Mesh;
    Sec: THREE.Mesh;
    t: THREE.Mesh;
    t001: THREE.Mesh;
    t002: THREE.Mesh;
    t003: THREE.Mesh;
    t004: THREE.Mesh;
    t005: THREE.Mesh;
    t006: THREE.Mesh;
    t007: THREE.Mesh;
    t008: THREE.Mesh;
    t009: THREE.Mesh;
    t010: THREE.Mesh;
    t011: THREE.Mesh;
    t012: THREE.Mesh;
    t024: THREE.Mesh;
    EU_wall_socket001: THREE.Mesh;
    FloorLamp_Bulb: THREE.Mesh;
    FloorLamp_Cover: THREE.Mesh;
    FloorLamp_Stem: THREE.Mesh;
    FloorLamp_Wire: THREE.Mesh;
    FloroLamp_WirePlug: THREE.Mesh;
    pasted__sodametals_pasted__coopermat1_0: THREE.Mesh;
    pasted__sofabody2_pasted__sofabody2Shape_bakedmtl2_0001: THREE.Mesh;
    pasted__sofabuttons_pasted__buttonsmat1_0001: THREE.Mesh;
    pasted__sofalegs_pasted__sofalegsShape_bakedmtl2_0: THREE.Mesh;
    Floor: THREE.Mesh;
    wall: THREE.Mesh;
    win_singleRectangleClosed: THREE.Mesh;
    Yucca_plant: THREE.Mesh;
  };
};

// This model ships with no embedded materials/textures — geometry only.
// Lighting is pre-baked into /textures/Part-1.jpg (mapped via each mesh's UV0),
// so a single unlit material is shared across every mesh instead of PBR shading.
// The wall clock now lives here (moved out of Part-4) — its hands still rotate
// to the real current time, same logic as PartFourModel's clock.
export function PartOneModel(props: JSX.IntrinsicElements["group"]) {
  // Part-1.glb is Draco-compressed — the second arg points useGLTF at the
  // self-hosted decoder in public/draco/ (copied from
  // three/examples/jsm/libs/draco/gltf/) instead of drei's default CDN path.
  const { nodes } = useGLTF("/models/Part-1.glb", "/draco/") as unknown as GLTFResult;
  const bakedTexture = useTexture("/textures/Part-1.jpg");

  const bakedMaterial = useMemo(() => {
    bakedTexture.flipY = false;
    bakedTexture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({ map: bakedTexture });
  }, [bakedTexture]);

  const hRef = useRef<THREE.Mesh>(null);
  const mRef = useRef<THREE.Mesh>(null);
  const secRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const date = new Date();
    const h = date.getHours() % 12;
    const m = date.getMinutes();
    const s = date.getSeconds() + date.getMilliseconds() / 1000;

    if (hRef.current) hRef.current.rotation.y = (h + m / 60) * (Math.PI / 6);
    if (mRef.current) mRef.current.rotation.y = (m + s / 60) * (Math.PI / 30);
    if (secRef.current) secRef.current.rotation.y = s * (Math.PI / 30);
  });

  return (
    <group {...props} dispose={null}>
      <group position={[3.549, -7.159, 2.128]} rotation={[-1.604, 0.094, -1.173]} scale={1.051}>
        <mesh
          geometry={nodes["-FREE-_Wall_Clock001"].geometry}
          material={bakedMaterial}
          position={[-5.922, -8.053, 14.16]}
          rotation={[-3.042, 0.002, -2.743]}
          scale={[-0.752, -0.076, -0.752]}
        >
          <mesh
            geometry={nodes["22"].geometry}
            material={bakedMaterial}
            position={[0, -0.813, 0]}
            rotation={[-Math.PI, 0, -Math.PI]}
            scale={[-0.009, -0.293, -0.009]}
          />
          <mesh ref={hRef} geometry={nodes.H.geometry} material={bakedMaterial} rotation={[-Math.PI, 0, -Math.PI]} scale={[-1, -9.944, -1]} />
          <mesh ref={mRef} geometry={nodes.M.geometry} material={bakedMaterial} rotation={[-Math.PI, 0, -Math.PI]} scale={[-1, -9.944, -1]} />
          <mesh ref={secRef} geometry={nodes.Sec.geometry} material={bakedMaterial} rotation={[-Math.PI, 0, -Math.PI]} scale={[-1, -9.944, -1]} />
          <mesh geometry={nodes.t.geometry} material={bakedMaterial} position={[0, -0.65, -0.915]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.238, 2.365, 0.238]} />
          <mesh geometry={nodes.t001.geometry} material={bakedMaterial} position={[0, -0.65, 0.797]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.238, 2.365, 0.238]} />
          <mesh geometry={nodes.t002.geometry} material={bakedMaterial} position={[0.804, -0.65, 0]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.238, 2.365, 0.238]} />
          <mesh geometry={nodes.t003.geometry} material={bakedMaterial} position={[-0.836, -0.65, 0]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.238, 2.365, 0.238]} />
          <mesh geometry={nodes.t004.geometry} material={bakedMaterial} position={[-0.722, -0.65, 0.418]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.238, 2.365, 0.238]} />
          <mesh geometry={nodes.t005.geometry} material={bakedMaterial} position={[0, -0.65, -0.797]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.238, 2.365, 0.238]} />
          <mesh geometry={nodes.t006.geometry} material={bakedMaterial} position={[-0.417, -0.65, 0.723]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.238, 2.365, 0.238]} />
          <mesh geometry={nodes.t007.geometry} material={bakedMaterial} position={[-0.397, -0.65, -0.693]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.238, 2.365, 0.238]} />
          <mesh geometry={nodes.t008.geometry} material={bakedMaterial} position={[-0.688, -0.65, -0.401]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.238, 2.365, 0.238]} />
          <mesh geometry={nodes.t009.geometry} material={bakedMaterial} position={[0.396, -0.65, -0.693]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.238, 2.365, 0.238]} />
          <mesh geometry={nodes.t010.geometry} material={bakedMaterial} position={[0.687, -0.65, -0.402]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.238, 2.365, 0.238]} />
          <mesh geometry={nodes.t011.geometry} material={bakedMaterial} position={[0.669, -0.65, 0.381]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.238, 2.365, 0.238]} />
          <mesh geometry={nodes.t012.geometry} material={bakedMaterial} position={[0.391, -0.65, 0.657]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.238, 2.365, 0.238]} />
          <mesh geometry={nodes.t024.geometry} material={bakedMaterial} position={[0, -0.65, 0]} rotation={[-3.123, -0.209, -3.137]} scale={[0.073, 0.728, 0.073]} />
        </mesh>
      </group>
      <group position={[-5.282, 2.955, 7.609]} rotation={[Math.PI / 2, 0, -1.575]} scale={0.91}>
        <mesh geometry={nodes.EU_wall_socket001.geometry} material={bakedMaterial} position={[-0.268, 0.022, -0.118]} scale={2.908} />
      </group>
      <group position={[-4.334, 2.321, 8.025]} rotation={[-Math.PI, 1.566, -Math.PI]} scale={4.152}>
        <mesh geometry={nodes.FloorLamp_Bulb.geometry} material={bakedMaterial} />
        <mesh geometry={nodes.FloorLamp_Cover.geometry} material={bakedMaterial} position={[0, 1.368, 0]} />
        <mesh geometry={nodes.FloorLamp_Stem.geometry} material={bakedMaterial} />
        <mesh geometry={nodes.FloorLamp_Wire.geometry} material={bakedMaterial} position={[0.006, 0.022, -0.006]} />
        <mesh geometry={nodes.FloroLamp_WirePlug.geometry} material={bakedMaterial} position={[0.042, 0.177, -0.196]} />
      </group>
      <group position={[-3.256, 2.325, 3.226]} rotation={[-Math.PI / 2, 0, 1.567]} scale={0.006}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[516.027, -370.667, 517.222]} rotation={[0, -1.567, 0]} scale={159.394}>
            <mesh geometry={nodes.pasted__sofalegs_pasted__sofalegsShape_bakedmtl2_0.geometry} material={bakedMaterial} position={[5.851, 5.541, 8.098]} />
          </group>
          <mesh geometry={nodes.pasted__sodametals_pasted__coopermat1_0.geometry} material={bakedMaterial} position={[-0.084, -4.267, -44.043]} rotation={[-Math.PI / 2, 0, 0]} scale={0.5} />
          <mesh geometry={nodes.pasted__sofabody2_pasted__sofabody2Shape_bakedmtl2_0001.geometry} material={bakedMaterial} position={[0, -4.267, 0]} />
          <mesh geometry={nodes.pasted__sofabuttons_pasted__buttonsmat1_0001.geometry} material={bakedMaterial} position={[0, -4.267, 0]} scale={5} />
        </group>
      </group>
      <mesh geometry={nodes.Floor.geometry} material={bakedMaterial} />
      <mesh geometry={nodes.wall.geometry} material={bakedMaterial} position={[-0.048, 7.096, -0.558]} rotation={[0, 0.778, 0]} scale={1.829} />
      <mesh geometry={nodes.win_singleRectangleClosed.geometry} material={bakedMaterial} position={[-2.154, 8.289, -4.501]} rotation={[0, 0.778, 0]} scale={1.829} />
      <mesh geometry={nodes.Yucca_plant.geometry} material={bakedMaterial} position={[-3.98, 2.326, -3.195]} rotation={[Math.PI, -1.454, Math.PI]} scale={2.834} />
    </group>
  );
}

useGLTF.preload("/models/Part-1.glb", "/draco/");
useTexture.preload("/textures/Part-1.jpg");
