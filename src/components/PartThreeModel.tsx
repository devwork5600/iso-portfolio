import * as THREE from "three";
import { JSX, useMemo } from "react";
import { useGLTF, useTexture, useVideoTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { CoffeeSmoke } from "@/components/CoffeeSmoke";

type GLTFResult = GLTF & {
  nodes: {
    Object001: THREE.Mesh;
    Computer_Computer_0: THREE.Mesh;
    Desk_Desk_0001: THREE.Mesh;
    Drawer01_Desk_0001: THREE.Mesh;
    Drawer02_Desk_0001: THREE.Mesh;
    Drawer03_Desk_0001: THREE.Mesh;
    Bulb: THREE.Mesh;
    bulb_base: THREE.Mesh;
    lamp__shade: THREE.Mesh;
    legs: THREE.Mesh;
    round_wood: THREE.Mesh;
    shade_frame: THREE.Mesh;
    ["laptop-screen001"]: THREE.Mesh;
    Plane053: THREE.Mesh;
    ["monitor-1"]: THREE.Mesh;
    ["screen-1"]: THREE.Mesh;
    ["monitor-1001"]: THREE.Mesh;
    ["screen-2"]: THREE.Mesh;
    Base: THREE.Mesh;
    Top: THREE.Mesh;
    Wheel: THREE.Mesh;
    Chair_Chair_0: THREE.Mesh;
    Mouse_carpet: THREE.Mesh;
    Plane002: THREE.Mesh;
    Plane003: THREE.Mesh;
    Plane005: THREE.Mesh;
    Plane006: THREE.Mesh;
    Plane007: THREE.Mesh;
    Plane008: THREE.Mesh;
    Plane009: THREE.Mesh;
    Plane010: THREE.Mesh;
    Plane011: THREE.Mesh;
    Plane012: THREE.Mesh;
    Plane013: THREE.Mesh;
    Plane014: THREE.Mesh;
    Plane015: THREE.Mesh;
    Plane016: THREE.Mesh;
    Plane017: THREE.Mesh;
    Plane018: THREE.Mesh;
    Plane019: THREE.Mesh;
    Plane020: THREE.Mesh;
    Plane021: THREE.Mesh;
    Plane022: THREE.Mesh;
    Plane023: THREE.Mesh;
    Plane024: THREE.Mesh;
    Plane025: THREE.Mesh;
    Plane026: THREE.Mesh;
    Plane027: THREE.Mesh;
    Plane028: THREE.Mesh;
    Plane029: THREE.Mesh;
    Plane030: THREE.Mesh;
    Plane031: THREE.Mesh;
    Plane032: THREE.Mesh;
    Plane033: THREE.Mesh;
    Plane034: THREE.Mesh;
    Plane035: THREE.Mesh;
    Plane036: THREE.Mesh;
    Plane037: THREE.Mesh;
    Plane038: THREE.Mesh;
    Plane039: THREE.Mesh;
    Plane040: THREE.Mesh;
    Plane041: THREE.Mesh;
    Plane042: THREE.Mesh;
    Plane043: THREE.Mesh;
    Plane044: THREE.Mesh;
    Plane045: THREE.Mesh;
    Plane046: THREE.Mesh;
    Plane047: THREE.Mesh;
    Plane048: THREE.Mesh;
    Plane049: THREE.Mesh;
    Plane050: THREE.Mesh;
    Plane051: THREE.Mesh;
    Plane052: THREE.Mesh;
  };
};

// This model ships with no embedded materials/textures — geometry only.
// Lighting is pre-baked into /textures/Part-3.jpg (mapped via each mesh's UV0),
// so a single unlit material is shared across every mesh except the screens,
// which get a live video texture instead (laptop-screen001, screen-1, screen-2).
// The desk's loudspeakers were removed in this export; the lamp now also has
// a separate Bulb mesh, and the old "Circle_Rug001" mesh was renamed to
// "Mouse_carpet".
export function PartThreeModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF("/models/Part-3.glb") as unknown as GLTFResult;
  const bakedTexture = useTexture("/textures/Part-3.jpg");
  const videoTexture = useVideoTexture("/videos/dev-1.webm");

  const bakedMaterial = useMemo(() => {
    bakedTexture.flipY = false;
    bakedTexture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({ map: bakedTexture });
  }, [bakedTexture]);

  const screenMaterial = useMemo(() => {
    videoTexture.flipY = false;
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({ map: videoTexture });
  }, [videoTexture]);

  return (
    <group {...props} dispose={null}>
      <group position={[5.227, 5.412, 6.964]} rotation={[0, 0.268, 0]} scale={4.005}>
        <mesh
          geometry={nodes.Object001.geometry}
          material={bakedMaterial}
          position={[-0.012, -0.055, -0.035]}
          rotation={[0, -0.257, 0]}
          scale={0.858}
        />
        <CoffeeSmoke />
      </group>
      <group position={[5.611, 2.328, 5.056]} rotation={[-Math.PI / 2, 0, 1.565]} scale={2.934}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[0.869, 0.112, -0.02]}>
            <mesh
              geometry={nodes.Computer_Computer_0.geometry}
              material={bakedMaterial}
              position={[0.028, 0, -0.276]}
            />
          </group>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.Desk_Desk_0001.geometry}
              material={bakedMaterial}
              position={[0.028, 0.276, 0]}
            />
          </group>
          <group position={[-0.83, 0.64, 0.321]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.Drawer01_Desk_0001.geometry}
              material={bakedMaterial}
              position={[0.028, 0.276, 0]}
            />
          </group>
          <group position={[-0.83, 0.39, 0.387]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.Drawer02_Desk_0001.geometry}
              material={bakedMaterial}
              position={[0.028, 0.276, 0]}
            />
          </group>
          <group position={[-0.83, 0.139, 0.282]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.Drawer03_Desk_0001.geometry}
              material={bakedMaterial}
              position={[0.028, 0.276, 0]}
            />
          </group>
        </group>
      </group>
      <group position={[4.289, 5.193, 7.59]} rotation={[0, 0.528, 0]} scale={1.977}>
        <mesh geometry={nodes.Bulb.geometry} material={bakedMaterial} position={[0, 0.374, 0]} />
        <mesh geometry={nodes.bulb_base.geometry} material={bakedMaterial} position={[0, 0.338, 0]} />
        <mesh geometry={nodes.lamp__shade.geometry} material={bakedMaterial} position={[0, 0.431, 0]} />
        <mesh geometry={nodes.legs.geometry} material={bakedMaterial} position={[0.043, 0.141, 0]} />
        <mesh geometry={nodes.round_wood.geometry} material={bakedMaterial} position={[0, 0.296, 0]} />
        <mesh geometry={nodes.shade_frame.geometry} material={bakedMaterial} position={[0, 0.32, 0]} />
      </group>
      <group position={[5.985, 5.772, 3.675]} rotation={[0, 1.519, 0]} scale={3.318}>
        <mesh
          geometry={nodes["laptop-screen001"].geometry}
          material={screenMaterial}
          position={[-0.35, -0.174, -0.226]}
          rotation={[0, -0.257, 0]}
          scale={1.057}
        />
        <mesh
          geometry={nodes.Plane053.geometry}
          material={bakedMaterial}
          position={[-0.35, -0.174, -0.226]}
          rotation={[0, -0.257, 0]}
          scale={1.057}
        />
      </group>
      <group position={[5.817, 2.343, 6.506]} rotation={[-Math.PI / 2, 0, 2.025]} scale={3.066}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[0.548, 0.975, -0.029]} rotation={[0, -0.445, 0]}>
            <mesh
              geometry={nodes["monitor-1"].geometry}
              material={bakedMaterial}
              position={[-0.256, -0.046, -0.229]}
              rotation={[0, 0.321, 0]}
              scale={1.2}
            />
            <mesh
              geometry={nodes["screen-1"].geometry}
              material={screenMaterial}
              position={[-0.256, -0.046, -0.229]}
              rotation={[0, 0.321, 0]}
              scale={1.2}
            />
          </group>
        </group>
      </group>
      <group position={[5.823, 2.345, 4.792]} rotation={[-Math.PI / 2, 0, 1.748]} scale={3.066}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[0.548, 0.975, -0.029]} rotation={[0, -0.445, 0]}>
            <mesh
              geometry={nodes["monitor-1001"].geometry}
              material={bakedMaterial}
              position={[0.005, -0.046, -0.34]}
              rotation={[-0.001, -0.465, -0.002]}
              scale={1.2}
            />
            <mesh
              geometry={nodes["screen-2"].geometry}
              material={screenMaterial}
              position={[0.005, -0.046, -0.34]}
              rotation={[-0.001, -0.465, -0.002]}
              scale={1.2}
            />
          </group>
        </group>
      </group>
      <group position={[6.112, 5.187, 2.596]} rotation={[Math.PI, -1.565, Math.PI]} scale={3.755}>
        <mesh geometry={nodes.Base.geometry} material={bakedMaterial} position={[0, 0.015, 0]} />
        <mesh geometry={nodes.Top.geometry} material={bakedMaterial} position={[0, 0.024, 0.001]} />
        <mesh
          geometry={nodes.Wheel.geometry}
          material={bakedMaterial}
          position={[0, 0.02, 0.03]}
          rotation={[1.875, 0, 0]}
        />
      </group>
      <mesh
        geometry={nodes.Chair_Chair_0.geometry}
        material={bakedMaterial}
        position={[6.834, 2.341, 5.502]}
        rotation={[-1.563, 0.031, 2.842]}
        scale={2.82}
      />
      <mesh
        geometry={nodes.Mouse_carpet.geometry}
        material={bakedMaterial}
        position={[6.117, 5.187, 2.584]}
        rotation={[Math.PI, -1.565, Math.PI]}
        scale={0.293}
      />
      <mesh
        geometry={nodes.Plane002.geometry}
        material={bakedMaterial}
        position={[5.311, 5.205, 7.665]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane003.geometry}
        material={bakedMaterial}
        position={[5.314, 5.201, 7.666]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane005.geometry}
        material={bakedMaterial}
        position={[5.318, 5.194, 7.664]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane006.geometry}
        material={bakedMaterial}
        position={[5.312, 5.205, 7.66]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane007.geometry}
        material={bakedMaterial}
        position={[5.313, 5.203, 7.661]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane008.geometry}
        material={bakedMaterial}
        position={[5.311, 5.207, 7.664]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane009.geometry}
        material={bakedMaterial}
        position={[5.318, 5.195, 7.66]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane010.geometry}
        material={bakedMaterial}
        position={[5.316, 5.199, 7.659]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane011.geometry}
        material={bakedMaterial}
        position={[5.319, 5.195, 7.666]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane012.geometry}
        material={bakedMaterial}
        position={[5.319, 5.194, 7.665]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane013.geometry}
        material={bakedMaterial}
        position={[5.315, 5.202, 7.665]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane014.geometry}
        material={bakedMaterial}
        position={[5.313, 5.205, 7.663]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane015.geometry}
        material={bakedMaterial}
        position={[5.313, 5.206, 7.664]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane016.geometry}
        material={bakedMaterial}
        position={[5.319, 5.195, 7.665]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane017.geometry}
        material={bakedMaterial}
        position={[5.32, 5.194, 7.661]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane018.geometry}
        material={bakedMaterial}
        position={[5.317, 5.199, 7.662]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane019.geometry}
        material={bakedMaterial}
        position={[5.313, 5.206, 7.658]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane020.geometry}
        material={bakedMaterial}
        position={[5.319, 5.196, 7.66]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane021.geometry}
        material={bakedMaterial}
        position={[5.319, 5.196, 7.66]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane022.geometry}
        material={bakedMaterial}
        position={[5.315, 5.203, 7.662]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane023.geometry}
        material={bakedMaterial}
        position={[5.315, 5.203, 7.66]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane024.geometry}
        material={bakedMaterial}
        position={[5.317, 5.2, 7.665]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane025.geometry}
        material={bakedMaterial}
        position={[5.315, 5.203, 7.663]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane026.geometry}
        material={bakedMaterial}
        position={[5.316, 5.203, 7.66]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane027.geometry}
        material={bakedMaterial}
        position={[5.319, 5.197, 7.662]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane028.geometry}
        material={bakedMaterial}
        position={[5.314, 5.206, 7.659]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane029.geometry}
        material={bakedMaterial}
        position={[5.319, 5.199, 7.664]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane030.geometry}
        material={bakedMaterial}
        position={[5.317, 5.201, 7.665]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane031.geometry}
        material={bakedMaterial}
        position={[5.315, 5.206, 7.662]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane032.geometry}
        material={bakedMaterial}
        position={[5.313, 5.208, 7.664]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane033.geometry}
        material={bakedMaterial}
        position={[5.313, 5.209, 7.661]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane034.geometry}
        material={bakedMaterial}
        position={[5.318, 5.202, 7.661]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane035.geometry}
        material={bakedMaterial}
        position={[5.316, 5.204, 7.665]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane036.geometry}
        material={bakedMaterial}
        position={[5.317, 5.203, 7.665]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane037.geometry}
        material={bakedMaterial}
        position={[5.32, 5.199, 7.663]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane038.geometry}
        material={bakedMaterial}
        position={[5.311, 5.213, 7.663]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane039.geometry}
        material={bakedMaterial}
        position={[5.318, 5.202, 7.667]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane040.geometry}
        material={bakedMaterial}
        position={[5.311, 5.215, 7.665]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane041.geometry}
        material={bakedMaterial}
        position={[5.318, 5.203, 7.662]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane042.geometry}
        material={bakedMaterial}
        position={[5.314, 5.209, 7.666]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane043.geometry}
        material={bakedMaterial}
        position={[5.318, 5.203, 7.66]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane044.geometry}
        material={bakedMaterial}
        position={[5.311, 5.214, 7.664]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane045.geometry}
        material={bakedMaterial}
        position={[5.32, 5.201, 7.66]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane046.geometry}
        material={bakedMaterial}
        position={[5.313, 5.213, 7.66]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane047.geometry}
        material={bakedMaterial}
        position={[5.311, 5.205, 7.665]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane048.geometry}
        material={bakedMaterial}
        position={[5.315, 5.21, 7.659]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane049.geometry}
        material={bakedMaterial}
        position={[5.32, 5.201, 7.661]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane050.geometry}
        material={bakedMaterial}
        position={[5.317, 5.206, 7.663]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane051.geometry}
        material={bakedMaterial}
        position={[5.316, 5.208, 7.666]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
      <mesh
        geometry={nodes.Plane052.geometry}
        material={bakedMaterial}
        position={[5.317, 5.195, 7.661]}
        rotation={[-Math.PI, 1.145, -Math.PI]}
        scale={1.679}
      />
    </group>
  );
}

useGLTF.preload("/models/Part-3.glb");
useTexture.preload("/textures/Part-3.jpg");
