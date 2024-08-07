"use client";

import React, { useState, useEffect, useRef } from "react";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import * as THREE from "three";

export default function Stars() {
  const particleCount = 1000; // Number of particles
  const particlesRef = useRef();

  // Create particles
  useEffect(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      let random1 = Math.random() - 0.5;
      let random2 = Math.random() - 0.5;
      let random3 = Math.random() - 0.5;
      // Random positions
      //

      if (Math.abs(random1) + Math.abs(random2) + Math.abs(random3) < 0.75) {
        if (random1 > 0) {
          positions[i * 3] = (random1 + 0.1) * 200;
        } else {
          positions[i * 3] = (random1 - 0.1) * 200;
        }

        if (random2 > 0) {
          positions[i * 3 + 1] = (random2 + 0.1) * 200;
        } else {
          positions[i * 3 + 1] = (random2 - 0.1) * 200;
        }

        if (random3 > 0) {
          positions[i * 3 + 2] = (random3 + 0.1) * 200;
        } else {
          positions[i * 3 + 2] = (random3 - 0.1) * 200;
        }
      } else {
        positions[i * 3] = (Math.random() - 0.5) * 300;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 300;
      }

      // Random colors
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    particlesRef.current.geometry = geometry;
  }, []);

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial
        vertexColors
        size={0.5}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}
