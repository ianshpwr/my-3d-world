"use client";

import { forwardRef, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import Car from "./Car";

const DriveCar = forwardRef(function DriveCar(props, ref) {
  const carRef = ref || useRef(); // expose ref to parent

  // Car physics state
  const velocity = useRef(0);       
  const steering = useRef(0);       
  const maxSpeed = 0.3;             
  const accel = 0.01;               
  const brakePower = 0.02;          
  const turnSpeed = 0.03;           
  const drag = 0.98;                
  const keys = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  // Keyboard listeners
  useEffect(() => {
    const onKeyDown = (e) => { if (keys.current[e.code] !== undefined) keys.current[e.code] = true; };
    const onKeyUp = (e) => { if (keys.current[e.code] !== undefined) keys.current[e.code] = false; };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame(() => {
    const car = carRef.current;
    if (!car) return;

    // ACCELERATION / BRAKING
    if (keys.current.ArrowUp) velocity.current += accel;
    if (keys.current.ArrowDown) velocity.current -= brakePower;

    // Natural drag
    velocity.current *= drag;

    // Clamp speed
    velocity.current = Math.min(maxSpeed, Math.max(-maxSpeed / 3, velocity.current));

    // Steering only when moving
    if (keys.current.ArrowLeft && Math.abs(velocity.current) > 0.001)
      car.rotation.y += turnSpeed;
    if (keys.current.ArrowRight && Math.abs(velocity.current) > 0.001)
      car.rotation.y -= turnSpeed;

    // MOVE FORWARD along car's facing direction
    const forwardX = -Math.sin(car.rotation.y);
    const forwardZ = -Math.cos(car.rotation.y);

    car.position.x += forwardX * velocity.current;
    car.position.z += forwardZ * velocity.current;

    // Lean while turning
    car.rotation.z = steering.current * 2;
  });

  return (
    <group ref={carRef} position={[0, 0.15, -2]}>
      <Car scale={0.7} />
    </group>
  );
});

export default DriveCar;
