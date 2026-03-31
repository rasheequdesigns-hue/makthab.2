import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function LiquidMesh() {
  const meshRef = useRef();
  
  // Custom shader for a subtle liquid/glass look
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#ffffff") }
  }), []);

  useFrame((state) => {
    const { clock } = state;
    meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    
    // Slow rotation
    meshRef.current.rotation.z = clock.getElapsedTime() * 0.05;
  });

  return (
    <mesh ref={meshRef} scale={1.5}>
      <planeGeometry args={[10, 10, 128, 128]} />
      <shaderMaterial
        transparent
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          uniform float uTime;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float pulse = sin(pos.x * 0.5 + uTime * 0.2) * cos(pos.y * 0.5 + uTime * 0.3) * 0.4;
            pos.z += pulse;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          void main() {
            float alpha = 0.08 + 0.04 * sin(vUv.x * 10.0 + uTime * 0.1);
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </mesh>
  );
}

export default function LiquidBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <LiquidMesh />
      </Canvas>
    </div>
  );
}
