/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, DragEvent } from "react";
import { Check, X } from "lucide-react";
import Home from "@/assets/icons/Home.webp";
import Image from "next/image";

//Tempat
import BoxKeju from "@/assets/icons/dunia-bentuk/dunia-bentuk-2/BoxKeju.png"
import BoxLove from "@/assets/icons/dunia-bentuk/dunia-bentuk-2/BoxLove.png"
import BoxSeng from "@/assets/icons/dunia-bentuk/dunia-bentuk-2/BoxSeng.png"
import BoxBantal from "@/assets/icons/dunia-bentuk/dunia-bentuk-2/BoxBantal.gif"

//Bentuk
import Bantal from "@/assets/icons/dunia-bentuk/dunia-bentuk-2/Bantal.webp"
import Keju from "@/assets/icons/dunia-bentuk/dunia-bentuk-2/Keju.webp"
import Love from "@/assets/icons/dunia-bentuk/dunia-bentuk-2/Love.webp"
import Seng from "@/assets/icons/dunia-bentuk/dunia-bentuk-2/Seng.webp"
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
        name: "seng",
        shape: "rectangle",
        image: Seng,
        bgColor: "bg-blue-400"
    },
    {
        id: 2,
        name: "keju",
        shape: "triangle",
        image: Keju,
        bgColor: "bg-yellow-400"
    },
    {
        id: 3,
        name: "love",
        shape: "love",
        image: Love,
        bgColor: "bg-cyan-200"
    },
    {
        id: 4,
        name: "bantal",
        shape: "square",
        image: Bantal,
        bgColor: "bg-white"
    }
];

const shapeSlots: ShapeSlot[] = [
    { id: 1, shape: "square", image: BoxBantal, bgColor: "bg-blue-500" },
    { id: 2, shape: "love", image: BoxLove, bgColor: "bg-blue-500" },
    { id: 3, shape: "rectangle", image: BoxSeng, bgColor: "bg-blue-500" },
    { id: 4, shape: "triangle", image: BoxKeju, bgColor: "bg-blue-500" }
];

export default function DuniaBentuk2(): JSX.Element {
    const [draggedItem, setDraggedItem] = useState<GameItem | null>(null);
    const [droppedItems, setDroppedItems] = useState<DroppedItems>({});
    const [feedback, setFeedback] = useState<Feedback>({});
    const [completedCount, setCompletedCount] = useState<number>(0);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const { navigateTo, updateLevelDuniaBentuk, state } = useGameState();

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
        navigateTo("menu-game");
    };

    // Effect to handle completion
    useEffect(() => {
        if (completedCount === 4) {
            setShowSuccess(true);

            // Update level to 2 if current level is 1
            if (state.levelDuniaBentuk === 2) {
                updateLevelDuniaBentuk(3);
            }

            // Auto navigate to dunia-bentuk-2 after 3 seconds
            const timer = setTimeout(() => {
                navigateTo("dunia-bentuk-3");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [completedCount, navigateTo, updateLevelDuniaBentuk, state.levelDuniaBentuk]);

    return (
        <div className="relative w-full h-screen bg-[#fef625] overflow-hidden flex flex-col">
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
                                        className="relative w-36 h-32 flex items-center justify-center transition-all duration-200"
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

            {/* Success Message */}
            {showSuccess && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border-8 border-green-500 max-w-md w-full mx-4">
                        <div className="text-8xl mb-6">🎉</div>
                        <h2 className="text-6xl font-bold text-green-600 mb-4">Kerja Bagus!</h2>
                        <p className="text-2xl text-gray-700 mb-6">
                            Kamu berhasil mencocokkan semua bentuk!
                        </p>
                        <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                            <span>Melanjutkan ke level berikutnya...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Progress Indicator */}
            {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-white rounded-full px-6 py-3 border-4 border-gray-800 shadow-lg">
          <span className="text-xl font-bold text-gray-800">
            {completedCount}/4 Benar
          </span>
        </div>
      </div> */}
        </div>
    );
}