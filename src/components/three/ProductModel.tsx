"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface ProductModelProps {
  /** Active flavor color — drives material + emissive color */
  accentColor?: string;
  /** Active image path to render */
  activeImage?: string;
  /** Scale multiplier (controlled by GSAP ScrollTrigger) */
  scale?: number;
  /** Position override (controlled by GSAP ScrollTrigger) */
  position?: [number, number, number];
  /** Rotation speed multiplier */
  rotationSpeed?: number;
  /** Float amplitude in Y axis */
  floatAmplitude?: number;
}

export default function ProductModel({
  accentColor = "#E63946",
  activeImage = "/images/shawarma.png",
  scale = 1,
  position = [0, 0, 0],
  rotationSpeed = 0.3,
  floatAmplitude = 0.3,
}: ProductModelProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  // Load the food product texture dynamically (Suspended by the parent Suspense)
  const texture = useTexture(activeImage);

  // Convert hex color string to Three.js Color for material
  const color = useMemo(() => new THREE.Color(accentColor), [accentColor]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Tilt target rotation based on mouse hover position
    const targetX = state.pointer.y * 0.35;
    const targetY = -state.pointer.x * 0.35;

    if (meshRef.current) {
      // Smoothly lerp towards target rotation to follow cursor with fluid inertia
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetX, 0.08);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetY, 0.08);
      
      // Keep subtle idle rolling on Z-axis
      meshRef.current.rotation.z = Math.sin(t * 0.15) * 0.05;

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

      {/* ─── Main product visual (Textured Plane) ─── */}
      <mesh ref={meshRef} castShadow>
        <planeGeometry args={[2.8, 2.8]} />
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.2}
          metalness={0.1}
          side={THREE.DoubleSide}
          depthWrite={true}
        />
      </mesh>

      {/* ─── Inner core glow / particle effect ─── */}
      <mesh scale={0.8} position={[0, 0, -0.1]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.03}
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

  // Optimize: Instantiate single geometry and material to reuse across all instances
  const geom = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 }), [color]);

  // Clean up WebGL resources on unmount
  useEffect(() => {
    return () => {
      geom.dispose();
      mat.dispose();
    };
  }, [geom, mat]);

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh
          key={i}
          position={p.position}
          scale={p.scale}
          geometry={geom}
          material={mat}
        />
      ))}
    </group>
  );
}
