import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/*
 * Representação abstrata do trabalho jurídico: base de pedra, painel de bronze,
 * dois volumes encadernados (as normas), uma viga de aço em equilíbrio e uma esfera (a decisão).
 * O scroll (0–1) reorganiza as peças: dispersão → estrutura → precisão.
 * Orçamento: < 20 malhas, sem texturas externas, DPR ≤ 1.5, uma sombra 1024².
 */

type Props = { progress: MutableRefObject<number>; running: boolean; lite: boolean; onReady?: () => void };

type T = { p: [number, number, number]; r: [number, number, number] };
// três estados por peça
const KEYS: Record<string, [T, T, T]> = {
  monolith: [{ p: [-2.6, 3.2, -0.6], r: [0.2, 0.6, -0.35] }, { p: [-2.1, 2.7, -0.4], r: [0, 0.3, -0.08] }, { p: [-1.9, 2.6, -0.4], r: [0, 0, 0] }],
  blockA: [{ p: [1.8, 2.4, 0.8], r: [0.6, 0.4, 0.3] }, { p: [0.9, 0.95, 0.1], r: [0, 0.25, 0] }, { p: [0.8, 0.95, 0], r: [0, 0, 0] }],
  blockB: [{ p: [3.0, 1.2, -1.0], r: [-0.4, 0.9, 0.5] }, { p: [1.1, 1.85, 0.05], r: [0, -0.2, 0.06] }, { p: [0.8, 1.85, 0], r: [0, 0, 0] }],
  beam: [{ p: [0.4, 4.2, 1.2], r: [0.3, 0.8, 0.6] }, { p: [0.6, 2.42, 0], r: [0, 0, -0.12] }, { p: [0.3, 2.42, 0], r: [0, 0, 0] }],
  sphere: [{ p: [-0.8, 4.6, 1.6], r: [0, 0, 0] }, { p: [3.1, 2.62, 0], r: [0, 0, 0] }, { p: [0.3, 2.66, 0], r: [0, 0, 0] }],
  finA: [{ p: [-4.2, 2.2, -2.4], r: [0, 0.8, 0.2] }, { p: [-3.6, 2.2, -2.2], r: [0, 0.2, 0] }, { p: [-3.4, 2.2, -2.2], r: [0, 0, 0] }],
  finB: [{ p: [4.4, 2.2, -2.8], r: [0, -0.7, -0.15] }, { p: [3.8, 2.2, -2.3], r: [0, -0.15, 0] }, { p: [3.6, 2.2, -2.2], r: [0, 0, 0] }],
};
const smooth = (t: number) => t * t * (3 - 2 * t);

function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex; scene.environmentIntensity = 0.55;
    return () => { tex.dispose(); pm.dispose(); scene.environment = null; };
  }, [gl, scene]);
  return null;
}

function brushedTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const ctx = c.getContext('2d')!; ctx.fillStyle = '#9a9a9a'; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 900; i++) { ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0},${Math.random() > 0.5 ? 255 : 0},${Math.random() > 0.5 ? 255 : 0},${Math.random() * 0.06})`; ctx.fillRect(0, Math.random() * 256, 256, Math.random() * 1.5); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}

function Sculpture({ progress, lite }: { progress: MutableRefObject<number>; lite: boolean }) {
  const group = useRef<THREE.Group>(null);
  const refs = useRef<Record<string, THREE.Object3D | null>>({});
  const s = useRef(0);
  const rough = useMemo(brushedTexture, []);
  const bronze = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b29a68', metalness: 0.92, roughness: 0.34, roughnessMap: rough }), [rough]);
  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c4c6c2', metalness: 0.95, roughness: 0.28, roughnessMap: rough }), [rough]);
  const stone = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1f2320', metalness: 0.1, roughness: 0.55 }), []);
  const stone2 = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2f3430', metalness: 0.08, roughness: 0.7 }), []);
  // volumes encadernados: capas em couro, cortes das páginas em tom papel, lombada com filetes dourados
  const pagesMat = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 64; c.height = 256; const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#e6dcc6'; ctx.fillRect(0, 0, 64, 256); for (let y = 0; y < 256; y += 3) { ctx.fillStyle = `rgba(120,100,70,${0.08 + Math.random() * 0.1})`; ctx.fillRect(0, y, 64, 1); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 });
  }, []);
  const spineMat = (color: string) => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 128; const ctx = c.getContext('2d')!;
    ctx.fillStyle = color; ctx.fillRect(0, 0, 512, 128); ctx.fillStyle = '#c9ad6e'; for (const x of [60, 70, 440, 450]) ctx.fillRect(x, 10, 3, 108);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return new THREE.MeshStandardMaterial({ map: t, roughness: 0.5 });
  };
  const bookA = useMemo(() => { const cover = new THREE.MeshStandardMaterial({ color: '#4a1f1f', roughness: 0.5 }); return [pagesMat, pagesMat, cover, cover, spineMat('#4a1f1f'), pagesMat]; }, [pagesMat]); // eslint-disable-line react-hooks/exhaustive-deps
  const bookB = useMemo(() => { const cover = new THREE.MeshStandardMaterial({ color: '#1f2a3a', roughness: 0.5 }); return [pagesMat, pagesMat, cover, cover, spineMat('#1f2a3a'), pagesMat]; }, [pagesMat]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { [bronze, steel, stone, stone2, pagesMat, ...bookA, ...bookB].forEach((m) => m.dispose()); rough.dispose(); }, [bronze, steel, stone, stone2, pagesMat, bookA, bookB, rough]);

  const tmpP = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, dt) => {
    s.current = THREE.MathUtils.damp(s.current, progress.current, 3.2, dt);
    const p = s.current;
    const seg = p < 0.5 ? 0 : 1; const k = smooth(THREE.MathUtils.clamp(p < 0.5 ? p * 2 : (p - 0.5) * 2, 0, 1));
    Object.entries(KEYS).forEach(([name, keys]) => {
      const o = refs.current[name]; if (!o) return;
      const a = keys[seg], b = keys[seg + 1];
      tmpP.set(...a.p).lerp(new THREE.Vector3(...b.p), k);
      // pequena flutuação enquanto a composição ainda não está "em ordem"
      const float = (1 - p) * Math.sin(state.clock.elapsedTime * 0.8 + name.length) * 0.08;
      o.position.set(tmpP.x, tmpP.y + float, tmpP.z);
      o.rotation.set(THREE.MathUtils.lerp(a.r[0], b.r[0], k), THREE.MathUtils.lerp(a.r[1], b.r[1], k), THREE.MathUtils.lerp(a.r[2], b.r[2], k));
    });
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, Math.sin(state.clock.elapsedTime * 0.12) * 0.35 + state.pointer.x * 0.15, 2, dt);
    }
  });

  const set = (n: string) => (o: THREE.Object3D | null) => { refs.current[n] = o; };
  const shadow = !lite;
  return (
    <group ref={group}>
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow={shadow} material={stone}><boxGeometry args={[8.4, 0.4, 3.6]} /></mesh>
      <mesh ref={set('monolith')} castShadow={shadow} receiveShadow material={bronze}><boxGeometry args={[0.14, 4.4, 2.2]} /></mesh>
      <mesh ref={set('blockA')} castShadow={shadow} receiveShadow material={bookA}><boxGeometry args={[2.4, 1.1, 1.6]} /></mesh>
      <mesh ref={set('blockB')} castShadow={shadow} receiveShadow material={bookB}><boxGeometry args={[1.6, 0.7, 1.2]} /></mesh>
      <mesh ref={set('beam')} castShadow={shadow} receiveShadow material={steel}><boxGeometry args={[6.4, 0.06, 0.14]} /></mesh>
      <mesh ref={set('sphere')} castShadow={shadow} material={bronze}><sphereGeometry args={[0.18, 48, 32]} /></mesh>
      <mesh ref={set('finA')} castShadow={shadow} material={steel}><boxGeometry args={[0.04, 4, 1.2]} /></mesh>
      <mesh ref={set('finB')} castShadow={shadow} material={steel}><boxGeometry args={[0.04, 4, 1.2]} /></mesh>
    </group>
  );
}

const PATH = new THREE.CatmullRomCurve3([new THREE.Vector3(7, 4.5, 11), new THREE.Vector3(-2, 6.5, 12), new THREE.Vector3(-8, 3.2, 8.5), new THREE.Vector3(0.5, 2.4, 10.5)]);
function Rig({ progress }: { progress: MutableRefObject<number> }) {
  const { camera, size } = useThree();
  const s = useRef(0); const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const fov = size.width / size.height < 1 ? 52 : 32;
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    s.current = THREE.MathUtils.damp(s.current, progress.current, 2.6, dt);
    PATH.getPointAt(THREE.MathUtils.clamp(s.current, 0, 1), tmp);
    tmp.x += state.pointer.x * 0.5; tmp.y += state.pointer.y * 0.3;
    cam.position.lerp(tmp, 0.15);
    cam.lookAt(0, 2.1, 0);
  });
  return null;
}

export default function SculptureScene({ progress, running, lite, onReady }: Props) {
  return (
    <Canvas
      shadows={!lite}
      dpr={lite ? 1 : [1, 1.5]}
      frameloop={running ? 'always' : 'never'}
      camera={{ fov: 32, near: 0.3, far: 120, position: [7, 4.5, 11] }}
      gl={{ antialias: !lite, powerPreference: 'high-performance', alpha: false }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; onReady?.(); }}
      aria-hidden="true"
    >
      <color attach="background" args={['#101311']} />
      <fog attach="fog" args={['#101311', 16, 34]} />
      <Env />
      <ambientLight intensity={0.15} />
      <spotLight position={[-6, 10, 6]} angle={0.5} penumbra={0.8} intensity={140} color="#ffe2b8" castShadow={!lite} shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0004} />
      <directionalLight position={[8, 4, -6]} intensity={1.2} color="#9fb0c0" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[30, 48]} /><meshStandardMaterial color="#141715" roughness={0.9} /></mesh>
      <Sculpture progress={progress} lite={lite} />
      <Rig progress={progress} />
    </Canvas>
  );
}
