// app/components/ThreeScene.tsx
"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Box, Torus, Environment } from "@react-three/drei";
import { Suspense, useMemo, useRef, useEffect, useState, ReactNode } from "react";
import { Group, MeshStandardMaterial } from "three";

// Types
interface Position {
  x: number;
  y: number;
  z: number;
}

interface FloatingObjectProps {
  children: ReactNode;
  position: [number, number, number];
  speed?: number;
  amplitude?: number;
  rotationSpeed?: number;
  scale?: number;
}

interface CameraSettings {
  distance: number;
  fov: number;
}

function generateFixedPositions(count: number): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const seed = 42;
  let currentSeed = seed;
  
  for (let i = 0; i < count; i++) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const x = (currentSeed / 233280) * 12 - 6;
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const y = (currentSeed / 233280) * 10 - 5;
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const z = (currentSeed / 233280) * 8 - 4;
    positions.push([x, y, z]);
  }
  return positions;
}

// Custom floating component with responsive scaling
function FloatingObject({ 
  children, 
  position, 
  speed = 1, 
  amplitude = 1, 
  rotationSpeed = 0.5, 
  scale = 1
}: FloatingObjectProps) {
  const meshRef = useRef<Group>(null);
  const { size } = useThree();
  const [viewportScale, setViewportScale] = useState<number>(1);
  
  // Calculate responsive scale based on viewport - using useMemo instead of useEffect
  const viewportScaleValue = useMemo(() => {
    const width = size.width;
    if (width < 640) return 0.4;
    if (width < 768) return 0.6;
    if (width < 1024) return 0.8;
    if (width < 1280) return 1;
    return 1.2;
  }, [size.width]);

  // Update viewport scale when it changes
  useEffect(() => {
    setViewportScale(viewportScaleValue);
  }, [viewportScaleValue]);

  const offset = useMemo(() => ({
    x: Math.random() * Math.PI * 2,
    y: Math.random() * Math.PI * 2,
    z: Math.random() * Math.PI * 2,
    rotX: Math.random() * Math.PI * 2,
    rotY: Math.random() * Math.PI * 2,
    rotZ: Math.random() * Math.PI * 2,
  }), []);

  const initialPos = useMemo<Position>(() => ({
    x: position[0],
    y: position[1],
    z: position[2],
  }), [position]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.x = initialPos.x + Math.sin(time * speed * 0.5 + offset.x) * amplitude;
      meshRef.current.position.y = initialPos.y + Math.cos(time * speed * 0.7 + offset.y) * amplitude;
      meshRef.current.position.z = initialPos.z + Math.sin(time * speed * 0.3 + offset.z) * amplitude * 0.5;
      
      meshRef.current.rotation.x += Math.sin(time * rotationSpeed * 0.3 + offset.rotX) * 0.01;
      meshRef.current.rotation.y += Math.cos(time * rotationSpeed * 0.4 + offset.rotY) * 0.01;
      meshRef.current.rotation.z += Math.sin(time * rotationSpeed * 0.2 + offset.rotZ) * 0.005;
    }
  });

  const finalScale = scale * viewportScale;
  return (
    <group ref={meshRef} position={position} scale={finalScale}>
      {children}
    </group>
  );
}

function ResponsiveScene() {
  const { size } = useThree();
  const particlePositions = useMemo(() => generateFixedPositions(30), []);
  
  // Filter particles based on screen size
  const filteredParticles = useMemo(() => {
    const width = size.width;
    let maxParticles = 30;
    if (width < 640) maxParticles = 15;
    else if (width < 1024) maxParticles = 25;
    return particlePositions.slice(0, maxParticles);
  }, [size.width, particlePositions]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8888ff" />
      <pointLight position={[0, 5, 5]} intensity={0.3} color="#60a5fa" />
      
      {/* Large sphere - top left */}
      <FloatingObject position={[-2.5, 2, 0]} speed={0.6} amplitude={1.2} rotationSpeed={0.4} scale={1}>
        <Sphere args={[1.2, 32, 32]}>
          <meshStandardMaterial 
            color="#4f8cf7" 
            roughness={0.2} 
            metalness={0.3}
            transparent
            opacity={0.8}
            emissive="#1a3a8a"
            emissiveIntensity={0.2}
          />
        </Sphere>
      </FloatingObject>

      {/* Torus ring - top right */}
      <FloatingObject position={[2.5, 2, -0.5]} speed={0.8} amplitude={1.5} rotationSpeed={0.6} scale={0.9}>
        <Torus args={[1, 0.3, 16, 32]} rotation={[0.5, 0, 0]}>
          <meshStandardMaterial 
            color="#60a5fa" 
            roughness={0.1} 
            metalness={0.6}
            transparent
            opacity={0.7}
            emissive="#1e3a8a"
            emissiveIntensity={0.2}
          />
        </Torus>
      </FloatingObject>

      {/* Cube - bottom left */}
      <FloatingObject position={[-2, -1.8, 0.5]} speed={0.7} amplitude={1.0} rotationSpeed={0.5} scale={0.85}>
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial 
            color="#818cf8" 
            roughness={0.3} 
            metalness={0.4}
            transparent
            opacity={0.75}
            emissive="#312e81"
            emissiveIntensity={0.15}
          />
        </Box>
      </FloatingObject>

      {/* Small sphere - bottom right */}
      <FloatingObject position={[2.3, -1.5, -0.5]} speed={0.9} amplitude={1.3} rotationSpeed={0.3} scale={0.7}>
        <Sphere args={[0.6, 24, 24]}>
          <meshStandardMaterial 
            color="#34d399" 
            roughness={0.1} 
            metalness={0.5}
            transparent
            opacity={0.8}
            emissive="#065f46"
            emissiveIntensity={0.2}
          />
        </Sphere>
      </FloatingObject>

      {/* Small torus - center */}
      <FloatingObject position={[0, 0.5, -1.5]} speed={1.2} amplitude={0.8} rotationSpeed={0.8} scale={0.6}>
        <Torus args={[0.5, 0.15, 12, 24]} rotation={[0.8, 0.5, 0]}>
          <meshStandardMaterial 
            color="#f472b6" 
            roughness={0.2} 
            metalness={0.3}
            transparent
            opacity={0.6}
            emissive="#831843"
            emissiveIntensity={0.15}
          />
        </Torus>
      </FloatingObject>

      {/* Small cube - floating */}
      <FloatingObject position={[-1.5, -0.5, 2]} speed={1.1} amplitude={1.0} rotationSpeed={0.7} scale={0.65}>
        <Box args={[0.6, 0.6, 0.6]}>
          <meshStandardMaterial 
            color="#fbbf24" 
            roughness={0.15} 
            metalness={0.4}
            transparent
            opacity={0.7}
            emissive="#78350f"
            emissiveIntensity={0.15}
          />
        </Box>
      </FloatingObject>

      {/* Peeking objects */}
      <FloatingObject position={[-3.5, 0.5, 0]} speed={0.5} amplitude={1.8} rotationSpeed={0.3} scale={0.8}>
        <Sphere args={[0.8, 24, 24]}>
          <meshStandardMaterial 
            color="#4f8cf7" 
            roughness={0.2} 
            metalness={0.3}
            transparent
            opacity={0.8}
          />
        </Sphere>
      </FloatingObject>

      <FloatingObject position={[3.5, -0.5, 0]} speed={0.6} amplitude={1.5} rotationSpeed={0.4} scale={0.7}>
        <Box args={[0.7, 0.7, 0.7]}>
          <meshStandardMaterial 
            color="#818cf8" 
            roughness={0.3} 
            metalness={0.4}
            transparent
            opacity={0.75}
          />
        </Box>
      </FloatingObject>

      <FloatingObject position={[0, 3.2, -0.5]} speed={0.7} amplitude={1.2} rotationSpeed={0.5} scale={0.6}>
        <Torus args={[0.6, 0.15, 12, 24]} rotation={[0.3, 0, 0]}>
          <meshStandardMaterial 
            color="#60a5fa" 
            roughness={0.1} 
            metalness={0.5}
            transparent
            opacity={0.7}
          />
        </Torus>
      </FloatingObject>

      <FloatingObject position={[0.5, -3.2, 0.5]} speed={0.8} amplitude={1.4} rotationSpeed={0.3} scale={0.5}>
        <Sphere args={[0.5, 20, 20]}>
          <meshStandardMaterial 
            color="#34d399" 
            roughness={0.1} 
            metalness={0.4}
            transparent
            opacity={0.75}
          />
        </Sphere>
      </FloatingObject>

      {/* Decorative particles */}
      {filteredParticles.map((pos, i) => (
        <FloatingObject 
          key={i} 
          position={pos} 
          speed={0.3 + (i % 5) * 0.1} 
          amplitude={0.5 + (i % 3) * 0.3} 
          rotationSpeed={0.1}
          scale={0.3}
        >
          <Sphere args={[0.04, 8, 8]}>
            <meshStandardMaterial 
              color="#93c5fd" 
              emissive="#3b82f6"
              emissiveIntensity={0.5}
              transparent
              opacity={0.6}
            />
          </Sphere>
        </FloatingObject>
      ))}

      <Environment preset="city" />
    </>
  );
}

export default function ThreeScene() {
  const [cameraSettings, setCameraSettings] = useState({ 
    distance: 8, 
    fov: 50 
  });

  // Update camera settings based on window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let distance = 8;
      let fov = 50;
      
      if (width < 480) { // Small mobile
        distance = 12;
        fov = 65;
      } else if (width < 640) { // Mobile
        distance = 10;
        fov = 60;
      } else if (width < 768) { // Tablet
        distance = 9;
        fov = 55;
      } else if (width < 1024) { // Small desktop
        distance = 8;
        fov = 50;
      } else if (width < 1280) { // Desktop
        distance = 7;
        fov = 50;
      } else { // Large desktop
        distance = 6;
        fov = 45;
      }
      
      setCameraSettings({ distance, fov });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <Canvas 
        camera={{ 
          position: [0, 0, cameraSettings.distance], 
          fov: cameraSettings.fov 
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 50 } }}
      >
        <Suspense fallback={null}>
          <ResponsiveScene />
        </Suspense>
      </Canvas>
    </div>
  );
}