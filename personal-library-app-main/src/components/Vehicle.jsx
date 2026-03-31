import { useFrame } from '@react-three/fiber';
import { useBox, useCylinder, useRaycastVehicle } from '@react-three/cannon';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useInput } from '../hooks/useInput';
import { useStore } from '../store/useStore';
import { useGLTF } from '@react-three/drei';

export const Wheel = ({ radius = 0.5, width = 0.5, leftSide, front, ...props }, ref) => {
  const [wheelRef] = useCylinder(() => ({
    mass: 1,
    type: 'Kinematic',
    material: 'wheel',
    collisionFilterGroup: 0,
    args: [radius, radius, width, 16],
    rotation: [0, 0, leftSide ? Math.PI / 2 : -Math.PI / 2],
    ...props
  }), ref);
  return (
    <mesh ref={wheelRef}>
      <cylinderGeometry args={[radius, radius, width, 16]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  );
};

export const Vehicle = () => {
  const keys = useInput();
  const joystick = useStore((state) => state.joystickValues);
  const setVehiclePos = useStore((state) => state.setVehiclePos);

  const chassisWidth = 2;
  const chassisHeight = 1;
  const chassisLength = 4;
  const chassisMass = 150;

  const [chassisRef, chassisApi] = useBox(() => ({
    mass: chassisMass,
    args: [chassisWidth, chassisHeight, chassisLength],
    position: [0, 5, 0]
  }));

  const wheelRadius = 0.5;
  const wheelWidth = 0.5;
  
  // Create 4 wheels
  const wheel1 = useRef(null);
  const wheel2 = useRef(null);
  const wheel3 = useRef(null);
  const wheel4 = useRef(null);

  const wheelInfo = {
    radius: wheelRadius,
    directionLocal: [0, -1, 0],
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    maxSuspensionForce: 100000,
    maxSuspensionTravel: 0.3,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    axleLocal: [-1, 0, 0],
    chassisConnectionPointLocal: [1, 0, 1],
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: -30,
    frictionSlip: 2
  };

  const wheelInfos = [
    { ...wheelInfo, chassisConnectionPointLocal: [-chassisWidth / 2, -chassisHeight / 2, chassisLength / 2 - 0.5], isFrontWheel: true },
    { ...wheelInfo, chassisConnectionPointLocal: [chassisWidth / 2, -chassisHeight / 2, chassisLength / 2 - 0.5], isFrontWheel: true },
    { ...wheelInfo, chassisConnectionPointLocal: [-chassisWidth / 2, -chassisHeight / 2, -chassisLength / 2 + 0.5], isFrontWheel: false },
    { ...wheelInfo, chassisConnectionPointLocal: [chassisWidth / 2, -chassisHeight / 2, -chassisLength / 2 + 0.5], isFrontWheel: false },
  ];

  const [vehicleRef, vehicleApi] = useRaycastVehicle(() => ({
    chassisBody: chassisRef,
    wheels: [wheel1, wheel2, wheel3, wheel4],
    wheelInfos,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1
  }));

  const position = useRef([0, 0, 0]);
  useEffect(() => {
    const unsub = chassisApi.position.subscribe((p) => {
      position.current = p;
    });
    return unsub;
  }, [chassisApi]);

  useFrame((state) => {
    let engineForce = 0;
    let steeringValue = 0;
    const maxSteerVal = 0.5;
    const maxForce = 500;
    const brakeForce = 10;

    if (keys.forward) engineForce = maxForce;
    if (keys.backward) engineForce = -maxForce;
    if (keys.left) steeringValue = maxSteerVal;
    if (keys.right) steeringValue = -maxSteerVal;

    // Joystick mapping
    if (joystick.y !== 0) engineForce = -joystick.y * maxForce;
    if (joystick.x !== 0) steeringValue = -joystick.x * maxSteerVal;

    // Apply forces
    vehicleApi.applyEngineForce(engineForce, 2);
    vehicleApi.applyEngineForce(engineForce, 3);
    vehicleApi.setSteeringValue(steeringValue, 0);
    vehicleApi.setSteeringValue(steeringValue, 1);

    // Brakes
    if (!keys.forward && !keys.backward && joystick.y === 0) {
      vehicleApi.setBrake(brakeForce, 2);
      vehicleApi.setBrake(brakeForce, 3);
    } else {
      vehicleApi.setBrake(0, 2);
      vehicleApi.setBrake(0, 3);
    }

    // Camera follow (5 units behind, 3 units above)
    // Assuming forward is -Z axis, behind is +Z axis
    const targetCamPosition = new THREE.Vector3(
      position.current[0], 
      position.current[1] + 3, 
      position.current[2] + 5
    );
    state.camera.position.lerp(targetCamPosition, 0.1);
    state.camera.lookAt(position.current[0], position.current[1], position.current[2]);
    
    // Sync store position tracking
    setVehiclePos(position.current);
  });

  return (
    <group ref={vehicleRef}>
      <mesh ref={chassisRef} castShadow>
        <boxGeometry args={[chassisWidth, chassisHeight, chassisLength]} />
        {/* Sleek translucent "glass" vehicle placeholder */}
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} roughness={0.1} thickness={1} metalness={0.2} transparent />
      </mesh>
      <Wheel ref={wheel1} radius={wheelRadius} width={wheelWidth} leftSide front />
      <Wheel ref={wheel2} radius={wheelRadius} width={wheelWidth} front />
      <Wheel ref={wheel3} radius={wheelRadius} width={wheelWidth} leftSide />
      <Wheel ref={wheel4} radius={wheelRadius} width={wheelWidth} />
    </group>
  );
};
