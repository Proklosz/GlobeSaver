"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Stars from "../components/stars";
import Globe from "../components/globe2";

// Light Component
function Light() {
  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight
        position={[3, 5, 3]}
        color={"white"}
        intensity={100}
        castShadow
      />
    </group>
  );
}

// Main Component
export default function Home() {
  const [drawing, setDrawing] = useState(false);
  const [coloredPercentage, setColoredPercentage] = useState(0);

  return (
    <div className="fixed w-screen h-screen">
      <Canvas
        shadows={true}
        style={{ background: "transparent" }}
        camera={{ position: [0, 0, 5] }}
        className="fixed w-screen h-screen"
      >
        {drawing ? null : <OrbitControls />}
        <Light />
        <Globe
          setDrawing={setDrawing}
          setColoredPercentage={setColoredPercentage}
        />
        <Stars />
      </Canvas>
      <div
        className="absolute top-0 left-0 m-2 rounded-full text-black pl-4 pr-4"
        style={{
          background: `linear-gradient(to right, rgba(34, 197, 94, 1) ${coloredPercentage}%, rgba(255, 255, 255, 1) ${coloredPercentage}%)`,
        }}
      >
        <h3>Colored Surface: {coloredPercentage.toFixed(2)}%</h3>
      </div>
    </div>
  );
}
