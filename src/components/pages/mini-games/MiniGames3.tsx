/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Home from "@/assets/icons/Home.webp";
import Image from "next/image";
import { Check, X } from 'lucide-react';
import { Playpen_Sans } from "next/font/google";
import { useGameState } from "@/context/GameContext";

import Balon from "@/assets/icons/mini-games/mini-games-3/Balon.webp"
import Globe from "@/assets/icons/mini-games/mini-games-3/Globe.webp"
import Kaleng from "@/assets/icons/mini-games/mini-games-3/Kaleng.webp"
import Koper from "@/assets/icons/mini-games/mini-games-3/Koper.webp"
import Kue from "@/assets/icons/mini-games/mini-games-3/Kue.webp"
import Mainan from "@/assets/icons/mini-games/mini-games-3/Mainan.webp"
import Sepatu from "@/assets/icons/mini-games/mini-games-3/Sepatu.webp"
import Tas from "@/assets/icons/mini-games/mini-games-3/Tas.webp"
import TempatPensil from "@/assets/icons/mini-games/mini-games-3/TempatPensil.webp"
import Toples from "@/assets/icons/mini-games/mini-games-3/Toples.webp"

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

export default function MiniGames3(): JSX.Element {
    const { navigateTo, updateLevelMiniGames } = useGameState();

    // Data game items dengan icon dan nama yang sesuai import
    const gameItems: GameItem[] = [
        { id: 1, name: 'Tempat Pensil', shape: 'oval', icon: TempatPensil, selected: false, matched: false },
        { id: 2, name: 'Kue', shape: 'triangle', icon: Kue, selected: false, matched: false },
        { id: 3, name: 'Koper', shape: 'rectangle', icon: Koper, selected: false, matched: false },
        { id: 4, name: 'Sepatu', shape: 'circle', icon: Sepatu, selected: false, matched: false },
        { id: 5, name: 'Globe', shape: 'cylinder', icon: Globe, selected: false, matched: false },
        { id: 6, name: 'Toples', shape: 'oval', icon: Toples, selected: false, matched: false },
        { id: 7, name: 'Kaleng', shape: 'cylinder', icon: Kaleng, selected: false, matched: false },
        { id: 8, name: 'Mainan', shape: 'triangle', icon: Mainan, selected: false, matched: false },
        { id: 9, name: 'Tas', shape: 'rectangle', icon: Tas, selected: false, matched: false },
        { id: 10, name: 'Balon', shape: 'circle', icon: Balon, selected: false, matched: false }
    ];

    // State management dengan proper typing
    const [items, setItems] = useState<GameItem[]>(gameItems);
    const [selectedItems, setSelectedItems] = useState<GameItem[]>([]);
    const [showFeedback, setShowFeedback] = useState<FeedbackType>(null);
    const [gameComplete, setGameComplete] = useState<boolean>(false);

    // Check if game is complete
    useEffect(() => {
        const allMatched = items.every(item => item.matched);
        if (allMatched && items.length > 0) {
            setGameComplete(true);
            updateLevelMiniGames(4);

            const timer = setTimeout(() => {
                navigateTo("mini-games-4");
            }, 3000);

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
                    <h1 className={`text-4xl ${playpen.className} font-bold text-red-500`}>Mini Games</h1>
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
                <div className="grid grid-cols-5 gap-10 mb-8">
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
                                    width={76}
                                    height={64}
                                    className="object-contain"
                                />
                            </div>

                            {/* Item name */}
                            <div className="bg-yellow-300 text-center py-2 rounded-b-lg">
                                <p className="font-bold text-black text-xl">{item.name}</p>
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

            {/* Game Complete */}
            {gameComplete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border-8 border-green-500 max-w-md w-full mx-4">
                        <div className="text-8xl mb-6">🎉</div>
                        <h2 className="text-6xl font-bold text-green-600 mb-4">Selamat!</h2>
                        <p className="text-2xl text-gray-700 mb-4">Kamu berhasil mencocokkan semua bentuk!</p>
                        <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                            <span>Melanjutkan ke level berikutnya...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}