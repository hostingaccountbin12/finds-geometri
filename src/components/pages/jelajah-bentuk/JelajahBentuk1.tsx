/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Home from "@/assets/icons/Home.webp"
import { useGameState } from "@/context/GameContext";

// Game data - different levels with different target shapes
const gameData = [
    {
        id: 1,
        targetShape: "lingkaran",
        targetShapeDisplay: "○",
        targetColor: "#00ff00",
        instruction: "Carilah bentuk-bentuk dibawah ini!",
        objects: [
            { id: 1, type: "clock", shape: "lingkaran", x: 15, y: 15, correct: true },
            { id: 2, type: "window", shape: "persegi", x: 55, y: 15, correct: false },
            { id: 3, type: "pillow", shape: "lingkaran", x: 75, y: 55, correct: true },
            { id: 4, type: "bed", shape: "persegi", x: 45, y: 70, correct: false }
        ]
    },
    {
        id: 2,
        targetShape: "persegi",
        targetShapeDisplay: "□",
        targetColor: "#0066ff",
        instruction: "Carilah bentuk-bentuk dibawah ini!",
        objects: [
            { id: 1, type: "clock", shape: "lingkaran", x: 15, y: 15, correct: false },
            { id: 2, type: "window", shape: "persegi", x: 55, y: 15, correct: true },
            { id: 3, type: "pillow", shape: "lingkaran", x: 75, y: 55, correct: false },
            { id: 4, type: "bed", shape: "persegi", x: 45, y: 70, correct: true }
        ]
    }
];

export default function JelajahBentuk1() {
    const { navigateTo } = useGameState();
    const [currentLevel, setCurrentLevel] = useState(0);
    const [selectedObjects, setSelectedObjects] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<{ [key: number]: 'correct' | 'incorrect' | null }>({});
    const [showResults, setShowResults] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);

    const currentGame = gameData[currentLevel];

    const handleBackToMenu = () => {
        console.log("tes", selectedObjects)
        navigateTo("menu-game");
    };

    const handleObjectClick = (objectId: number) => {
        if (feedback[objectId] !== null) return; // Already answered

        const object = currentGame.objects.find(obj => obj.id === objectId);
        if (!object) return;

        const isCorrect = object.correct;

        setFeedback(prev => ({
            ...prev,
            [objectId]: isCorrect ? 'correct' : 'incorrect'
        }));

        setSelectedObjects(prev => [...prev, objectId]);

        // Check if all objects have been clicked
        setTimeout(() => {
            const allObjectsClicked = currentGame.objects.every(obj =>
                feedback[obj.id] !== undefined && feedback[obj.id] !== null || obj.id === objectId
            );

            if (allObjectsClicked) {
                setShowResults(true);
                setTimeout(() => {
                    if (currentLevel < gameData.length - 1) {
                        // Move to next level
                        setCurrentLevel(prev => prev + 1);
                        setSelectedObjects([]);
                        setFeedback({});
                        setShowResults(false);
                    } else {
                        // Game complete
                        setGameComplete(true);
                    }
                }, 2000);
            }
        }, 1000);
    };

    const resetGame = () => {
        setCurrentLevel(0);
        setSelectedObjects([]);
        setFeedback({});
        setShowResults(false);
        setGameComplete(false);
    };

    if (gameComplete) {
        return (
            <div className="relative w-full h-screen bg-[#fffef0] overflow-hidden flex flex-col items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-green-600 mb-4">Selamat!</h1>
                    <p className="text-2xl mb-8">Kamu telah menyelesaikan semua level!</p>
                    <div className="flex gap-4">
                        <button
                            onClick={resetGame}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Main Lagi
                        </button>
                        <button
                            onClick={handleBackToMenu}
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Kembali ke Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen bg-[#fffef0] overflow-hidden flex flex-col">
            {/* Home Button */}
            <div className="absolute top-2 right-8 z-50">
                <button
                    className="flex items-center justify-center transition-all hover:scale-105"
                    onClick={handleBackToMenu}
                >
                    <Image src={Home} alt="Home" width={65} />
                </button>
            </div>

            {/* Level indicator */}
            <div className="absolute top-4 left-4 z-40 bg-white rounded-lg px-4 py-2 shadow-lg">
                <p className="text-lg font-bold">Level {currentLevel + 1}</p>
            </div>

            {/* Room Scene */}
            <div className="relative w-full h-full">
                {/* Background wall */}
                <div className="absolute inset-0 bg-[#f5e6d3]"></div>

                {/* Clock */}
                <div
                    className={`absolute w-32 h-32 cursor-pointer transition-all duration-300 ${feedback[1] === 'correct' ? 'ring-4 ring-green-400' :
                            feedback[1] === 'incorrect' ? 'ring-4 ring-red-400' :
                                'hover:scale-105'
                        }`}
                    style={{ left: `${currentGame.objects[0].x}%`, top: `${currentGame.objects[0].y}%` }}
                    onClick={() => handleObjectClick(1)}
                >
                    {/* Clock face */}
                    <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border-4 border-pink-700 relative">
                        {/* Clock ears */}
                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-pink-400 rounded-full border-2 border-pink-700"></div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-400 rounded-full border-2 border-pink-700"></div>

                        {/* Clock face */}
                        <div className="absolute inset-2 bg-yellow-300 rounded-full flex items-center justify-center">
                            {/* Clock hands */}
                            <div className="absolute w-8 h-1 bg-green-600 rounded transform -rotate-45 origin-left"></div>
                            <div className="absolute w-6 h-1 bg-green-600 rounded transform rotate-90 origin-left"></div>
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        </div>

                        {/* Numbers */}
                        <div className="absolute inset-0 text-xs font-bold text-blue-600">
                            <span className="absolute top-1 left-1/2 transform -translate-x-1/2">12</span>
                            <span className="absolute top-1/2 right-1 transform -translate-y-1/2">3</span>
                            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2">6</span>
                            <span className="absolute top-1/2 left-1 transform -translate-y-1/2">9</span>
                        </div>
                    </div>

                    {/* Feedback icons */}
                    {feedback[1] === 'correct' && (
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">✓</span>
                        </div>
                    )}
                    {feedback[1] === 'incorrect' && (
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">✗</span>
                        </div>
                    )}
                </div>

                {/* Window */}
                <div
                    className={`absolute w-48 h-32 cursor-pointer transition-all duration-300 ${feedback[2] === 'correct' ? 'ring-4 ring-green-400' :
                            feedback[2] === 'incorrect' ? 'ring-4 ring-red-400' :
                                'hover:scale-105'
                        }`}
                    style={{ left: `${currentGame.objects[1].x}%`, top: `${currentGame.objects[1].y}%` }}
                    onClick={() => handleObjectClick(2)}
                >
                    {/* Window frame */}
                    <div className="w-full h-full bg-yellow-800 rounded-lg p-2">
                        {/* Window glass */}
                        <div className="w-full h-full bg-gradient-to-b from-blue-300 to-blue-500 rounded border-2 border-yellow-900 relative">
                            {/* Window cross */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-1 bg-yellow-800"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1 h-full bg-yellow-800"></div>
                            </div>

                            {/* Clouds */}
                            <div className="absolute top-2 left-4 w-8 h-4 bg-white rounded-full opacity-80"></div>
                            <div className="absolute top-4 right-6 w-6 h-3 bg-white rounded-full opacity-80"></div>

                            {/* Hills */}
                            <div className="absolute bottom-0 left-0 w-full h-8 bg-green-400 rounded-b"></div>
                        </div>
                    </div>

                    {/* Curtains */}
                    <div className="absolute -top-2 -left-4 w-8 h-36 bg-gray-600 rounded-r-lg"></div>
                    <div className="absolute -top-2 -right-4 w-8 h-36 bg-gray-600 rounded-l-lg"></div>

                    {/* Feedback icons */}
                    {feedback[2] === 'correct' && (
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">✓</span>
                        </div>
                    )}
                    {feedback[2] === 'incorrect' && (
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">✗</span>
                        </div>
                    )}
                </div>

                {/* Bed */}
                <div
                    className={`absolute w-64 h-32 cursor-pointer transition-all duration-300 ${feedback[4] === 'correct' ? 'ring-4 ring-green-400' :
                            feedback[4] === 'incorrect' ? 'ring-4 ring-red-400' :
                                'hover:scale-105'
                        }`}
                    style={{ left: `${currentGame.objects[3].x}%`, top: `${currentGame.objects[3].y}%` }}
                    onClick={() => handleObjectClick(4)}
                >
                    {/* Bed frame */}
                    <div className="w-full h-full bg-pink-400 rounded-lg relative">
                        {/* Bed mattress */}
                        <div className="absolute top-2 left-2 right-2 h-16 bg-pink-500 rounded-lg"></div>

                        {/* Bed posts */}
                        <div className="absolute top-0 left-0 w-4 h-full bg-purple-600 rounded-l-lg"></div>
                        <div className="absolute top-0 right-0 w-4 h-full bg-purple-600 rounded-r-lg"></div>

                        {/* Bed legs */}
                        <div className="absolute bottom-0 left-2 w-2 h-4 bg-purple-800"></div>
                        <div className="absolute bottom-0 right-2 w-2 h-4 bg-purple-800"></div>
                    </div>

                    {/* Feedback icons */}
                    {feedback[4] === 'correct' && (
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">✓</span>
                        </div>
                    )}
                    {feedback[4] === 'incorrect' && (
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">✗</span>
                        </div>
                    )}
                </div>

                {/* Pillow */}
                <div
                    className={`absolute w-20 h-16 cursor-pointer transition-all duration-300 ${feedback[3] === 'correct' ? 'ring-4 ring-green-400' :
                            feedback[3] === 'incorrect' ? 'ring-4 ring-red-400' :
                                'hover:scale-105'
                        }`}
                    style={{ left: `${currentGame.objects[2].x}%`, top: `${currentGame.objects[2].y}%` }}
                    onClick={() => handleObjectClick(3)}
                >
                    {/* Pillow shape */}
                    <div className="w-full h-full bg-gradient-to-br from-pink-300 to-pink-500 rounded-full relative border-2 border-pink-600">
                        {/* Pillow pattern */}
                        <div className="absolute inset-2 bg-pink-400 rounded-full opacity-50"></div>

                        {/* Stars pattern */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-1 text-white text-xs">
                                <span>★</span><span>★</span><span>★</span>
                                <span>★</span><span>★</span><span>★</span>
                            </div>
                        </div>
                    </div>

                    {/* Feedback icons */}
                    {feedback[3] === 'correct' && (
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">✓</span>
                        </div>
                    )}
                    {feedback[3] === 'incorrect' && (
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">✗</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom instruction panel */}
            <div className="absolute bottom-4 left-4 right-4 bg-yellow-300 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Jelajah Bentuk!</h2>
                        <p className="text-lg text-gray-700">{currentGame.instruction}</p>
                    </div>

                    {/* Shape targets */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-2xl">○</span>
                            </div>
                            <span className="text-2xl font-bold text-blue-600">= 1</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                                <span className="text-white text-2xl">□</span>
                            </div>
                            <span className="text-2xl font-bold text-blue-600">= 3</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results overlay */}
            {showResults && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 text-center">
                        <h2 className="text-3xl font-bold text-green-600 mb-4">Level Selesai!</h2>
                        <p className="text-xl text-gray-700">
                            {currentLevel < gameData.length - 1 ?
                                "Bersiap untuk level berikutnya..." :
                                "Semua level telah selesai!"
                            }
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}