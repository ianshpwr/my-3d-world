"use client";
import { useGLTF } from "@react-three/drei";

export default function Car({ position = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF("/models/mclaren_f1.glb");

  return (
    <primitive 
      object={scene} 
      position={position}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
      rotation={[0, Math.PI / 2, 0]} // rotate car to face forward
    />
  );
}
