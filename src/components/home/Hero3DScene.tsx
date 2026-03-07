"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

const islands = [
    { id: '1', position: new THREE.Vector3(-2, 0.5, 1) },
    { id: '2', position: new THREE.Vector3(1, 1.2, -1.5) },
    { id: '3', position: new THREE.Vector3(2.5, -0.5, 2) },
];

function Island({ position }: { position: THREE.Vector3 }) {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime + position.x) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            <mesh receiveShadow position={[0, -0.5, 0]}>
                <cylinderGeometry args={[1.2, 1.0, 0.4, 32]} />
                <meshStandardMaterial color="#f9f7f2" roughness={0.8} />
            </mesh>

            <group position={[0, -0.3, 0]}>
                <mesh position={[0, 0.3, 0]} castShadow>
                    <boxGeometry args={[0.8, 0.6, 0.8]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.3} />
                </mesh>

                <mesh position={[0, 0.6, 0]} castShadow>
                    <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial color="#0bda95" roughness={0.4} metalness={0.1} />
                </mesh>

                <mesh position={[0.6, 0.6, -0.5]} castShadow>
                    <cylinderGeometry args={[0.08, 0.1, 1.2, 16]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.3} />
                </mesh>

                <mesh position={[0.6, 1.35, -0.5]} castShadow>
                    <cylinderGeometry args={[0.001, 0.1, 0.3, 16]} />
                    <meshStandardMaterial color="#0bda95" roughness={0.4} />
                </mesh>
            </group>
        </group>
    );
}

function AnimatedScene() {
    const sceneRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        if (sceneRef.current) {
            sceneRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <group ref={sceneRef}>
            {islands.map((island) => (
                <Island key={island.id} position={island.position} />
            ))}
        </group>
    );
}

export default function Hero3DScene() {
    return (
        <Canvas
            camera={{ position: [0, 4, 8], fov: 45 }}
            shadows
            gl={{ antialias: true, alpha: true }}
        >
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={1.2}
                castShadow
            />
            <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#eacd5a" />

            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
                <AnimatedScene />
            </Float>

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2}
                autoRotate={false}
            />
        </Canvas>
    );
}
