"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ProductModelProps {
  /** Active flavor color — drives material + emissive color */
  accentColor?: string;
  /** Scale multiplier (controlled by GSAP ScrollTrigger) */
  scale?: number;
  /** Position override (controlled by GSAP ScrollTrigger) */
  position?: [number, number, number];
  /** Rotation speed multiplier */
  rotationSpeed?: number;
  /** Float amplitude in Y axis */
  floatAmplitude?: number;
}

/**
 * 🔥 ProductModel — Placeholder 3D mesh for the Hot Spicy hero.
 *
 * SWAP WITH YOUR CUSTOM MODEL:
 * 1. Place your .glb file in /public/models/your-model.glb
 * 2. Replace the <mesh> below with:
 *
 *    import { useGLTF } from "@react-three/drei";
 *    const { scene } = useGLTF("/models/your-model.glb");
 *    return <primitive ref={meshRef} object={scene} scale={scale} />;
 *
 * 3. Add useGLTF.preload("/models/your-model.glb") at the bottom of the file.
 */
export default function ProductModel({
  accentColor = "#E63946",
  scale = 1,
  position = [0, 0, 0],
  rotationSpeed = 0.3,
  floatAmplitude = 0.3,
}: ProductModelProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  // Convert hex color string to Three.js Color for material
  const color = useMemo(() => new THREE.Color(accentColor), [accentColor]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (meshRef.current) {
      // Slow continuous rotation — "showcase spin"
      meshRef.current.rotation.y += 0.003 * rotationSpeed;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;

      // Anti-gravity floating effect
      meshRef.current.position.y =
        position[1] + Math.sin(t * 0.8) * floatAmplitude;
    }

    if (glowRef.current) {
      // Pulsing glow halo behind the model
      const pulse = 0.6 + Math.sin(t * 1.5) * 0.2;
      glowRef.current.scale.setScalar(pulse * 2.8 * scale);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.08 + Math.sin(t * 2) * 0.04;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* ─── Ambient glow sphere behind the product ─── */}
      <mesh ref={glowRef} position={[0, 0, -1]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* ─── Main product placeholder ─── */}
      {/*
        This is a stylized dodecahedron as a placeholder.
        Replace with your .glb model (see instructions above).
      */}
      <mesh ref={meshRef} castShadow>
        <dodecahedronGeometry args={[1.2, 0]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.2}
          metalness={0.8}
          distort={0.15}
          speed={2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* ─── Inner core glow ─── */}
      <mesh scale={0.6}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
          wireframe
        />
      </mesh>

      {/* ─── Orbiting particle ring ─── */}
      <OrbitRing color={accentColor} />
    </group>
  );
}

/** Small orbiting particles around the model */
function OrbitRing({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  const particleCount = 30;

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2 + Math.random() * 0.3;
      return {
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 0.4,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        scale: 0.02 + Math.random() * 0.03,
      };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}
