"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export default function FollowCamera({ target }) {
  const { camera } = useThree();
  const smoothPos = useRef([0, 0, 0]);
  const smoothLook = useRef([0, 0, 0]);

  useFrame(() => {
    if (!target.current) return;

    const car = target.current;

    // Desired camera position (behind + above car)
    const idealOffset = [
      car.position.x + Math.sin(car.rotation.y) * 4,
      car.position.y + 2,
      car.position.z + Math.cos(car.rotation.y) * 4,
    ];

    // Desired camera look-at target
    const idealLookAt = [
      car.position.x,
      car.position.y + 0.8,
      car.position.z,
    ];

    // Smooth interpolation
    smoothPos.current[0] += (idealOffset[0] - smoothPos.current[0]) * 0.1;
    smoothPos.current[1] += (idealOffset[1] - smoothPos.current[1]) * 0.1;
    smoothPos.current[2] += (idealOffset[2] - smoothPos.current[2]) * 0.1;

    smoothLook.current[0] += (idealLookAt[0] - smoothLook.current[0]) * 0.1;
    smoothLook.current[1] += (idealLookAt[1] - smoothLook.current[1]) * 0.1;
    smoothLook.current[2] += (idealLookAt[2] - smoothLook.current[2]) * 0.1;

    // Apply camera transform
    camera.position.set(...smoothPos.current);
    camera.lookAt(...smoothLook.current);
  });

  return null;
}
