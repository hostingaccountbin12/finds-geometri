/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useGameState } from "@/context/GameContext";

import BgMenu from "@/assets/icons/BgMenu.webp";
import Pohon from "@/assets/icons/Pohon.png";
import FooterMenu from "@/assets/icons/FooterMenu.png";
import Home from "@/assets/icons/Home.webp";

import BoxMiddle from "@/assets/icons/montir-kecil/BoxMiddle.png"
import CorrectRocket from "@/assets/icons/montir-kecil/CorrectRocket.png"
import FirstRocket from "@/assets/icons/montir-kecil/FirstRocket.gif"

import TrapesiumPink from "@/assets/icons/montir-kecil/TrapesiumPink.gif"
import SegitigaKuning from "@/assets/icons/montir-kecil/SegitigaKuning.gif"
import LoveMerah from "@/assets/icons/montir-kecil/LoveMerah.gif"
import BulatBiru from "@/assets/icons/montir-kecil/BulatBiru.gif"


export default function MontirKecil4() {
    const { navigateTo, updateLevelMontirKecil } = useGameState();
    const [gameState, setGameState] = useState<'playing' | 'correct' | 'wrong'>('playing');
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [hasPlayedInstructions, setHasPlayedInstructions] = useState<boolean>(false);
    
        // Effect untuk auto-play audio instruksi saat komponen pertama kali dimount
        useEffect(() => {
            let isCancelled = false;
            let currentAudio: HTMLAudioElement | null = null;
    
            const playInstructions = async () => {
                if (!hasPlayedInstructions && !isCancelled) {
                    // Delay sedikit untuk memastikan komponen sudah fully loaded
                    setTimeout(async () => {
                        if (!isCancelled && !hasPlayedInstructions) {
                            try {
                                currentAudio = new Audio('/audio/Montir kecil roket.m4a');
                                currentAudio.volume = 1;
                                currentAudio.preload = 'auto';
    
                                const playPromise = currentAudio.play();
                                if (playPromise !== undefined) {
                                    await playPromise;
                                    console.log('Audio instruksi berhasil diputar');
                                    if (!isCancelled) {
                                        setHasPlayedInstructions(true);
                                    }
                                }
                            } catch (error) {
                                console.log('Auto-play audio diblokir atau gagal:', error);
                            }
                        }
                    }, 1000);
                }
            };
    
            playInstructions();
    
            // Cleanup function untuk mencegah memory leak dan double play
            return () => {
                isCancelled = true;
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    currentAudio = null;
                }
            };
        }, []); // Empty dependency array agar hanya dijalankan sekali saat mount

    const handleBackToMenu = () => {
        navigateTo("menu-game");
    };

    const handleShapeClick = (shape: string) => {
        setSelectedShape(shape);

        if (shape === 'round') {
            setGameState('correct');
            // Update level dan navigasi ke montir-kecil-2 setelah 2 detik
            setTimeout(() => {
                updateLevelMontirKecil(5); // Update level ke 2
                navigateTo("montir-kecil-5"); // Navigasi ke level selanjutnya
            }, 2000);
        } else {
            setGameState('wrong');
            // Reset after 1.5 seconds
            setTimeout(() => {
                setGameState('playing');
                setSelectedShape(null);
            }, 1500);
        }
    };

    // Car component with imported images
    const CarDisplay = ({ showWheels }: { showWheels: boolean }) => (
        <div className="relative">
            <Image
                src={BoxMiddle}
                alt="Game Box"
                width={400}
                height={200}
                className="mx-auto"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <Image
                    src={showWheels ? CorrectRocket : FirstRocket}
                    alt={showWheels ? "Correct Train" : "Train without wheels"}
                    width={110}
                    height={120}
                    className="mx-auto"
                />
            </div>
        </div>
    );

    // Shape options with imported images
    const shapes = [
        { id: 'trapezoid', image: TrapesiumPink, name: 'Trapezoid' },
        { id: 'triangle', image: SegitigaKuning, name: 'Triangle' },
        { id: 'love', image: LoveMerah, name: 'Love' },
        { id: 'round', image: BulatBiru, name: 'Round' }
    ];

    const ShapeButton = ({ shape }: { shape: any }) => (
        <button
            onClick={() => handleShapeClick(shape.id)}
            className={`w-32 h-32 transition-all duration-200 hover:scale-110 active:scale-95 ${selectedShape === shape.id ? 'ring-4 ring-yellow-400 rounded-xl' : ''
                }`}
            disabled={gameState !== 'playing'}
        >
            <Image
                src={shape.image}
                alt={shape.name}
                width={100}
                height={100}
                className="w-full h-full object-contain"
            />
        </button>
    );

    return (
        <div className="relative w-full h-screen overflow-hidden flex flex-col">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={BgMenu}
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Home Button */}
            <div className="absolute top-8 right-8 z-50">
                <button
                    className="flex items-center justify-center transition-all hover:scale-105"
                    onClick={handleBackToMenu}
                >
                    <Image src={Home} alt="Home" width={65} />
                </button>
            </div>

            {/* Title */}
            <div className="pt-8 text-center relative z-10">
                <h1 className="text-6xl font-bold text-black mb-4">Montir Kecil!</h1>
                <p className="text-3xl text-black font-semibold">
                    Manakah bentuk kaca roket yang tepat?
                </p>
            </div>

            {/* Game Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8">
                {/* Car Display */}
                <div className="mb-8">
                    <CarDisplay showWheels={gameState === 'correct'} />
                </div>

                {/* Game State Messages */}
                {gameState === 'correct' && (
                    <div className="mb-6 text-center">
                        <div className="bg-green-500 text-white px-8 py-4 rounded-full text-2xl font-bold shadow-lg animate-bounce">
                            Kerja Bagus! 🎉
                        </div>
                    </div>
                )}

                {gameState === 'wrong' && (
                    <div className="mb-6 text-center">
                        <div className="bg-red-500 text-white px-8 py-4 rounded-full text-2xl font-bold shadow-lg animate-pulse">
                            Try Again! 🤔
                        </div>
                    </div>
                )}

                {/* Shape Options */}
                {gameState === 'playing' && (
                    <div className="flex gap-10 justify-center flex-wrap">
                        {shapes.map((shape) => (
                            <ShapeButton key={shape.id} shape={shape} />
                        ))}
                    </div>
                )}
            </div>

            {/* Center Right Decoration */}
            <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 z-0">
                <Image
                    src={Pohon}
                    alt="Center Right Decoration"
                    width={250}
                    height={250}
                />
            </div>

            {/* Center Left Decoration */}
            <div className="absolute top-1/2 -left-12 transform -translate-y-1/2 z-0">
                <Image
                    src={Pohon}
                    alt="Center Left Decoration"
                    width={250}
                    height={250}
                />
            </div>

            {/* Ground */}
            <div className="absolute -bottom-0 left-0 right-0 z-0">
                <Image src={FooterMenu} alt="Footer" width={2000} />
            </div>
        </div>
    );
}