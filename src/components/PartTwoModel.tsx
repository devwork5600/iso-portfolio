import * as THREE from "three";
import { JSX, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Bender: THREE.Mesh;
    Cube_body_head_0: THREE.Mesh;
    Cube_eye_0: THREE.Mesh;
    Cube_hand_leg_0: THREE.Mesh;
    Cube_tooth_0: THREE.Mesh;
    ["Cube_����������������001_0"]: THREE.Mesh;
    board: THREE.Mesh;
    ["Book-1001"]: THREE.Mesh;
    ["Book-2001"]: THREE.Mesh;
    ["Book-3001"]: THREE.Mesh;
    ["Book-4001"]: THREE.Mesh;
    ["Book-5001"]: THREE.Mesh;
    ["Book-6001"]: THREE.Mesh;
    ["Book-7001"]: THREE.Mesh;
    ["Book-8001"]: THREE.Mesh;
    ["Book-9001"]: THREE.Mesh;
    ["Book-10001"]: THREE.Mesh;
    ["Book-11001"]: THREE.Mesh;
    ["Book-12001"]: THREE.Mesh;
    ["Book-13001"]: THREE.Mesh;
    ["Book-14"]: THREE.Mesh;
    ["Book-15"]: THREE.Mesh;
    Cube001: THREE.Mesh;
    Cube003: THREE.Mesh;
    Cube004: THREE.Mesh;
    Cube005: THREE.Mesh;
    Cube006: THREE.Mesh;
    Cube007: THREE.Mesh;
    Cube008: THREE.Mesh;
    Cube009: THREE.Mesh;
    Cube010: THREE.Mesh;
    Cube011: THREE.Mesh;
    Cube067: THREE.Mesh;
    Cube068: THREE.Mesh;
    Cube069: THREE.Mesh;
    Cube070: THREE.Mesh;
    Cube071: THREE.Mesh;
    Cube072: THREE.Mesh;
    Cube073: THREE.Mesh;
    Cube074: THREE.Mesh;
    Cube075: THREE.Mesh;
    Cube999: THREE.Mesh;
    Cylinder: THREE.Mesh;
    Cylinder001: THREE.Mesh;
    KALLRÖR_HANDLE_213MM001: THREE.Mesh;
    KALLRÖR_HANDLE_213MM002: THREE.Mesh;
    king: THREE.Mesh;
    king2: THREE.Mesh;
    knight: THREE.Mesh;
    knight2: THREE.Mesh;
    knight2001: THREE.Mesh;
    knight001: THREE.Mesh;
    pawn: THREE.Mesh;
    pawn2: THREE.Mesh;
    pawn2001: THREE.Mesh;
    pawn2002: THREE.Mesh;
    pawn2003: THREE.Mesh;
    pawn2004: THREE.Mesh;
    pawn2005: THREE.Mesh;
    pawn2006: THREE.Mesh;
    pawn2007: THREE.Mesh;
    pawn001: THREE.Mesh;
    pawn002: THREE.Mesh;
    pawn003: THREE.Mesh;
    pawn004: THREE.Mesh;
    pawn005: THREE.Mesh;
    pawn006: THREE.Mesh;
    pawn007: THREE.Mesh;
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
    queen: THREE.Mesh;
    queen2: THREE.Mesh;
    rook: THREE.Mesh;
    rook2: THREE.Mesh;
    rook2001: THREE.Mesh;
    rook001: THREE.Mesh;
    tower: THREE.Mesh;
    tower2: THREE.Mesh;
    tower2001: THREE.Mesh;
    tower001: THREE.Mesh;
    ["Vase_and_plant_artificial_arrangement-02"]: THREE.Mesh;
  };
};

// This model ships with no embedded materials/textures — geometry only.
// Lighting is pre-baked into /textures/Part-2.jpg (mapped via each mesh's UV0),
// so a single unlit material is shared across every mesh instead of PBR shading,
// except the 5 photos (real website screenshots, moved here from Part-4).
export function PartTwoModel(props: JSX.IntrinsicElements["group"]) {
  // Part-2.glb is Draco-compressed — see PartOneModel.tsx's useGLTF call for
  // why the second arg points at the self-hosted decoder in public/draco/.
  const { nodes } = useGLTF("/models/Part-2.glb", "/draco/") as unknown as GLTFResult;
  const bakedTexture = useTexture("/textures/Part-2.jpg");

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

  return (
    <group {...props} dispose={null}>
      <group position={[3.015, 4.878, -3.472]} rotation={[-Math.PI / 2, 0, 0]} scale={0.406}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <mesh geometry={nodes.Bender.geometry} material={bakedMaterial} position={[0, 0, -0.067]} />
            <mesh geometry={nodes.Cube_body_head_0.geometry} material={bakedMaterial} />
            <mesh geometry={nodes.Cube_eye_0.geometry} material={bakedMaterial} position={[0, 0, -0.067]} />
            <mesh geometry={nodes.Cube_hand_leg_0.geometry} material={bakedMaterial} position={[0, 0, -0.067]} />
            <mesh geometry={nodes.Cube_tooth_0.geometry} material={bakedMaterial} position={[0, 0, -0.067]} />
            <mesh
              geometry={nodes["Cube_����������������001_0"].geometry}
              material={bakedMaterial}
            />
          </group>
        </group>
      </group>
      <mesh geometry={nodes.board.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes["Book-1001"].geometry} material={bakedMaterial} position={[5.124, 7.314, -3.179]} rotation={[0, 0.718, 0]} scale={2.637} />
      <mesh geometry={nodes["Book-2001"].geometry} material={bakedMaterial} position={[5.284, 7.314, -3.181]} rotation={[0, 0.718, 0]} scale={2.637} />
      <mesh geometry={nodes["Book-3001"].geometry} material={bakedMaterial} position={[5.442, 7.306, -3.161]} rotation={[0, 0.718, 0]} scale={2.585} />
      <mesh geometry={nodes["Book-4001"].geometry} material={bakedMaterial} position={[5.598, 7.306, -3.163]} rotation={[0, 0.718, 0]} scale={2.585} />
      <mesh geometry={nodes["Book-5001"].geometry} material={bakedMaterial} position={[5.752, 7.306, -3.165]} rotation={[0, 0.718, 0]} scale={2.585} />
      <mesh geometry={nodes["Book-6001"].geometry} material={bakedMaterial} position={[5.896, 7.261, -3.144]} rotation={[0, 0.718, 0]} scale={[2.188, 2.323, 2.133]} />
      <mesh geometry={nodes["Book-7001"].geometry} material={bakedMaterial} position={[6.037, 7.307, -3.169]} rotation={[0, 0.718, 0]} scale={2.585} />
      <mesh geometry={nodes["Book-8001"].geometry} material={bakedMaterial} position={[6.193, 7.306, -3.171]} rotation={[0, 0.718, 0]} scale={2.585} />
      <mesh geometry={nodes["Book-9001"].geometry} material={bakedMaterial} position={[6.346, 7.306, -3.174]} rotation={[0, 0.718, 0]} scale={2.585} />
      <mesh geometry={nodes["Book-10001"].geometry} material={bakedMaterial} position={[6.501, 7.305, -3.176]} rotation={[0, 0.718, 0]} scale={2.585} />
      <mesh geometry={nodes["Book-11001"].geometry} material={bakedMaterial} position={[6.657, 7.305, -3.178]} rotation={[0, 0.718, 0]} scale={2.585} />
      <mesh geometry={nodes["Book-12001"].geometry} material={bakedMaterial} position={[6.811, 7.305, -3.18]} rotation={[0, 0.718, 0]} scale={2.585} />
      <mesh geometry={nodes["Book-13001"].geometry} material={bakedMaterial} position={[6.967, 7.305, -3.182]} rotation={[0, 0.718, 0]} scale={2.585} />
      <mesh geometry={nodes["Book-14"].geometry} material={bakedMaterial} position={[7.122, 7.305, -3.184]} rotation={[0, 0.718, 0]} scale={2.585} />
      <mesh geometry={nodes["Book-15"].geometry} material={bakedMaterial} position={[7.278, 7.306, -3.186]} rotation={[0, 0.718, 0]} scale={2.585} />
      <mesh geometry={nodes.Cube001.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube003.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube004.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube005.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube006.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube007.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube008.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube009.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube010.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube011.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube067.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube068.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube069.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube070.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube071.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube072.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube073.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube074.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube075.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cube999.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cylinder.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.Cylinder001.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.KALLRÖR_HANDLE_213MM001.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.911]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.KALLRÖR_HANDLE_213MM002.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.king.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.king2.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.knight.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.knight2.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.knight2001.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.knight001.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn2.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn2001.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn2002.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn2003.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn2004.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn2005.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn2006.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn2007.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn001.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn002.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn003.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn004.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn005.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn006.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.pawn007.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes["Photo-1"].geometry} material={photo1Material} position={[-5.269, 9.061, 2.906]} rotation={[Math.PI / 2, 0, -1.563]} scale={1.607} />
      <mesh geometry={nodes["Photo-2"].geometry} material={photo2Material} position={[-5.281, 9.061, 4.36]} rotation={[Math.PI / 2, 0, -1.563]} scale={1.709} />
      <mesh geometry={nodes["Photo-3"].geometry} material={photo3Material} position={[-5.292, 9, 5.773]} rotation={[Math.PI / 2, 0, -1.563]} scale={1.607} />
      <mesh geometry={nodes["Photo-4"].geometry} material={photo4Material} position={[-5.275, 7.838, 3.449]} rotation={[Math.PI / 2, 0, -1.563]} scale={1.949} />
      <mesh geometry={nodes["Photo-5"].geometry} material={photo5Material} position={[-5.289, 7.797, 5.159]} rotation={[Math.PI / 2, 0, -1.563]} scale={1.885} />
      <mesh geometry={nodes["PhotoFrame-1"].geometry} material={bakedMaterial} position={[-5.269, 9.061, 2.906]} rotation={[Math.PI / 2, 0, -1.563]} scale={1.607} />
      <mesh geometry={nodes["PhotoFrame-2"].geometry} material={bakedMaterial} position={[0, 0, 4.181]} />
      <mesh geometry={nodes["PhotoFrame-3"].geometry} material={bakedMaterial} position={[0, 0, 4.181]} />
      <mesh geometry={nodes["PhotoFrame-4"].geometry} material={bakedMaterial} position={[-5.275, 7.838, 3.449]} rotation={[Math.PI / 2, 0, -1.563]} scale={1.949} />
      <mesh geometry={nodes["PhotoFrame-5"].geometry} material={bakedMaterial} position={[-5.289, 7.797, 5.159]} rotation={[Math.PI / 2, 0, -1.563]} scale={1.885} />
      <mesh geometry={nodes.queen.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.queen2.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.rook.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.rook2.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.rook2001.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.rook001.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.tower.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.tower2.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.tower2001.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh geometry={nodes.tower001.geometry} material={bakedMaterial} position={[2.071, 1.608, 1.946]} rotation={[0, 0.76, 0]} scale={1.727} />
      <mesh
        geometry={nodes["Vase_and_plant_artificial_arrangement-02"].geometry}
        material={bakedMaterial}
        position={[6.077, 8, -3.567]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={4.2}
      />
    </group>
  );
}

useGLTF.preload("/models/Part-2.glb", "/draco/");
useTexture.preload("/textures/Part-2.jpg");
