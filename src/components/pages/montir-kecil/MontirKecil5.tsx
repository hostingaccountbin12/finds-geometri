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
import CorrectBike from "@/assets/icons/montir-kecil/CorrectBike.gif"
import FirstBike from "@/assets/icons/montir-kecil/FirstBike.gif"

import BulatMerah from "@/assets/icons/montir-kecil/BulatMerah.gif"
import KotakAbu from "@/assets/icons/montir-kecil/KotakAbu.gif"
import PersegiUngu from "@/assets/icons/montir-kecil/PersegiUngu.gif"
import StarPink from "@/assets/icons/montir-kecil/StarPink.gif"


export default function MontirKecil5() {
    const { navigateTo, updateLevelMontirKecil, setMontirKecilFinished } = useGameState();
    const [gameState, setGameState] = useState<'playing' | 'correct' | 'wrong'>('playing');
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [hasPlayedInstructions, setHasPlayedInstructions] = useState<boolean>(false);

    const correctAudioRef = React.useRef<HTMLAudioElement | null>(null);
    const wrongAudioRef = React.useRef<HTMLAudioElement | null>(null);

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
                            currentAudio = new Audio('/audio/Montir kecil sepeda.m4a');
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

    // Effect untuk inisialisasi audio feedback
    useEffect(() => {
        correctAudioRef.current = new Audio('/audio/horee.mp3');
        wrongAudioRef.current = new Audio('/audio/tetot.mp3');

        // Set volume
        if (correctAudioRef.current) correctAudioRef.current.volume = 0.9;
        if (wrongAudioRef.current) wrongAudioRef.current.volume = 0.9;

        // Cleanup
        return () => {
            if (correctAudioRef.current) {
                correctAudioRef.current.pause();
                correctAudioRef.current = null;
            }
            if (wrongAudioRef.current) {
                wrongAudioRef.current.pause();
                wrongAudioRef.current = null;
            }
        };
    }, []);

    const handleBackToMenu = () => {
        navigateTo("menu-game");
    };

    const handleShapeClick = (shape: string) => {
        setSelectedShape(shape);

        if (shape === 'square') {
            setGameState('correct');

            if (correctAudioRef.current) {
                correctAudioRef.current.currentTime = 0;
                correctAudioRef.current.play().catch(err => console.log("Audio play failed:", err));
            }

            // Tampilkan pop-up setelah 2 detik
            setTimeout(() => {
                setShowSuccess(true);
            }, 2000);
        } else {
            setGameState('wrong');

            if (wrongAudioRef.current) {
                wrongAudioRef.current.currentTime = 0;
                wrongAudioRef.current.play().catch(err => console.log("Audio play failed:", err));
            }


            // Reset after 1.5 seconds
            setTimeout(() => {
                setGameState('playing');
                setSelectedShape(null);
            }, 1500);
        }
    };

    const handleGameCompletion = () => {
        updateLevelMontirKecil(1);
        setMontirKecilFinished(true);
        navigateTo("menu-game");
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
                    src={showWheels ? CorrectBike : FirstBike}
                    alt={showWheels ? "Correct Train" : "Train without wheels"}
                    width={250}
                    height={120}
                    className="mx-auto"
                />
            </div>
        </div>
    );

    // Shape options with imported images
    const shapes = [
        { id: 'round', image: BulatMerah, name: 'Round' },
        { id: 'square', image: KotakAbu, name: 'Square' },
        { id: 'rectangle', image: PersegiUngu, name: 'Rectangle' },
        { id: 'star', image: StarPink, name: 'Star' }
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
                    Manakah bentuk pedal sepeda yang tepat?
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

            {/* Success Message - Game Completion */}
            {showSuccess && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-12 text-center shadow-2xl border-8 border-blue-700 max-w-lg w-full mx-4">
                        {/* Trophy Icon */}
                        <div className="text-8xl mb-6">🔧</div>

                        {/* Main Success Message */}
                        <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                            SELAMAT!
                        </h2>

                        {/* Completion Message */}
                        <div className="bg-white bg-opacity-90 rounded-2xl p-6 mb-6">
                            <h3 className="text-3xl font-bold text-blue-700 mb-3">
                                🎉 Game Montir Kecil Selesai! 🎉
                            </h3>
                            <p className="text-lg text-gray-700 mb-2">
                                Kamu telah menyelesaikan semua level!
                            </p>
                            <p className="text-md text-gray-600">
                                Kamu berhasil memperbaiki sepeda dengan sempurna!
                            </p>
                        </div>

                        {/* Mechanic Badge */}
                        {/* <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-8 border-2 border-white border-dashed">
                            <div className="flex items-center justify-center gap-2 text-white">
                                <span className="text-2xl">🏆</span>
                                <span className="text-lg font-semibold">Master Montir Kecil</span>
                                <span className="text-2xl">🏆</span>
                            </div>
                        </div> */}

                        {/* Back to Menu Button */}
                        <button
                            onClick={handleGameCompletion}
                            className="bg-white text-blue-700 font-bold text-xl px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            🏠 Kembali ke Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}