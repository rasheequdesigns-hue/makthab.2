import { Box, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const Billboard = ({ position, title, subtitle }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      <Box args={[4, 2.5, 0.1]} material-color="#111" />
      <Text position={[0, 0.3, 0.06]} fontSize={0.3} color="white">
        {title}
      </Text>
      <Text position={[0, -0.3, 0.06]} fontSize={0.15} color="#aaaaaa">
        {subtitle}
      </Text>
    </group>
  );
};

export const Gallery = () => {
  return (
    <group position={[20, 0, 20]}>
      <Text position={[0, 4, -4]} fontSize={1} color="white">
        Projects Gallery
      </Text>
      <Billboard position={[-5, 2, 0]} title="Project Alpha" subtitle="Cyberpunk Brand Identity" />
      <Billboard position={[0, 2, 3]} title="Project Beta" subtitle="Glassmorphism UI/UX" />
      <Billboard position={[5, 2, 0]} title="Project Gamma" subtitle="3D Product Showreel" />
    </group>
  );
};
