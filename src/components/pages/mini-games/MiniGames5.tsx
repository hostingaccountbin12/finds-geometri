/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Home from "@/assets/icons/Home.webp";
import Image from "next/image";
import { Check, X } from 'lucide-react';
import { Playpen_Sans } from "next/font/google";
import { useGameState } from "@/context/GameContext";

import BanRenang from "@/assets/icons/mini-games/mini-games-5/BanRenang.webp"
import Cokelat from "@/assets/icons/mini-games/mini-games-5/Cokelat.webp"
import Donat from "@/assets/icons/mini-games/mini-games-5/Donat.png"
import Keset from "@/assets/icons/mini-games/mini-games-5/Keset.webp"
import KotakKado from "@/assets/icons/mini-games/mini-games-5/KotakKado.webp"
import Kue from "@/assets/icons/mini-games/mini-games-5/Kue.webp"
import Lampu from "@/assets/icons/mini-games/mini-games-5/Lampu.webp"
import Pigura from "@/assets/icons/mini-games/mini-games-5/Pigura.webp"
import Popit from "@/assets/icons/mini-games/mini-games-5/Popit.webp"
import Sandwich from "@/assets/icons/mini-games/mini-games-5/Sandwich.webp"

// Interface untuk item game
interface GameItem {
    id: number;
    name: string;
    shape: 'triangle' | 'circle' | 'rectangle' | 'cylinder' | 'trapezoid' | 'oval' | 'love' | 'square'
    icon: any;
    selected: boolean;
    matched: boolean;
}

// Type untuk feedback
type FeedbackType = 'correct' | 'wrong' | null;

const playpen = Playpen_Sans({ subsets: ["latin"], weight: "700" });

export default function MiniGames5(): JSX.Element {
    const { navigateTo, updateLevelMiniGames, setMiniGamesFinished } = useGameState();

    const gameItems: GameItem[] = [
        { id: 1, name: 'Keset', shape: 'oval', icon: Keset, selected: false, matched: false },
        { id: 2, name: 'Pop It', shape: 'triangle', icon: Popit, selected: false, matched: false },
        { id: 3, name: 'Kotak Kado', shape: 'square', icon: KotakKado, selected: false, matched: false },
        { id: 4, name: 'Donat', shape: 'circle', icon: Donat, selected: false, matched: false },
        { id: 5, name: 'Cokelat', shape: 'love', icon: Cokelat, selected: false, matched: false },
        { id: 6, name: 'Ban Renang', shape: 'circle', icon: BanRenang, selected: false, matched: false },
        { id: 7, name: 'Lampu', shape: 'oval', icon: Lampu, selected: false, matched: false },
        { id: 8, name: 'Kue', shape: 'love', icon: Kue, selected: false, matched: false },
        { id: 9, name: 'Pigura', shape: 'square', icon: Pigura, selected: false, matched: false },
        { id: 10, name: 'Sandwich', shape: 'triangle', icon: Sandwich, selected: false, matched: false }
    ];

    // State management dengan proper typing
    const [items, setItems] = useState<GameItem[]>(gameItems);
    const [selectedItems, setSelectedItems] = useState<GameItem[]>([]);
    const [showFeedback, setShowFeedback] = useState<FeedbackType>(null);
    const [gameComplete, setGameComplete] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    // Check if game is complete
    useEffect(() => {
        const allMatched = items.every(item => item.matched);
        if (allMatched && items.length > 0) {
            setGameComplete(true);
            updateLevelMiniGames(1);

            // Tampilkan pop-up sertifikat setelah 2 detik
            const timer = setTimeout(() => {
                setShowSuccess(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [items]);

    // Auto check when 2 items are selected
    useEffect(() => {
        if (selectedItems.length === 2) {
            // Small delay to show the selection visually before checking
            const timeoutId = setTimeout(() => {
                checkMatches();
            }, 500);

            // Cleanup timeout
            return () => clearTimeout(timeoutId);
        }
    }, [selectedItems]);

    const handleItemClick = (clickedItem: GameItem): void => {
        if (clickedItem.matched || showFeedback) return;

        const newSelectedItems = [...selectedItems];
        const itemIndex = newSelectedItems.findIndex(item => item.id === clickedItem.id);

        if (itemIndex > -1) {
            // Deselect item
            newSelectedItems.splice(itemIndex, 1);
        } else {
            // Select item (but don't allow more than 2 selections)
            if (newSelectedItems.length < 2) {
                newSelectedItems.push(clickedItem);
            }
        }

        setSelectedItems(newSelectedItems);

        // Update items state
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === clickedItem.id
                    ? { ...item, selected: !item.selected }
                    : item
            )
        );
    };

    const checkMatches = (): void => {
        if (selectedItems.length < 2) return;

        const firstShape = selectedItems[0].shape;
        const allSameShape = selectedItems.every(item => item.shape === firstShape);

        if (allSameShape && selectedItems.length >= 2) {
            // Correct match
            setShowFeedback('correct');

            // Mark items as matched
            setItems(prevItems =>
                prevItems.map(item =>
                    selectedItems.find(selected => selected.id === item.id)
                        ? { ...item, matched: true, selected: false }
                        : item
                )
            );

            setSelectedItems([]);
        } else {
            // Wrong match
            setShowFeedback('wrong');

            // Reset selection
            setItems(prevItems =>
                prevItems.map(item => ({ ...item, selected: false }))
            );
            setSelectedItems([]);
        }

        // Hide feedback after 1 second
        setTimeout(() => {
            setShowFeedback(null);
        }, 1000);
    };

    const handleBackToMenu = (): void => {
        navigateTo("menu-game");
    };

    const handleGameCompletion = () => {
        setMiniGamesFinished(true);
        navigateTo("menu-game");
    };

    return (
        <div className="relative w-full h-screen bg-[#93dfff] overflow-hidden flex flex-col">
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

            {/* Header */}
            <div className="flex justify-center mt-8 mb-4">
                <div className="bg-white border-4 border-yellow-400 rounded-lg px-8 py-4 shadow-lg">
                    <h1 className={`text-3xl ${playpen.className} font-bold text-red-500`}>Mini Games</h1>
                </div>
            </div>

            {/* Instructions */}
            <div className="text-center mb-6">
                <p className="text-2xl font-bold text-black font-serif">
                    Cocokkan gambar berikut berdasarkan bentuk geometri yang sama!
                </p>
            </div>

            {/* Game Grid */}
            <div className="flex-1 flex flex-col items-center justify-center px-8">
                <div className="grid grid-cols-5 gap-4 mb-8">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={`relative bg-white rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 ${item.matched ? 'opacity-50' : ''
                                } ${item.selected ? 'ring-4 ring-blue-500' : ''} ${showFeedback ? 'pointer-events-none' : ''
                                }`}
                            onClick={() => handleItemClick(item)}
                        >
                            {/* Yellow corner */}
                            <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-tr-lg rounded-bl-lg"></div>

                            {/* Item content */}
                            <div className="p-8 flex flex-col items-center justify-center h-32">
                                <Image
                                    src={item.icon}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="object-contain"
                                />
                            </div>

                            {/* Item name */}
                            <div className="bg-yellow-300 text-center py-2 rounded-b-lg">
                                <p className="font-bold text-black">{item.name}</p>
                            </div>

                            {/* Match indicator */}
                            {item.matched && (
                                <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-80 rounded-lg">
                                    <Check className="w-12 h-12 text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Feedback */}
            {showFeedback && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className={`rounded-full p-8 ${showFeedback === 'correct' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                        {showFeedback === 'correct' ? (
                            <Check className="w-16 h-16 text-white" />
                        ) : (
                            <X className="w-16 h-16 text-white" />
                        )}
                    </div>
                </div>
            )}

            {/* Game Complete - Initial Success Message */}
            {gameComplete && !showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border-8 border-green-500 max-w-md w-full mx-4">
                        <div className="text-8xl mb-6">🎉</div>
                        <h2 className="text-6xl font-bold text-green-600 mb-4">Selamat!</h2>
                        <p className="text-2xl text-gray-700 mb-4">Kamu berhasil mencocokkan semua bentuk!</p>
                        <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                            <span>Melanjutkan ke sertifikat...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message - Game Completion Certificate */}
            {showSuccess && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl p-12 text-center shadow-2xl border-8 border-yellow-700 max-w-lg w-full mx-4">
                        {/* Trophy Icon */}
                        <div className="text-8xl mb-6">🏆</div>

                        {/* Main Success Message */}
                        <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                            SELAMAT!
                        </h2>

                        {/* Completion Message */}
                        <div className="bg-white bg-opacity-90 rounded-2xl p-6 mb-6">
                            <h3 className="text-3xl font-bold text-yellow-700 mb-3">
                                🎉 Mini Games Selesai! 🎉
                            </h3>
                            <p className="text-lg text-gray-700 mb-2">
                                Kamu telah menyelesaikan semua level!
                            </p>
                            <p className="text-md text-gray-600">
                                Kamu berhasil mencocokkan semua bentuk geometri dengan sempurna!
                            </p>
                        </div>

                        {/* Geometry Master Badge */}
                        {/* <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-8 border-2 border-white border-dashed">
                            <div className="flex items-center justify-center gap-2 text-white">
                                <span className="text-2xl">🔷</span>
                                <span className="text-lg font-semibold">Master Geometri</span>
                                <span className="text-2xl">🔷</span>
                            </div>
                        </div> */}

                        {/* Back to Menu Button */}
                        <button
                            onClick={handleGameCompletion}
                            className="bg-white text-yellow-700 font-bold text-xl px-8 py-4 rounded-full hover:bg-yellow-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            🏠 Kembali ke Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}