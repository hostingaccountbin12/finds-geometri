/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Home from "@/assets/icons/Home.webp"
import { useGameState } from "@/context/GameContext";

import BiruMuda from "@/assets/icons/mari-berkreasi/BiruMuda.webp"
import BiruTua from "@/assets/icons/mari-berkreasi/BiruTua.webp"
import Coklat from "@/assets/icons/mari-berkreasi/Coklat.webp"
import CoklatMuda from "@/assets/icons/mari-berkreasi/CoklatMuda.webp"
import Hijau from "@/assets/icons/mari-berkreasi/Hijau.webp"
import HijauMuda from "@/assets/icons/mari-berkreasi/HijauMuda.webp"
import Hitam from "@/assets/icons/mari-berkreasi/Hitam.webp"
import Kuning from "@/assets/icons/mari-berkreasi/Kuning.webp"
import MerahMuda from "@/assets/icons/mari-berkreasi/MerahMuda.webp"
import Pink from "@/assets/icons/mari-berkreasi/Pink.webp"
import Putih from "@/assets/icons/mari-berkreasi/Putih.webp"
import Ungu from "@/assets/icons/mari-berkreasi/Ungu.webp"

export default function MariBerkreasi() {
    const { navigateTo } = useGameState();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ceritaAudioRef = useRef<HTMLAudioElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [currentTool, setCurrentTool] = useState<'pencil' | 'eraser'>('pencil');
    const [brushSize, setBrushSize] = useState(3);

    const dataWarnaGambar = [
        {
            colorCode: "#bababa",
            colorImage: Putih
        },
        {
            colorCode: "#4c4c4c",
            colorImage: Hitam
        },
        {
            colorCode: "#ccbb00",
            colorImage: Kuning
        },
        {
            colorCode: "#ff4640",
            colorImage: MerahMuda
        },
        {
            colorCode: "#a3b881",
            colorImage: HijauMuda
        },
        {
            colorCode: "#42b163",
            colorImage: Hijau
        },
        {
            colorCode: "#ca7d4b",
            colorImage: CoklatMuda
        },
        {
            colorCode: "#a07959",
            colorImage: Coklat
        },
        {
            colorCode: "#00aaed",
            colorImage: BiruMuda
        },
        {
            colorCode: "#5c85d4",
            colorImage: BiruTua
        },
        {
            colorCode: "#fe3c9d",
            colorImage: Pink
        },
        {
            colorCode: "#9365bd",
            colorImage: Ungu
        },

    ]

    useEffect(() => {
        const audio = new Audio("/audio/Ceritaku berwarna.m4a");
        audio.volume = 0.8;
        audio.play().catch((err) => {
            console.log("Autoplay diblokir, user harus klik dulu:", err);
        });

        ceritaAudioRef.current = audio;

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Set initial canvas background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set drawing properties
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    // Get mouse/touch position relative to canvas
    const getEventPos = useCallback((e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }, []);

    // Start drawing
    const startDrawing = useCallback((e: any) => {
        e.preventDefault();
        setIsDrawing(true);

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const pos = getEventPos(e);

        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);

        // Set drawing properties based on current tool
        if (currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = brushSize * 3; // Eraser is bigger
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = brushSize;
        }
    }, [currentColor, currentTool, brushSize, getEventPos]);

    // Draw
    const draw = useCallback((e: any) => {
        if (!isDrawing) return;
        e.preventDefault();

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const pos = getEventPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }, [isDrawing, getEventPos]);

    // Stop drawing
    const stopDrawing = useCallback(() => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
        }
    }, []);

    // Clear canvas
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const handleBackToMenu = () => {
        navigateTo("menu-game");
    };

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


            {/* Tools */}
            <div className="flex items-center gap-4 p-4 bg-white border-b-2 border-gray-200">
                {/* Pencil Tool */}
                <button
                    onClick={() => setCurrentTool('pencil')}
                    className={`p-3 rounded-lg border-2 transition-colors ${currentTool === 'pencil'
                        ? 'bg-blue-500 border-blue-600 text-white'
                        : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                        }`}
                    title="Pensil"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                </button>

                {/* Eraser Tool */}
                <button
                    onClick={() => setCurrentTool('eraser')}
                    className={`p-3 rounded-lg border-2 transition-colors ${currentTool === 'eraser'
                        ? 'bg-pink-500 border-pink-600 text-white'
                        : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                        }`}
                    title="Penghapus"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l8.48-8.48c.79-.78 2.05-.78 2.84 0l2.11 2.12zm-1.41 1.41L12 7.83 4.22 15.61l3.54 3.54L15.54 11.3l2.83-2.83-3.54-3.5z" />
                    </svg>
                </button>

                {/* Brush Size */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Ukuran:</span>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-16"
                    />
                    <span className="text-sm w-6">{brushSize}</span>
                </div>

                {/* Clear Button */}
                <button
                    onClick={clearCanvas}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                    Hapus Semua
                </button>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 p-4 bg-gray-50">
                <div className="w-full h-full bg-white rounded-lg border-4 overflow-hidden"
                // style={{
                //     borderWidth: '4px',
                //     borderStyle: 'solid',
                //     borderImage: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet) 1'
                // }}
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        style={{ touchAction: 'none' }}
                    />
                </div>
            </div>

            {/* Color Palette with Pencil Images */}
            <div className="p-4 bg-white border-t-2 border-gray-200">
                <div className="flex flex-wrap justify-center gap-3">
                    {dataWarnaGambar.map((colorData, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentColor(colorData.colorCode);
                                setCurrentTool('pencil');
                            }}
                            className={`relative w-14 h-24 rounded-lg border-2 transition-transform hover:scale-110 ${currentColor === colorData.colorCode && currentTool === 'pencil'
                                    ? 'border-gray-800 scale-110'
                                    : 'border-gray-300'
                                } flex items-end justify-center bg-[#f8f9fa]`}
                            title={`Warna ${colorData.colorCode}`}
                        >
                            <Image
                                src={colorData.colorImage}
                                alt={`Pencil warna ${colorData.colorCode}`}
                                width={36}
                                height={36}
                                className="object-contain"
                            />
                        </button>

                    ))}
                </div>
            </div>
        </div>
    );
}