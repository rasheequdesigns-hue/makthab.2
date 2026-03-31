import { useStore } from '../store/useStore';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useSphere } from '@react-three/cannon';
import { useRef } from 'react';

const Zone = ({ position, name }) => {
  const currentZone = useStore((state) => state.currentZone);
  const radius = 15;
  const lastTouched = useRef(0);

  // Requirement: useSphere trigger
  const [ref] = useSphere(() => ({
    type: 'Static',
    isTrigger: true,
    args: [radius],
    position,
    onCollide: (e) => {
      lastTouched.current = performance.now();
      if (useStore.getState().currentZone !== name) {
        useStore.getState().setCurrentZone(name);
      }
    }
  }));

  useFrame(() => {
    // Fallback exit logic since isTrigger doesn't emit onCollideEnd reliably
    if (useStore.getState().currentZone === name) {
      if (performance.now() - lastTouched.current > 200) {
        // We haven't collided in 200ms, assume we exited
        useStore.getState().setCurrentZone(null);
      }
    }
  });

  return (
    <group ref={ref}>
      {/* Visual ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <ringGeometry args={[radius - 0.5, radius, 32]} />
        <meshBasicMaterial color={currentZone === name ? '#ffffff' : '#444455'} transparent opacity={0.5} />
      </mesh>
      <Text position={[0, 4, 0]} fontSize={1.5} color="white" anchorY="bottom">
        {name}
      </Text>
    </group>
  );
};

export const Hub = () => {
  return (
    <group position={[0, 0, 0]}>
      <Text position={[0, 6, 0]} fontSize={3} color="#ffffff">
         KERALA CYBER-TROPICAL
      </Text>
    </group>
  );
}

export const ZoneSystem = () => {
  return (
    <>
      <Hub />
      <Zone position={[0, 0, 0]} name="Start" />
      <Zone position={[0, 0, -50]} name="Design Island" />
      <Zone position={[0, 0, -100]} name="Dev Island" />
      <Zone position={[0, 0, -150]} name="The Tunnel" />
    </>
  );
};
