/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, DragEvent } from "react";
import { Check, X } from "lucide-react";
import Home from "@/assets/icons/Home.webp";
import Image from "next/image";

//Tempat
import BoxBalon from "@/assets/icons/dunia-bentuk/dunia-bentuk-5/BoxBalon.png"
import BoxBulat from "@/assets/icons/dunia-bentuk/dunia-bentuk-5/BoxBulat.png"
import BoxLukisan from "@/assets/icons/dunia-bentuk/dunia-bentuk-5/BoxLukisan.gif"
import BoxTopi from "@/assets/icons/dunia-bentuk/dunia-bentuk-5/BoxTopi.png"

//Bentuk
import Balon from "@/assets/icons/dunia-bentuk/dunia-bentuk-5/Balon.gif"
import BanLaut from "@/assets/icons/dunia-bentuk/dunia-bentuk-5/BanLaut.webp"
import Lukisan from "@/assets/icons/dunia-bentuk/dunia-bentuk-5/Lukisan.png"
import TopiPesta from "@/assets/icons/dunia-bentuk/dunia-bentuk-5/TopiPesta.gif"

import { useGameState } from "@/context/GameContext";

// Type definitions
interface GameItem {
    id: number;
    name: string;
    shape: string;
    image: any; // Changed to any to accommodate imported images
    bgColor: string;
}

interface ShapeSlot {
    id: number;
    shape: string;
    image: any; // Added image property for slot shapes
    bgColor: string;
}

interface DroppedItems {
    [key: number]: GameItem;
}

interface Feedback {
    [key: number]: boolean;
}

// Data untuk game - menggunakan gambar yang sudah diimport
const gameData: GameItem[] = [
    {
        id: 1,
        name: "balon",
        shape: "oval",
        image: Balon,
        bgColor: "bg-blue-400"
    },
    {
        id: 2,
        name: "banlaut",
        shape: "round",
        image: BanLaut,
        bgColor: "bg-yellow-400"
    },
    {
        id: 3,
        name: "lukisan",
        shape: "square",
        image: Lukisan,
        bgColor: "bg-cyan-200"
    },
    {
        id: 4,
        name: "topipesta",
        shape: "triangle",
        image: TopiPesta,
        bgColor: "bg-white"
    }
];

const shapeSlots: ShapeSlot[] = [
    { id: 1, shape: "square", image: BoxLukisan, bgColor: "bg-blue-500" },
    { id: 2, shape: "triangle", image: BoxTopi, bgColor: "bg-blue-500" },
    { id: 3, shape: "oval", image: BoxBalon, bgColor: "bg-blue-500" },
    { id: 4, shape: "round", image: BoxBulat, bgColor: "bg-blue-500" },
];

export default function DuniaBentuk5(): JSX.Element {
    const [draggedItem, setDraggedItem] = useState<GameItem | null>(null);
    const [droppedItems, setDroppedItems] = useState<DroppedItems>({});
    const [feedback, setFeedback] = useState<Feedback>({});
    const [completedCount, setCompletedCount] = useState<number>(0);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const { navigateTo, setDuniaBentukFinished, updateLevelDuniaBentuk, state, setPlayingInstructionDuniaBentuk } = useGameState();
    const { isPlayingInstructionDuniaBentuk } = state

    // Audio ref untuk kontrol audio
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleDragStart = (e: DragEvent<HTMLDivElement>, item: GameItem): void => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>, slot: ShapeSlot): void => {
        e.preventDefault();

        if (!draggedItem) return;

        const isCorrect = draggedItem.shape === slot.shape;

        // Update dropped items
        const newDroppedItems: DroppedItems = { ...droppedItems };

        // Remove item from previous slot if it exists
        Object.keys(newDroppedItems).forEach(key => {
            const numKey = Number(key);
            if (newDroppedItems[numKey]?.id === draggedItem.id) {
                delete newDroppedItems[numKey];
            }
        });

        newDroppedItems[slot.id] = draggedItem;
        setDroppedItems(newDroppedItems);

        // Update feedback
        const newFeedback: Feedback = { ...feedback };
        newFeedback[slot.id] = isCorrect;
        setFeedback(newFeedback);

        // Update completed count
        const correctCount = Object.values(newFeedback).filter(Boolean).length;
        setCompletedCount(correctCount);

        setDraggedItem(null);

        // Show feedback for a moment
        setTimeout(() => {
            if (!isCorrect) {
                // Remove incorrect item after showing X
                const updatedDropped: DroppedItems = { ...newDroppedItems };
                delete updatedDropped[slot.id];
                setDroppedItems(updatedDropped);

                const updatedFeedback: Feedback = { ...newFeedback };
                delete updatedFeedback[slot.id];
                setFeedback(updatedFeedback);
            }
        }, 1000);
    };

    const handleBackToMenu = () => {
        // Stop audio ketika kembali ke menu
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        navigateTo("menu-game");
    };

    const handleGameCompletion = () => {
        // Stop audio ketika game selesai
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        updateLevelDuniaBentuk(1);
        setDuniaBentukFinished(true);
        navigateTo("menu-game");
    };

    // Effect untuk mengontrol audio instruction berdasarkan state
    useEffect(() => {
        const playAudio = async () => {
            try {
                // Logika 1: Jika isPlayingInstructionDuniaBentuk false, ubah menjadi true dan putar audio
                if (!isPlayingInstructionDuniaBentuk) {
                    setPlayingInstructionDuniaBentuk(true);

                    if (audioRef.current) {
                        audioRef.current.volume = 0.9; // Set volume (0.0 - 1.0)
                        await audioRef.current.play();
                    }
                }
                // Logika 2: Jika isPlayingInstructionDuniaBentuk true, tidak melakukan apa-apa
                // (audio tidak diputar dan state tidak diubah)
            } catch (error) {
                console.log("Audio could not be played automatically:", error);
                // Audio mungkin diblokir oleh browser policy, biarkan user mengklik untuk memutar
            }
        };

        playAudio();

        // Cleanup: pause audio ketika component unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []); // Dependency array kosong karena kita hanya ingin ini berjalan sekali saat mount

    // Effect to handle completion
    useEffect(() => {
        if (completedCount === 4) {
            setShowSuccess(true);

            // Stop audio ketika game selesai
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    }, [completedCount]);

    return (
        <div className="relative w-full h-screen bg-[#fef625] overflow-hidden flex flex-col">
            {/* Audio Element */}
            <audio
                ref={audioRef}
                preload="auto"
            >
                <source src="/audio/Dunia bentuk Fige.m4a" type="audio/mp4" />
            </audio>

            {/* Home Button - Tombol Kembali */}
            <div className="absolute top-8 right-8 z-10">
                <button
                    className="flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                    onClick={handleBackToMenu}
                    type="button"
                >
                    <Image src={Home} alt="Home" width={65} height={65} />
                </button>
            </div>

            {/* Title */}
            <div className="pt-20 pb-8 text-center">
                <h1 className="text-6xl font-bold text-black mb-4">Dunia Bentuk!</h1>
                <p className="text-3xl text-black font-semibold">
                    Cocokkan gambar berikut sesuai bentuk geometrinya!
                </p>
            </div>

            {/* Game Area */}
            <div className="flex-1 flex items-center justify-center px-8">
                <div className="flex gap-12 items-center max-w-5xl w-full mx-auto">

                    {/* Left side - Draggable items */}
                    <div className="flex-1">
                        <div className="grid grid-cols-2 gap-6">
                            {gameData.map((item) => {
                                const isCorrectlyPlaced = Object.entries(droppedItems).some(([slotId, droppedItem]) =>
                                    droppedItem?.id === item.id && feedback[Number(slotId)] === true
                                );

                                return (
                                    <div
                                        key={item.id}
                                        className="w-40 h-44 flex items-center justify-center"
                                    >
                                        {!isCorrectlyPlaced && (
                                            <div
                                                draggable={true}
                                                onDragStart={(e) => handleDragStart(e, item)}
                                                className="cursor-grab active:cursor-grabbing hover:scale-105 transition-all duration-200"
                                            >
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={180}
                                                    height={180}
                                                    className="object-contain"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right side - Drop zones */}
                    <div className="flex-1">
                        <div className="bg-white rounded-3xl border-8 border-gray-800 p-8 shadow-2xl">
                            <div className="grid grid-cols-2 gap-6">
                                {shapeSlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, slot)}
                                        className="relative w-32 h-36 flex items-center justify-center transition-all duration-200"
                                    >
                                        {droppedItems[slot.id] ? (
                                            <Image
                                                src={droppedItems[slot.id].image}
                                                alt={droppedItems[slot.id].name}
                                                width={150}
                                                height={150}
                                                className="object-contain"
                                            />
                                        ) : (
                                            <Image
                                                src={slot.image}
                                                alt={`${slot.shape} slot`}
                                                width={180}
                                                height={180}
                                                className="object-contain opacity-70"
                                            />
                                        )}

                                        {/* Feedback Icons */}
                                        {feedback[slot.id] !== undefined && (
                                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                                                {feedback[slot.id] ? (
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
                    </div>
                </div>
            </div>

            {/* Success Message - Game Completion */}
            {showSuccess && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl p-12 text-center shadow-2xl border-8 border-purple-600 max-w-lg w-full mx-4">
                        {/* Trophy Icon */}
                        <div className="text-8xl mb-6">🏆</div>

                        {/* Main Success Message */}
                        <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                            SELAMAT!
                        </h2>

                        {/* Completion Message */}
                        <div className="bg-white bg-opacity-90 rounded-2xl p-6 mb-6">
                            <h3 className="text-3xl font-bold text-purple-600 mb-3">
                                🎉 Game Dunia Bentuk Selesai! 🎉
                            </h3>
                            <p className="text-lg text-gray-700 mb-2">
                                Kamu telah menyelesaikan semua level!
                            </p>
                            <p className="text-md text-gray-600">
                                Kamu berhasil mencocokkan semua bentuk geometri dengan sempurna!
                            </p>
                        </div>

                        {/* Back to Menu Button */}
                        <button
                            onClick={handleGameCompletion}
                            className="bg-white text-purple-600 font-bold text-xl px-8 py-4 rounded-full hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            🏠 Kembali ke Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}