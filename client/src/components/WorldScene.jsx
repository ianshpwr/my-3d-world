"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { Suspense } from "react";
import DriveCar from "./DriveCar";

const projects = [
  { title: "DejaView AI", desc: "Memory + FAISS + AI", z: -5 },
  { title: "Fleetcode Arena", desc: "1v1 DSA battles", z: -15 },
  { title: "Startup Valuation", desc: "Financial modeling tool", z: -25 },
];

function Road() {
  return (
    <mesh position={[0, 0, -15]}>
      {/* road is a long flat box */}
      <boxGeometry args={[4, 0.1, 40]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -15]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#050508" />
    </mesh>
  );
}

function ProjectWall({ title, desc, side = "left", z }) {
  const x = side === "left" ? -3 : 3; // left/right of road

  return (
    <group position={[x, 1.2, z]}>
      {/* Wall block */}
      <mesh>
        <boxGeometry args={[2, 2, 0.3]} />
        <meshStandardMaterial color={side === "left" ? "#9b5cf7" : "#f97316"} />
      </mesh>

      {/* 3D-attached HTML label */}
      <Html distanceFactor={8} position={[0, 0, 0.8]}>
        <div className="rounded-xl bg-black/80 border border-white/10 px-3 py-2 text-xs text-white w-40">
          <div className="font-semibold text-sm">{title}</div>
          <div className="text-[10px] text-gray-300">{desc}</div>
        </div>
      </Html>
    </group>
  );
}

export default function WorldScene() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [8, 6, 8], fov: 50 }}>
        <color attach="background" args={["#050510"]} />

        {/* Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1.1} />

        <Suspense fallback={null}>
<DriveCar />


          <Ground />
          <Road />

          {/* Place walls along the road on left + right side */}
          {projects.map((p, i) => (
            <>
              <ProjectWall
                key={p.title + "-L"}
                title={p.title}
                desc={p.desc}
                side="left"
                z={p.z}
              />
              <ProjectWall
                key={p.title + "-R"}
                title={p.title}
                desc={p.desc}
                side="right"
                z={p.z - 4}
              />
            </>
          ))}
        </Suspense>

        {/* Camera controls – drag to look around, scroll to zoom */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  );
}
