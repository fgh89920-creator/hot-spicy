"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Float,
  Stars,
} from "@react-three/drei";
import ProductModel from "./ProductModel";

interface SceneProps {
  /** Current accent color from product selector */
  accentColor?: string;
  /** Scale multiplier for the model */
  modelScale?: number;
  /** Position override for the model */
  modelPosition?: [number, number, number];
}

/**
 * 🎬 Scene — The main Three.js canvas wrapper.
 * Handles environment, lighting, and the product model.
 */
export default function Scene({
  accentColor = "#E63946",
  modelScale = 1,
  modelPosition = [0, 0, 0],
}: SceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="canvas-wrapper" id="three-canvas">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* ─── Ambient + Directional lighting ─── */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            color="#FFF5E1"
            castShadow
          />
          <pointLight
            position={[-3, 2, -2]}
            intensity={0.5}
            color={accentColor}
          />
          <pointLight
            position={[3, -2, 2]}
            intensity={0.3}
            color="#FF8C42"
          />

          {/* ─── Starfield background ─── */}
          <Stars
            radius={100}
            depth={50}
            count={1500}
            factor={3}
            saturation={0}
            fade
            speed={0.5}
          />

          {/* ─── Product model with Float wrapper ─── */}
          <Float
            speed={1.5}
            rotationIntensity={0.2}
            floatIntensity={0.5}
          >
            <ProductModel
              accentColor={accentColor}
              scale={modelScale}
              position={modelPosition}
            />
          </Float>

          {/* ─── Ground contact shadow ─── */}
          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.3}
            scale={10}
            blur={2.5}
            far={4}
            color={accentColor}
          />

          {/* ─── HDR Environment for reflections ─── */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
