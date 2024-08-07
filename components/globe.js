import React, { useState, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import Instance from "./trees"; // Import the Instance component

export default function Globe({ setDrawing, setColoredPercentage }) {
  const meshRef = useRef();
  const [geometry, setGeometry] = useState(null);
  const [colors, setColors] = useState([]);
  const [instancePositions, setInstancePositions] = useState([]);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const { camera } = useThree();
  const isDrawing = useRef(false);

  const coloredVertices = useRef(new Set()); // Set to track colored vertices

  useEffect(() => {
    if (meshRef.current) {
      const geom = meshRef.current.geometry.clone();
      setGeometry(geom);
      const colorArray = new Float32Array(geom.attributes.position.count * 3);
      geom.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
      setColors(colorArray);
    }
  }, [meshRef]);

  const handleMouseMove = (event) => {
    if (event.target.getBoundingClientRect()) {
      const rect = event.target.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    if (isDrawing.current) {
      draw();
    }
  };

  const handleMouseDown = () => {
    if (!geometry) return;
    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObject(meshRef.current);

    if (intersects.length > 0) {
      isDrawing.current = true;
      draw();
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    setDrawing(false);
  };

  const countVerticesWithColor = (geometry, targetColor) => {
    if (!geometry || !geometry.attributes || !geometry.attributes.color)
      return 0;

    const colorArray = geometry.attributes.color.array;
    const tolerance = 0.01; // Allow some tolerance for color comparison
    let count = 0;

    for (let i = 0; i < colorArray.length; i += 3) {
      const vertexColor = new THREE.Color(
        colorArray[i],
        colorArray[i + 1],
        colorArray[i + 2]
      );

      if (
        Math.abs(vertexColor.r - targetColor.r) < tolerance &&
        Math.abs(vertexColor.g - targetColor.g) < tolerance &&
        Math.abs(vertexColor.b - targetColor.b) < tolerance
      ) {
        count++;
      }
    }

    return count;
  };

  const draw = () => {
    if (!geometry) return;

    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObject(meshRef.current);

    if (intersects.length > 0) {
      setDrawing(true);

      const intersection = intersects[0];
      const intersectedPoint = intersection.point;
      const radius = 0.5; // Adjust the radius as needed
      const color = new THREE.Color(0.1, 0.5, 0.1);
      const coloredCount = countVerticesWithColor(geometry, color);

      const positions = geometry.attributes.position.array;

      const newPositions = []; // Array to hold new instance positions

      for (let i = 0; i < positions.length; i += 3) {
        const vertex = new THREE.Vector3(
          positions[i],
          positions[i + 1],
          positions[i + 2]
        );
        const distance = vertex.distanceTo(intersectedPoint);

        if (distance < radius && !coloredVertices.current.has(i / 3)) {
          if (
            colors[i] !== color.r ||
            colors[i + 1] !== color.g ||
            colors[i + 2] !== color.b
          ) {
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;

            if (Math.random() > 0.8) {
              // Ensure that new positions aren't too close to existing ones
              let tooClose = false;
              for (const pos of newPositions) {
                const newPos = new THREE.Vector3(...pos);
                if (vertex.distanceTo(newPos) < 50) {
                  tooClose = true;
                  break;
                }
              }

              if (!tooClose) {
                newPositions.push([vertex.x, vertex.y, vertex.z]);
                coloredVertices.current.add(i / 3);
              }
            }
          }
        }
      }

      geometry.attributes.color.needsUpdate = true;

      const totalVertices = positions.length / 3;
      const percentageColored = (coloredCount / totalVertices) * 100;
      setColoredPercentage(percentageColored);

      // Update the instance positions state
      setInstancePositions((prevPositions) => [
        ...prevPositions,
        ...newPositions,
      ]);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [geometry, colors]);

  return (
    <>
      <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
        <icosahedronGeometry args={[2, 30]} />
        <meshPhysicalMaterial
          vertexColors={true}
          attach="material"
          opacity={1}
          transparent
        />
      </mesh>
      {instancePositions.map((position, index) => (
        <Instance key={index} position={position} color="red" />
      ))}
    </>
  );
}
