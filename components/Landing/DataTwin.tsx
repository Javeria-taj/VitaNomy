'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function TwinModel() {
  const groupRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()

  useFrame((state) => {
    if (!groupRef.current) return
    
    // Subtle ambient floating animation (sine wave on Y-axis)
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1

    // Follow mouse pointer slightly
    const targetX = (mouse.x * Math.PI) / 10
    const targetY = (mouse.y * Math.PI) / 10
    
    // Smooth interpolation
    groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05
  })

  // Material for the abstract twin (wireframe)
  const material = new THREE.MeshStandardMaterial({
    color: '#113826',
    wireframe: true,
    transparent: true,
    opacity: 0.8,
  })

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, 3, 0]} material={material}>
        <sphereGeometry args={[0.8, 16, 16]} />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 0.5, 0]} material={material}>
        <cylinderGeometry args={[1.2, 1, 3.5, 16, 8]} />
      </mesh>
      
      {/* Shoulders */}
      <mesh position={[-1.5, 1.8, 0]} material={material}>
        <sphereGeometry args={[0.5, 12, 12]} />
      </mesh>
      <mesh position={[1.5, 1.8, 0]} material={material}>
        <sphereGeometry args={[0.5, 12, 12]} />
      </mesh>

      {/* Floating UI Overlays */}
      
      {/* Left arm area: Glucose */}
      <Html position={[-2.2, 1.5, 0]} center>
        <div className="bg-[#F4F2E9] border-2 border-black rounded-lg px-3 py-2 shadow-[4px_4px_0px_#000000] font-bold text-[11px] text-black whitespace-nowrap flex items-center gap-2 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black"></div>
          Glucose: 118 mg/dL
        </div>
      </Html>
      
      {/* Chest area: BP */}
      <Html position={[1.2, 0.8, 1]} center zIndexRange={[100, 0]}>
        <div className="bg-[#F4F2E9] border-2 border-black rounded-lg px-3 py-2 shadow-[4px_4px_0px_#000000] font-bold text-[11px] text-black whitespace-nowrap flex items-center gap-2 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-black"></div>
          BP: 138 / 88
        </div>
      </Html>
      
      {/* Bottom right area: BMI */}
      <Html position={[1.8, -1.5, 0]} center>
        <div className="bg-[#F4F2E9] border-2 border-black rounded-lg px-3 py-2 shadow-[4px_4px_0px_#000000] font-bold text-[11px] text-black whitespace-nowrap flex items-center gap-2 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 border-2 border-black"></div>
          BMI: 30.1
        </div>
      </Html>
    </group>
  )
}

export function DataTwin() {
  return (
    <div className="w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing relative">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <Environment preset="city" />
        <TwinModel />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}
