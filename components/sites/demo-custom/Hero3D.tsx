"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshDistortMaterial, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { heroState } from "./heroState";

export type HeroVariant = "lama" | "scantei" | "crom";

const ACCENT = "#ff4533";

/* ────────────────────────── V1 · LAMA — briciul crom ───────────────────── */

function Lama() {
  const group = useRef<THREE.Group>(null);
  const handle = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = heroState.p;
    // pointer parallax + scroll-driven opening
    const tx = state.pointer.y * 0.22 + 0.15 + p * 1.1;
    const ty = state.pointer.x * 0.35 - 0.5 + p * 2.4;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, 4, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty, 4, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, -p * 1.4, 4, delta);
    if (handle.current) {
      // razor swings open as you scroll
      handle.current.rotation.z = THREE.MathUtils.damp(
        handle.current.rotation.z,
        -0.55 - p * 1.5,
        4,
        delta
      );
    }
  });

  const chrome = { metalness: 1, roughness: 0.06, envMapIntensity: 1.6 } as const;
  const dark = { color: "#1a1a1d", metalness: 0.4, roughness: 0.35, envMapIntensity: 0.8 } as const;

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
      <group ref={group} rotation={[0.15, -0.5, -0.18]} scale={1.05}>
        {/* blade */}
        <group position={[0.55, 0.25, 0]}>
          <RoundedBox args={[3.3, 0.6, 0.07]} radius={0.035} smoothness={4}>
            <meshStandardMaterial {...chrome} />
          </RoundedBox>
          {/* spine */}
          <RoundedBox args={[3.3, 0.12, 0.12]} radius={0.05} smoothness={4} position={[0, 0.34, 0]}>
            <meshStandardMaterial {...chrome} roughness={0.12} />
          </RoundedBox>
          {/* cutting edge — a hint of the accent on the thin face */}
          <mesh position={[0, -0.315, 0]}>
            <boxGeometry args={[3.26, 0.025, 0.078]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.35} metalness={0.6} roughness={0.3} />
          </mesh>
          {/* tang */}
          <RoundedBox args={[0.7, 0.22, 0.06]} radius={0.03} position={[1.95, -0.12, 0]} rotation={[0, 0, -0.35]}>
            <meshStandardMaterial {...chrome} />
          </RoundedBox>
        </group>
        {/* pivot */}
        <mesh position={[-1.25, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.22, 24]} />
          <meshStandardMaterial {...chrome} roughness={0.15} />
        </mesh>
        {/* handle — swings on the pivot */}
        <group ref={handle} position={[-1.25, 0.02, 0]} rotation={[0, 0, -0.55]}>
          <RoundedBox args={[3.1, 0.46, 0.05]} radius={0.025} position={[1.45, 0, 0.05]}>
            <meshPhysicalMaterial {...dark} clearcoat={1} clearcoatRoughness={0.2} />
          </RoundedBox>
          <RoundedBox args={[3.1, 0.46, 0.05]} radius={0.025} position={[1.45, 0, -0.05]}>
            <meshPhysicalMaterial {...dark} clearcoat={1} clearcoatRoughness={0.2} />
          </RoundedBox>
        </group>
      </group>
    </Float>
  );
}

/* ─────────────────── V2 · SCÂNTEI — pilitura de oțel ────────────────────── */

function Scantei() {
  const COUNT = 1300;
  const points = useRef<THREE.Points>(null);
  const glow = useRef<THREE.Mesh>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      speeds[i] = 0.25 + Math.random() * 0.9;
    }
    return { positions, speeds };
  }, []);

  useFrame((state, delta) => {
    const pts = points.current;
    if (!pts) return;
    const p = heroState.p;
    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const drift = delta * (0.55 + p * 2.2);
    for (let i = 0; i < COUNT; i++) {
      const iy = i * 3 + 1;
      const ix = i * 3;
      arr[iy] = (arr[iy] ?? 0) + drift * (speeds[i] ?? 0.5);
      arr[ix] = (arr[ix] ?? 0) + Math.sin(state.clock.elapsedTime * 0.6 + i) * delta * 0.12;
      if ((arr[iy] ?? 0) > 3.2) arr[iy] = -3.2;
    }
    pts.geometry.attributes.position!.needsUpdate = true;
    pts.rotation.y = THREE.MathUtils.damp(pts.rotation.y, state.pointer.x * 0.3 + p * 1.2, 3, delta);
    pts.rotation.x = THREE.MathUtils.damp(pts.rotation.x, state.pointer.y * 0.15, 3, delta);
    if (glow.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.06 + p * 0.5;
      glow.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#ffd9c2"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <mesh ref={glow} position={[0, -0.2, -1.5]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.13} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ─────────────────── V3 · CROM — metalul lichid ─────────────────────────── */

function Crom() {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<React.ComponentRef<typeof MeshDistortMaterial>>(null);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const p = heroState.p;
    m.rotation.y += delta * 0.18;
    m.rotation.x = THREE.MathUtils.damp(m.rotation.x, state.pointer.y * 0.35 + p * 1.6, 3.5, delta);
    m.position.x = THREE.MathUtils.damp(m.position.x, state.pointer.x * 0.5, 3.5, delta);
    const targetScale = 1 - p * 0.25;
    m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, targetScale, 4, delta));
    if (mat.current) {
      mat.current.distort = THREE.MathUtils.damp(mat.current.distort, 0.32 + p * 0.3, 3, delta);
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.55, 48]} />
        <MeshDistortMaterial
          ref={mat}
          distort={0.32}
          speed={1.8}
          metalness={1}
          roughness={0.06}
          envMapIntensity={1.5}
          color="#d8d8dc"
        />
      </mesh>
    </Float>
  );
}

/* ─────────────────── studio procedural (zero download) ──────────────────── */

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      {/* softbox-uri reci sus + lateral, o lamă caldă de accent — totul procedural */}
      <Lightformer intensity={2.2} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 6, 1]} />
      <Lightformer intensity={1.4} position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[6, 1.2, 1]} />
      <Lightformer intensity={1.1} position={[5, -0.5, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 0.8, 1]} />
      <Lightformer intensity={2.4} color={ACCENT} position={[2.5, -2.5, -2]} rotation={[0, -Math.PI / 3, 0]} scale={[3, 0.4, 1]} />
      <Lightformer intensity={0.7} color="#bcd4ff" position={[0, -4, 3]} rotation={[-Math.PI / 2, 0, 0]} scale={[8, 3, 1]} />
    </Environment>
  );
}

/* ─────────────────────────── canvas wrapper ─────────────────────────────── */

export default function Hero3D({ variant }: { variant: HeroVariant }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  // pause the render loop entirely once the hero scrolls out of view
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { rootMargin: "120px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden
      className="absolute inset-0"
      style={{ opacity: ready ? 1 : 0, transition: "opacity 1.1s cubic-bezier(0.16,1,0.3,1)" }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 32, position: [0, 0, 7] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={inView ? "always" : "never"}
        onCreated={() => setReady(true)}
      >
        {variant === "lama" && <Lama />}
        {variant === "scantei" && <Scantei />}
        {variant === "crom" && <Crom />}
        <Studio />
      </Canvas>
    </div>
  );
}
