"use client";

import { useGLTF, shaderMaterial } from "@react-three/drei";
import { useFrame, extend } from "@react-three/fiber";
import gsap from "gsap";
import { JSX, useMemo, useRef, useEffect, useCallback, useState } from "react";
import * as THREE from "three";

// Ported from room4's src/components/MorphParticles.tsx, adapted to this
// project's Particules.glb node names (three-js / suzanne001) and a local
// click-to-toggle trigger. Particules.glb also contains a third node,
// Cube001, sitting far from the other two (~[1.8, 1.0, 1.7] vs ~[3.9, 10.4,
// -4.8]) — it's excluded here, kept as a simple two-shape toggle like room4.
// Each shape's own node transform (position/quaternion/scale, as loaded by
// GLTFLoader) is applied per-vertex when building the morph target buffers
// below, so this stays correct regardless of whether a given re-export
// bakes transforms into geometry or keeps them on the node.

const vertexShader = /* glsl */ `
// Simplex 3D Noise
// by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.)+1.)*x,289.);}
vec4 taylorInvSqrt(vec4 r){return 1.792842842-.8537347209*r;}

float simplexNoise3d(vec3 v)
{
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);

    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);

    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);

    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+2.*C.xxx;
    vec3 x3=x0-1.+3.*C.xxx;

    i=mod(i,289.);
    vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))
    +i.y+vec4(0.,i1.y,i2.y,1.))
    +i.x+vec4(0.,i1.x,i2.x,1.));

    float n_=1./7.;
    vec3 ns=n_*D.wyz-D.xzx;

    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.*x_);

    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(x)-abs(y);

    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);

    vec4 s0=floor(b0)*2.+1.;
    vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));

    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;

    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);

    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;
    p1*=norm.y;
    p2*=norm.z;
    p3*=norm.w;

    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;

    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

// ----------------- Shader uniforms -----------------
uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uFocus;
attribute vec3 aPositionTarget;
attribute float aSize;

varying vec3 vColor;

void main()
{
    // Mixed position
    float noiseOrigin=simplexNoise3d(position*.2);
    float noiseTarget=simplexNoise3d(aPositionTarget*.2);
    float noise=mix(noiseOrigin,noiseTarget,uProgress);
    noise=smoothstep(-1.,1.,noise);

    float duration=.4;
    float delay=(1.-duration)*noise;
    float end=delay+duration;
    float progress=smoothstep(delay,end,uProgress);
    vec3 mixedPosition=mix(position,aPositionTarget,progress);

    // Final position
    vec4 modelPosition=modelMatrix*vec4(mixedPosition,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;


    // Point size
    gl_PointSize=(26.0 + (uFocus*14.0));
    gl_PointSize*=((1.)/-viewPosition.z);

    // Varyings
    vColor=mix(uColorA,uColorB,noise) * 1.8;
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.2);
    float alpha = 0.09 / distanceToCenter - 0.02;

    gl_FragColor = vec4(vColor, alpha);
}
`;

type GLTFResult = {
  nodes: {
    ["three-js"]: THREE.Mesh;
    suzanne001: THREE.Mesh;
  };
};

const MorphParticlesMaterial = shaderMaterial(
  {
    uSize: 0.04,
    uResolution: new THREE.Vector2(1, 1),
    uProgress: 0,
    uFocus: 1,
    uColorA: new THREE.Color("#00a2ff"),
    uColorB: new THREE.Color("#3079ff"),
  },
  vertexShader,
  fragmentShader,
);

extend({ MorphParticlesMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    morphParticlesMaterial: ThreeElements["shaderMaterial"];
  }
}

// Stable random seeds, used to pad the shorter geometry's vertex count.
const RANDOM_SEEDS = Float32Array.from({ length: 100_000 }, () => Math.random());

export function ParticlesModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF("/models/Particules.glb") as unknown as GLTFResult;

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<THREE.Float32BufferAttribute[]>([]);
  const currentIndex = useRef(0);
  const morphTween = useRef<gsap.core.Tween | null>(null);

  const [targetIndex, setTargetIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const geometryData = useMemo(() => {
    // Fixed order: index 0 = threejs text, index 1 = suzanne monkey.
    const meshes = [nodes["three-js"], nodes.suzanne001];

    const maxCount = Math.max(
      ...meshes.map((m) => (m.geometry.attributes.position as THREE.BufferAttribute).count),
    );

    const tempVec = new THREE.Vector3();

    const positions = meshes.map((m) => {
      const src = m.geometry.attributes.position as THREE.BufferAttribute;
      const arr = new Float32Array(maxCount * 3);
      const matrix = new THREE.Matrix4().compose(m.position, m.quaternion, m.scale);

      const writeVertex = (i3: number, readIndex: number) => {
        tempVec
          .set(src.array[readIndex], src.array[readIndex + 1], src.array[readIndex + 2])
          .applyMatrix4(matrix);
        arr[i3] = tempVec.x;
        arr[i3 + 1] = tempVec.y;
        arr[i3 + 2] = tempVec.z;
      };

      for (let i = 0; i < maxCount; i++) {
        const i3 = i * 3;
        if (i3 < src.array.length) {
          writeVertex(i3, i3);
        } else {
          const ri = Math.floor(src.count * RANDOM_SEEDS[i % RANDOM_SEEDS.length]) * 3;
          writeVertex(i3, ri);
        }
      }

      return new THREE.Float32BufferAttribute(arr, 3);
    });

    const geo = new THREE.BufferGeometry();
    const sizes = Float32Array.from(
      { length: maxCount },
      (_, i) => RANDOM_SEEDS[i % RANDOM_SEEDS.length],
    );

    geo.setAttribute("position", positions[0]);
    geo.setAttribute("aPositionTarget", positions[1]);
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    return { geo, positions };
  }, [nodes]);

  useEffect(() => {
    positionsRef.current = geometryData.positions;
  }, [geometryData.positions]);

  const morph = useCallback(
    (index: number) => {
      if (!pointsRef.current || !materialRef.current) return;
      if (isAnimating) return;

      const geo = pointsRef.current.geometry as THREE.BufferGeometry;

      setIsAnimating(true);

      morphTween.current?.kill();

      geo.setAttribute("position", positionsRef.current[currentIndex.current]);
      geo.setAttribute("aPositionTarget", positionsRef.current[index]);

      morphTween.current = gsap.fromTo(
        materialRef.current.uniforms.uProgress,
        { value: 0 },
        {
          value: 1,
          duration: 2.5,
          onComplete: () => {
            currentIndex.current = index;
            setIsAnimating(false);
          },
        },
      );
    },
    [isAnimating],
  );

  useEffect(() => {
    if (targetIndex !== currentIndex.current) {
      morph(targetIndex);
    }
  }, [targetIndex, morph]);

  useFrame(({ size, gl }) => {
    if (!materialRef.current) return;

    const uniforms = materialRef.current.uniforms;

    const dpr = gl.getPixelRatio();
    const x = size.width * dpr;
    const y = size.height * dpr;
    const res = uniforms.uResolution.value;

    if (res.x !== x || res.y !== y) {
      res.set(x, y);
    }
  });

  return (
    <group {...props} dispose={null}>
      <points
        ref={pointsRef}
        geometry={geometryData.geo}
        frustumCulled={false}
        onClick={(event) => {
          event.stopPropagation();
          setTargetIndex((index) => (index === 0 ? 1 : 0));
        }}
      >
        <morphParticlesMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

useGLTF.preload("/models/Particules.glb");
