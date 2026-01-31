"use client"

import * as React from "react"
import { Canvas, useLoader } from "@react-three/fiber"
import { OrbitControls, Stage, useTexture, RoundedBox } from "@react-three/drei"
import * as THREE from "three"

function PouchModel() {
    // Load textures
    const props = useTexture({
        mapFront: '/pousht-pop-oats.jpg',
        mapBack: '/pousht-pop-oats.jpg',
    })

    return (
        <group>
            {/* Front Face */}
            <mesh position={[0, 0, 0.101]}>
                <planeGeometry args={[3, 4]} />
                <meshStandardMaterial map={props.mapFront} transparent roughness={0.4} />
            </mesh>

            {/* Back Face */}
            <mesh position={[0, 0, -0.101]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[3, 4]} />
                <meshStandardMaterial map={props.mapBack} transparent roughness={0.4} />
            </mesh>

            {/* Inner Body (Gives volume - Neutral Grey) */}
            <RoundedBox args={[2.95, 3.95, 0.2]} radius={0.1} smoothness={4}>
                <meshStandardMaterial color="#e4e4e7" roughness={0.5} />
            </RoundedBox>
        </group>
    )
}

interface Product3DModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Product3DModal({ isOpen, onClose }: Product3DModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-0">
            {/* Fullscreen clean container */}
            <div className="relative w-full h-full flex flex-col items-center justify-center">

                {/* Header / Controls */}
                <div className="absolute top-8 right-8 z-10 flex items-center gap-4">
                    <div className="hidden sm:block bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur border border-white/10">
                        Drag to Rotate • Scroll to Zoom
                    </div>
                    <button
                        onClick={onClose}
                        className="group flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full transition-colors font-medium shadow-lg"
                    >
                        <span>Close</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* 3D Canvas */}
                <div className="flex-1 w-full h-full cursor-move">
                    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
                        <Stage environment="city" intensity={0.6}>
                            <PouchModel />
                        </Stage>
                        <OrbitControls autoRotate autoRotateSpeed={2} />
                    </Canvas>
                </div>
            </div>
        </div>
    )
}
