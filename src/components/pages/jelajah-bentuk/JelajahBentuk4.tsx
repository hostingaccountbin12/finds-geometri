/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAudio } from "@/context/AudioContext";
import { useGameState } from "@/context/GameContext";
import { Check, X } from "lucide-react";
import Home from "@/assets/icons/Home.webp";

import BgMenu from "@/assets/icons/BgMenu.webp";
import FooterMenu from "@/assets/icons/FooterMenu.png";
import Pohon from "@/assets/icons/Pohon.png";
import AwanMenu from "@/assets/icons/AwanMenu.png";

// Type definitions
interface Shape {
    id: number;
    size: number;
    color: string;
    type: 'star' | 'trapezoid';
    correctOrder: number;
}

interface Feedback {
    [key: number]: boolean;
}

// Komponen untuk Bintang
const Star: React.FC<{
    size: number;
    color: string;
    isDragging?: boolean;
    style?: React.CSSProperties;
}> = ({ size, color, isDragging = false, style }) => (
    <div
        className={`inline-block transition-all duration-300 ${isDragging ? 'rotate-3 scale-110' : 'hover:scale-105'}`}
        style={{
            width: size,
            height: size,
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            backgroundColor: color,
            border: '2px solid #2D3748',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            ...style
        }}
    />
);

// Komponen untuk Trapesium
const Trapezoid: React.FC<{
    size: number;
    color: string;
    isDragging?: boolean;
    style?: React.CSSProperties;
}> = ({ size, color, isDragging = false, style }) => (
    <div
        className={`inline-block transition-all duration-300 ${isDragging ? 'rotate-3 scale-110' : 'hover:scale-105'}`}
        style={{
            width: size,
            height: size * 0.7, // Tinggi trapesium sedikit lebih pendek
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
            backgroundColor: color,
            border: '2px solid #2D3748',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            ...style
        }}
    />
);

export default function JelajahBentuk4(): JSX.Element {
    const { setComponentVolume } = useAudio();
    const { navigateTo, updateLevelJelajahBentuk, state } = useGameState();
    const [isMobileLandscape, setIsMobileLandscape] = useState<boolean>(false);

    // Game state
    const [availableShapes, setAvailableShapes] = useState<Shape[]>([]);
    const [sortedShapes, setSortedShapes] = useState<Shape[]>([]);
    const [draggedShape, setDraggedShape] = useState<Shape | null>(null);
    const [feedback, setFeedback] = useState<Feedback>({});
    const [completedCount, setCompletedCount] = useState<number>(0);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [gameLevel] = useState<number>(3);

    // Audio state
    const [instructionAudio, setInstructionAudio] = useState<HTMLAudioElement | null>(null);
    const [hasPlayedInstruction, setHasPlayedInstruction] = useState<boolean>(false);

    // Konfigurasi bentuk: 2 bintang dan 2 trapesium - urut dari TERBESAR ke TERKECIL
    const shapeConfigs: { [key: number]: Shape[] } = {
        3: [
            { id: 1, size: 120, color: "#FF6B6B", type: 'star', correctOrder: 1 },      // Terbesar bintang = urutan 1
            { id: 2, size: 100, color: "#E74C3C", type: 'trapezoid', correctOrder: 2 }, // Terbesar trapesium = urutan 2
            { id: 3, size: 80, color: "#4ECDC4", type: 'star', correctOrder: 3 },       // Terkecil bintang = urutan 3
            { id: 4, size: 50, color: "#C0392B", type: 'trapezoid', correctOrder: 4 },  // Terkecil trapesium = urutan 4
        ]
    };

    // Function to check if device is in mobile landscape mode
    const checkMobileLandscape = (): void => {
        const isMobile = window.innerWidth <= 1024;
        const isLandscape = window.innerWidth > window.innerHeight;
        setIsMobileLandscape(isMobile && isLandscape);
    };

    // Shuffle array function
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Initialize game
    const initializeGame = (): void => {
        const levelShapes = shapeConfigs[gameLevel] || shapeConfigs[3];
        setAvailableShapes(shuffleArray(levelShapes));
        setSortedShapes([]);
        setFeedback({});
        setCompletedCount(0);
        setShowSuccess(false);
    };

    // Initialize and play instruction audio
    const initializeInstructionAudio = (): void => {
        try {
            // Ganti dengan path audio instruksi Anda
            const audio = new Audio('/audio/Urutkan bentuk besar-kecil.m4a');
            audio.volume = 1;
            setInstructionAudio(audio);

            // Auto play instruction audio
            const playInstruction = async () => {
                try {
                    await audio.play();
                    setHasPlayedInstruction(true);
                } catch (error) {
                    console.log('Auto-play prevented by browser:', error);
                    // Fallback: play on first user interaction
                    const handleFirstInteraction = async () => {
                        if (!hasPlayedInstruction) {
                            try {
                                await audio.play();
                                setHasPlayedInstruction(true);
                                document.removeEventListener('click', handleFirstInteraction);
                                document.removeEventListener('touchstart', handleFirstInteraction);
                            } catch (err) {
                                console.error('Failed to play instruction audio:', err);
                            }
                        }
                    };

                    document.addEventListener('click', handleFirstInteraction);
                    document.addEventListener('touchstart', handleFirstInteraction);
                }
            };

            // Small delay to ensure component is fully loaded
            setTimeout(playInstruction, 500);

        } catch (error) {
            console.error('Error initializing instruction audio:', error);
        }
    };

    useEffect(() => {
        checkMobileLandscape();
        window.addEventListener('resize', checkMobileLandscape);
        return () => window.removeEventListener('resize', checkMobileLandscape);
    }, []);

    useEffect(() => {
        setComponentVolume(0.2);
        initializeGame();

        // Initialize instruction audio on component mount
        if (!hasPlayedInstruction) {
            initializeInstructionAudio();
        }

        // Cleanup function
        return () => {
            if (instructionAudio) {
                instructionAudio.pause();
                instructionAudio.currentTime = 0;
            }
        };
    }, [setComponentVolume, gameLevel]);

    // Check if game is completed (4 bentuk)
    useEffect(() => {
        if (completedCount === 4) {
            setShowSuccess(true);

            // Update level jika diperlukan
            if (state.levelJelajahBentuk === 4) {
                updateLevelJelajahBentuk(5);
            }

            // Auto navigate ke jelajah-bentuk-4 setelah 3 detik
            const timer = setTimeout(() => {
                navigateTo("jelajah-bentuk-5");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [completedCount, navigateTo, updateLevelJelajahBentuk, state.levelJelajahBentuk]);

    const handleHome = (): void => {
        navigateTo("menu-game");
    };

    // Drag handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, shape: Shape): void => {
        setDraggedShape(shape);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDropToSorted = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        if (!draggedShape) return;

        // Tentukan posisi berikutnya dalam array sorted
        const nextPosition = sortedShapes.length + 1;

        // Cek apakah urutan benar
        const isCorrect = draggedShape.correctOrder === nextPosition;

        if (isCorrect) {
            // Pindahkan ke sorted area
            setSortedShapes(prev => [...prev, draggedShape]);
            setAvailableShapes(prev => prev.filter(s => s.id !== draggedShape.id));
            setFeedback(prev => ({ ...prev, [draggedShape.id]: true }));
            setCompletedCount(prev => prev + 1);
        } else {
            // Tampilkan feedback salah
            setFeedback(prev => ({ ...prev, [draggedShape.id]: false }));

            // Hapus feedback salah setelah 1 detik
            setTimeout(() => {
                setFeedback(prev => {
                    const newFeedback = { ...prev };
                    delete newFeedback[draggedShape.id];
                    return newFeedback;
                });
            }, 1000);
        }

        setDraggedShape(null);
    };

    const handleDropToAvailable = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        if (!draggedShape) return;

        // Jika shape dari sorted area, kembalikan ke available
        if (sortedShapes.find(s => s.id === draggedShape.id)) {
            // Hapus dari sorted area dan semua yang setelahnya
            const draggedIndex = sortedShapes.findIndex(s => s.id === draggedShape.id);
            const shapesToReturn = sortedShapes.slice(draggedIndex);
            const remainingShapes = sortedShapes.slice(0, draggedIndex);

            setSortedShapes(remainingShapes);
            setAvailableShapes(prev => [...prev, ...shapesToReturn]);
            setCompletedCount(remainingShapes.length);

            // Hapus feedback untuk shapes yang dikembalikan
            setFeedback(prev => {
                const newFeedback = { ...prev };
                shapesToReturn.forEach(shape => {
                    delete newFeedback[shape.id];
                });
                return newFeedback;
            });
        }

        setDraggedShape(null);
    };

    // Render shape berdasarkan tipe
    const renderShape = (shape: Shape, isDragging: boolean = false) => {
        if (shape.type === 'star') {
            return (
                <Star
                    size={shape.size}
                    color={shape.color}
                    isDragging={isDragging}
                />
            );
        } else {
            return (
                <Trapezoid
                    size={shape.size}
                    color={shape.color}
                    isDragging={isDragging}
                />
            );
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
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

            <div className="absolute top-8 -left-16 z-0">
                <Image
                    src={AwanMenu}
                    alt="Cloud Decoration"
                    width={isMobileLandscape ? 80 : 550}
                    height={isMobileLandscape ? 80 : 550}
                    className="animate-floating"
                />
            </div>

            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-0">
                <Image
                    src={Pohon}
                    alt="Tree Decoration"
                    width={isMobileLandscape ? 120 : 250}
                    height={isMobileLandscape ? 120 : 250}
                />
            </div>

            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
                <Image
                    src={Pohon}
                    alt="Tree Decoration"
                    width={isMobileLandscape ? 120 : 250}
                    height={isMobileLandscape ? 120 : 250}
                />
            </div>

            {/* Home Button */}
            <div className="absolute top-8 right-8 z-50">
                <button
                    className="flex items-center justify-center transition-all hover:scale-105"
                    onClick={handleHome}
                    type="button"
                >
                    <Image src={Home} alt="Home" width={65} height={65} />
                </button>
            </div>

            {/* Game Content */}
            <div className="relative z-20 w-full max-w-6xl mx-auto px-4">
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold drop-shadow-lg mb-2">
                        Urutkan Bentuk
                    </h1>
                    <p className="text-xl drop-shadow-md">
                        Urutkan bentuk bintang dan trapesium mulai dari terbesar hingga terkecil secara berurutan
                    </p>
                </div>

                {/* Game Area */}
                <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
                    {/* Available Shapes */}
                    <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm min-h-[200px] flex-1">
                        <div
                            className="flex flex-wrap gap-4 justify-center items-center min-h-[120px] border-2 border-dashed border-gray-400 rounded-lg p-4"
                            onDragOver={handleDragOver}
                            onDrop={handleDropToAvailable}
                        >
                            {availableShapes.map((shape) => (
                                <div
                                    key={shape.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, shape)}
                                    className="cursor-grab active:cursor-grabbing hover:cursor-grab relative"
                                >
                                    {renderShape(shape, draggedShape?.id === shape.id)}

                                    {/* Feedback Icons */}
                                    {feedback[shape.id] !== undefined && (
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                                            {feedback[shape.id] ? (
                                                <Check size={24} className="text-white bg-green-500 rounded-full p-1" />
                                            ) : (
                                                <X size={24} className="text-white bg-red-500 rounded-full p-1" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-4xl text-white font-bold">
                        {isMobileLandscape ? '↓' : '→'}
                    </div>

                    {/* Sorted Area */}
                    <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm min-h-[200px] flex-1">
                        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                            Urutkan dari yang terbesar hingga terkecil
                        </h2>
                        <div
                            className={`flex flex-wrap gap-4 justify-center items-center min-h-[120px] border-2 border-dashed rounded-lg p-4 ${completedCount === 4 ? 'border-green-500 bg-green-100' : 'border-blue-400 bg-blue-50'
                                }`}
                            onDragOver={handleDragOver}
                            onDrop={handleDropToSorted}
                        >
                            {sortedShapes.map((shape) => (
                                <div
                                    key={`sorted-${shape.id}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, shape)}
                                    className="cursor-grab active:cursor-grabbing hover:cursor-grab relative"
                                >
                                    {renderShape(shape, draggedShape?.id === shape.id)}
                                </div>
                            ))}

                            {sortedShapes.length === 0 && (
                                <div className="text-gray-500 text-center">
                                    <p className="text-lg font-semibold">Seret bentuk di sini</p>
                                    <p className="text-sm">Mulai dari yang terbesar</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border-8 border-green-500 max-w-md w-full mx-4">
                        <div className="text-8xl mb-6">🎉</div>
                        <h2 className="text-6xl font-bold text-green-600 mb-4">Kerja Bagus!</h2>
                        <p className="text-2xl text-gray-700 mb-6">
                            Kamu berhasil mengurutkan semua bentuk!
                        </p>
                        <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                            <span>Melanjutkan ke level berikutnya...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="absolute -bottom-0 left-0 right-0 z-5">
                <Image
                    src={FooterMenu}
                    alt="Footer"
                    width={2000}
                    height={1000}
                />
            </div>
        </div>
    );
}