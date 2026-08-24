import * as THREE from "three";
import { JSX, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    ["Photo-1"]: THREE.Mesh;
    ["Photo-2"]: THREE.Mesh;
    ["Photo-3"]: THREE.Mesh;
    ["Photo-4"]: THREE.Mesh;
    ["Photo-5"]: THREE.Mesh;
    ["PhotoFrame-1"]: THREE.Mesh;
    ["PhotoFrame-2"]: THREE.Mesh;
    ["PhotoFrame-3"]: THREE.Mesh;
    ["PhotoFrame-4"]: THREE.Mesh;
    ["PhotoFrame-5"]: THREE.Mesh;
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
  };
};

// This model ships with no embedded materials/textures — geometry only.
// Lighting is pre-baked into /textures/Part-4.png (mapped via each mesh's UV0),
// so a single unlit material is shared across every mesh instead of PBR shading,
// except the 5 photos (real website screenshots) and the clock hands (real time).
export function PartFourModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF("/models/Part-4.glb") as unknown as GLTFResult;
  const bakedTexture = useTexture("/textures/Part-4.png");

  const bakedMaterial = useMemo(() => {
    bakedTexture.flipY = false;
    bakedTexture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({ map: bakedTexture });
  }, [bakedTexture]);

  const [cocktailTexture, colaTexture, journalTexture, lbcTexture, nsfwTexture] = useTexture(
    [
      "/website-screen/cocktail.png",
      "/website-screen/cola.png",
      "/website-screen/journal.png",
      "/website-screen/lbc.png",
      "/website-screen/nsfw.png",
    ],
    (textures) => {
      for (const texture of textures) {
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;
      }
    },
  );

  const photo1Material = useMemo(
    () => new THREE.MeshBasicMaterial({ map: cocktailTexture }),
    [cocktailTexture],
  );
  const photo2Material = useMemo(
    () => new THREE.MeshBasicMaterial({ map: colaTexture }),
    [colaTexture],
  );
  const photo3Material = useMemo(
    () => new THREE.MeshBasicMaterial({ map: journalTexture }),
    [journalTexture],
  );
  const photo4Material = useMemo(
    () => new THREE.MeshBasicMaterial({ map: lbcTexture }),
    [lbcTexture],
  );
  const photo5Material = useMemo(
    () => new THREE.MeshBasicMaterial({ map: nsfwTexture }),
    [nsfwTexture],
  );

  // Hour/minute/second hands rotate to match the real current time.
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
      <mesh
        geometry={nodes["Photo-1"].geometry}
        material={photo1Material}
        position={[-6.563, 9.959, -2.197]}
        rotation={[Math.PI / 2, 0, -1.563]}
        scale={1.922}
      />
      <mesh
        geometry={nodes["Photo-2"].geometry}
        material={photo2Material}
        position={[-6.577, 9.959, -0.458]}
        rotation={[Math.PI / 2, 0, -1.563]}
        scale={2.044}
      />
      <mesh
        geometry={nodes["Photo-3"].geometry}
        material={photo3Material}
        position={[-6.591, 9.886, 1.232]}
        rotation={[Math.PI / 2, 0, -1.563]}
        scale={1.922}
      />
      <mesh
        geometry={nodes["Photo-4"].geometry}
        material={photo4Material}
        position={[-6.571, 8.496, -1.244]}
        rotation={[Math.PI / 2, 0, -1.563]}
        scale={2.331}
      />
      <mesh
        geometry={nodes["Photo-5"].geometry}
        material={photo5Material}
        position={[-6.587, 8.447, 0.801]}
        rotation={[Math.PI / 2, 0, -1.563]}
        scale={2.255}
      />
      <mesh
        geometry={nodes["PhotoFrame-1"].geometry}
        material={bakedMaterial}
        position={[-6.563, 9.959, -2.197]}
        rotation={[Math.PI / 2, 0, -1.563]}
        scale={1.922}
      />
      <mesh
        geometry={nodes["PhotoFrame-2"].geometry}
        material={bakedMaterial}
        position={[-6.577, 9.959, -0.458]}
        rotation={[Math.PI / 2, 0, -1.563]}
        scale={2.044}
      />
      <mesh
        geometry={nodes["PhotoFrame-3"].geometry}
        material={bakedMaterial}
        position={[-6.591, 9.886, 1.232]}
        rotation={[Math.PI / 2, 0, -1.563]}
        scale={1.922}
      />
      <mesh
        geometry={nodes["PhotoFrame-4"].geometry}
        material={bakedMaterial}
        position={[-6.571, 8.496, -1.244]}
        rotation={[Math.PI / 2, 0, -1.563]}
        scale={2.331}
      />
      <mesh
        geometry={nodes["PhotoFrame-5"].geometry}
        material={bakedMaterial}
        position={[-6.587, 8.447, 0.801]}
        rotation={[Math.PI / 2, 0, -1.563]}
        scale={2.255}
      />
      <mesh
        geometry={nodes["-FREE-_Wall_Clock001"].geometry}
        material={bakedMaterial}
        position={[-6.063, 9.866, 5.625]}
        rotation={[1.574, -0.001, -1.568]}
        scale={[-0.752, -0.076, -0.752]}
      >
        <mesh
          geometry={nodes["22"].geometry}
          material={bakedMaterial}
          position={[0, -0.813, 0]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[-0.009, -0.293, -0.009]}
        />
        <mesh
          ref={hRef}
          geometry={nodes.H.geometry}
          material={bakedMaterial}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[-1, -9.944, -1]}
        />
        <mesh
          ref={mRef}
          geometry={nodes.M.geometry}
          material={bakedMaterial}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[-1, -9.944, -1]}
        />
        <mesh
          ref={secRef}
          geometry={nodes.Sec.geometry}
          material={bakedMaterial}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[-1, -9.944, -1]}
        />
        <mesh
          geometry={nodes.t.geometry}
          material={bakedMaterial}
          position={[0, -0.65, -0.915]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.238, 2.365, 0.238]}
        />
        <mesh
          geometry={nodes.t001.geometry}
          material={bakedMaterial}
          position={[0, -0.65, 0.797]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.238, 2.365, 0.238]}
        />
        <mesh
          geometry={nodes.t002.geometry}
          material={bakedMaterial}
          position={[0.804, -0.65, 0]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.238, 2.365, 0.238]}
        />
        <mesh
          geometry={nodes.t003.geometry}
          material={bakedMaterial}
          position={[-0.836, -0.65, 0]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.238, 2.365, 0.238]}
        />
        <mesh
          geometry={nodes.t004.geometry}
          material={bakedMaterial}
          position={[-0.722, -0.65, 0.418]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.238, 2.365, 0.238]}
        />
        <mesh
          geometry={nodes.t005.geometry}
          material={bakedMaterial}
          position={[0, -0.65, -0.797]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.238, 2.365, 0.238]}
        />
        <mesh
          geometry={nodes.t006.geometry}
          material={bakedMaterial}
          position={[-0.417, -0.65, 0.723]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.238, 2.365, 0.238]}
        />
        <mesh
          geometry={nodes.t007.geometry}
          material={bakedMaterial}
          position={[-0.397, -0.65, -0.693]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.238, 2.365, 0.238]}
        />
        <mesh
          geometry={nodes.t008.geometry}
          material={bakedMaterial}
          position={[-0.688, -0.65, -0.401]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.238, 2.365, 0.238]}
        />
        <mesh
          geometry={nodes.t009.geometry}
          material={bakedMaterial}
          position={[0.396, -0.65, -0.693]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.238, 2.365, 0.238]}
        />
        <mesh
          geometry={nodes.t010.geometry}
          material={bakedMaterial}
          position={[0.687, -0.65, -0.402]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.238, 2.365, 0.238]}
        />
        <mesh
          geometry={nodes.t011.geometry}
          material={bakedMaterial}
          position={[0.669, -0.65, 0.381]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.238, 2.365, 0.238]}
        />
        <mesh
          geometry={nodes.t012.geometry}
          material={bakedMaterial}
          position={[0.391, -0.65, 0.657]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.238, 2.365, 0.238]}
        />
        <mesh
          geometry={nodes.t024.geometry}
          material={bakedMaterial}
          position={[0, -0.65, 0]}
          rotation={[-3.123, -0.209, -3.137]}
          scale={[0.073, 0.728, 0.073]}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/Part-4.glb");
useTexture.preload("/textures/Part-4.png");
