"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import Car from "./Car";

export default function DriveCar() {
  const carRef = useRef();

  // Car physics state
  const velocity = useRef(0);        // forward speed
  const steering = useRef(0);        // steering angle
  const maxSpeed = 0.3;              // top speed
  const accel = 0.01;                // acceleration
  const brakePower = 0.02;           // braking
  const turnSpeed = 0.03;            // how fast the car turns
  const drag = 0.98;                 // reduces sliding
  const keys = useRef({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false });

  // Keyboard listeners
  useEffect(() => {
    const onKeyDown = e => { if (keys.current[e.code] !== undefined) keys.current[e.code] = true; };
    const onKeyUp = e => { if (keys.current[e.code] !== undefined) keys.current[e.code] = false; };

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

    // Clamp top speed
    velocity.current = Math.min(maxSpeed, Math.max(-maxSpeed / 3, velocity.current));

    // STEERING depends on speed
    if (keys.current.ArrowLeft) steering.current = turnSpeed * Math.sign(velocity.current);
    else if (keys.current.ArrowRight) steering.current = -turnSpeed * Math.sign(velocity.current);
    else steering.current = 0; // straighten wheels

    // ROTATE CAR
    car.rotation.y += steering.current;

    // MOVE FORWARD BASED ON ROTATION
    car.position.x -= Math.sin(car.rotation.y) * velocity.current;
    car.position.z -= Math.cos(car.rotation.y) * velocity.current;

    // Slight body tilt for realism
    car.rotation.z = steering.current * 2; // lean left/right
  });

  return (
    <group ref={carRef} position={[0, 0.15, -2]} >
      <Car scale={0.7} />
    </group>
  );
}
