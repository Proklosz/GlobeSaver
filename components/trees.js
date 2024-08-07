import React, { useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

const Instance = ({ position, color, quaternion }) => {
  const [spring, api] = useSpring(() => ({
    scale: [0, 0, 0],
    config: { duration: 2000 }, // 2 seconds
  }));

  useEffect(() => {
    api.start({ scale: [1, 1, 1] });
  }, [api]);

  return (
    <animated.group
      position={position}
      scale={spring.scale}
      quaternion={quaternion}
    >
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.2, 1]} />

        <meshStandardMaterial color="green" />
      </mesh>
    </animated.group>
  );
};

export default Instance;
