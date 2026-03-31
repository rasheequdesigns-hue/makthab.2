import { usePlane, useBox } from '@react-three/cannon';
import { Text3D, Center, MeshTransmissionMaterial, Stars, Grid } from '@react-three/drei';

export const Wall = ({ position, args }) => {
  const [ref] = useBox(() => ({ type: 'Static', position, args }));
  return (
    <mesh ref={ref} visible={false}>
      <boxGeometry args={args} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
};

export const TrackFloor = () => {
  // Main driving floor
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -0.5, 0] }));
  
  return (
    <group>
      <mesh ref={ref} receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 400]} />
        <meshPhysicalMaterial 
          color="#1a1a24"
          transmission={1} 
          roughness={0.1}
          opacity={0.5}
          transparent
          thickness={2}
          ior={1.5}
        />
      </mesh>
      
      {/* Invisible Constraints (Left/Right Walls) */}
      <Wall position={[-30, 5, 0]} args={[2, 10, 400]} />
      <Wall position={[30, 5, 0]} args={[2, 10, 400]} />
      
      {/* Infinite Space Decor */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Grid position={[0, -0.6, 0]} args={[100, 100]} infiniteGrid fadeDistance={200} cellColor="#ffffff" sectionColor="#00aaff" cellThickness={0.5} sectionThickness={1} />

      {/* Zone A: Start */}
      <group position={[0, 4, -10]}>
        <Center>
          <Text3D font="https://unpkg.com/three/examples/fonts/helvetiker_bold.typeface.json" size={3} height={0.5} curveSegments={12}>
            Muhammed Rasheequ
            <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={0.5} />
          </Text3D>
        </Center>
      </group>

      {/* Zone B: Design Billboards */}
      <group position={[0, 4, -50]}>
        <mesh position={[-8, 0, 0]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[12, 6.75, 0.5]} />
          <MeshTransmissionMaterial anisotropy={1.5} thickness={2} transmission={1} roughness={0.05} ior={1.3} color="#ffffff" clearcoat={1} />
        </mesh>
        <mesh position={[8, 0, 4]} rotation={[0, -0.4, 0]}>
          <boxGeometry args={[12, 6.75, 0.5]} />
          <MeshTransmissionMaterial anisotropy={1.5} thickness={2} transmission={1} roughness={0.05} ior={1.3} color="#ffffff" clearcoat={1} />
        </mesh>
        <mesh position={[0, -3.5, 2]}>
          <boxGeometry args={[4, 1, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Zone C: Dev Terminal */}
      <group position={[0, 4, -100]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[16, 9, 0.2]} />
          <meshStandardMaterial color="#0b0b0f" transparent opacity={0.9} emissive="#0b0b0f" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Zone D: Exhibition Tunnel */}
      <group position={[0, 0, -150]}>
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh key={i} position={[0, 5, -i * 2]} rotation={[0, 0, 0]}>
            <torusGeometry args={[12, 0.1, 8, 32]} />
            <meshBasicMaterial color="#00ffcc" wireframe />
          </mesh>
        ))}
      </group>
    </group>
  );
};
