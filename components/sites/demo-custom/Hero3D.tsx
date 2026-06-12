"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { heroState } from "./heroState";

const ACCENT = "#ff4533";

// Canvas-ul stă cu pointer-events:none ca textul/CTA-urile de sub el să rămână
// clicabile, deci pointerul R3F nu primește evenimente — îl urmărim pe window.
const pointer = { x: 0, y: 0 };

/* ───────────────────────── briciul crom procedural ──────────────────────── */

function Lama() {
  const group = useRef<THREE.Group>(null);
  const handle = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = heroState.p;
    const tx = pointer.y * 0.22 + 0.15 + p * 1.1;
    const ty = pointer.x * 0.38 - 0.5 + p * 2.4;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, 4, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty, 4, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, -p * 1.5, 4, delta);
    if (handle.current) {
      // briciul se deschide pe măsură ce derulezi
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
        {/* lama */}
        <group position={[0.55, 0.25, 0]}>
          <RoundedBox args={[3.3, 0.6, 0.07]} radius={0.035} smoothness={4}>
            <meshStandardMaterial {...chrome} />
          </RoundedBox>
          <RoundedBox args={[3.3, 0.12, 0.12]} radius={0.05} smoothness={4} position={[0, 0.34, 0]}>
            <meshStandardMaterial {...chrome} roughness={0.12} />
          </RoundedBox>
          {/* tăișul — accentul roșu incandescent */}
          <mesh position={[0, -0.315, 0]}>
            <boxGeometry args={[3.26, 0.025, 0.078]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.35} metalness={0.6} roughness={0.3} />
          </mesh>
          <RoundedBox args={[0.7, 0.22, 0.06]} radius={0.03} position={[1.95, -0.12, 0]} rotation={[0, 0, -0.35]}>
            <meshStandardMaterial {...chrome} />
          </RoundedBox>
        </group>
        {/* pivotul */}
        <mesh position={[-1.25, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.22, 24]} />
          <meshStandardMaterial {...chrome} roughness={0.15} />
        </mesh>
        {/* mânerul — se rotește pe pivot */}
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

/* ─────────────── studio de lumini 100% procedural (zero download) ────────── */

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer intensity={2.2} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 6, 1]} />
      <Lightformer intensity={1.4} position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[6, 1.2, 1]} />
      <Lightformer intensity={1.1} position={[5, -0.5, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 0.8, 1]} />
      <Lightformer intensity={2.4} color={ACCENT} position={[2.5, -2.5, -2]} rotation={[0, -Math.PI / 3, 0]} scale={[3, 0.4, 1]} />
      <Lightformer intensity={0.7} color="#bcd4ff" position={[0, -4, 3]} rotation={[-Math.PI / 2, 0, 0]} scale={[8, 3, 1]} />
    </Environment>
  );
}

/* ─────────────────────────── wrapper-ul canvas ───────────────────────────── */

export default function Hero3D() {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // oprește bucla de randare complet când hero-ul iese din viewport
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
      className="pointer-events-none absolute inset-0 z-[8]"
      style={{ opacity: ready ? 1 : 0, transition: "opacity 1.1s cubic-bezier(0.16,1,0.3,1)" }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 32, position: [0, 0, 7] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={inView ? "always" : "never"}
        onCreated={() => setReady(true)}
      >
        <Lama />
        <Studio />
      </Canvas>
    </div>
  );
}
