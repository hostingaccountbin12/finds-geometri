"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGameState } from "@/context/GameContext";
import { Playpen_Sans } from "next/font/google";
import Image from "next/image";

import BgMenu from "@/assets/icons/BgMenu.webp";
import Pohon from "@/assets/icons/Pohon.png";
import FooterMenu from "@/assets/icons/FooterMenu.png";
import Home from "@/assets/icons/Home.webp";
import Restart from "@/assets/icons/Restart.webp";

const playpen = Playpen_Sans({ subsets: ["latin"], weight: "700" });

// Sample lyrics data dengan timing (dalam detik)
interface LyricLine {
    text: string;
    startTime: number;
    endTime: number;
}

const sampleLyrics: LyricLine[] = [
    { text: "Matahari bersinar terang", startTime: 2, endTime: 4 },
    { text: "Di langit yang biru", startTime: 4.5, endTime: 6.5 },
    { text: "Burung-burung bernyanyi", startTime: 7, endTime: 9 },
    { text: "Menyambut pagi baru", startTime: 9.5, endTime: 11.5 },
    { text: ".......", startTime: 12, endTime: 13 },
    { text: "Ayo kita bersenang-senang", startTime: 14, endTime: 16 },
    { text: "Menyanyi bersama", startTime: 16.5, endTime: 18.5 },
    { text: "Dengan hati yang gembira", startTime: 19, endTime: 21 },
    { text: "Selamanya bahagia", startTime: 21.5, endTime: 23.5 },
];

interface LyricsDisplayProps {
    isMobile?: boolean;
}

export default function AyoMenyanyi(): JSX.Element {
    const { navigateTo } = useGameState();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Karaoke states
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(-1);
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [visibleWindow, setVisibleWindow] = useState<number[]>([0, 1, 2]); // Track visible lyric indices
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Buat audio dan mulai play
        const audio = new Audio("/audio/Petunjuk bermain-1.m4a");
        audioRef.current = audio;
        audio.play().catch((e: Error) => {
            console.warn("Audio autoplay diblokir oleh browser:", e);
        });

        return () => {
            // Bersihkan audio saat komponen di-unmount
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Simulasi audio timer untuk karaoke
    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    const newTime = prev + 0.1;
                    // Reset jika sudah selesai (25 detik)
                    if (newTime >= 25) {
                        setIsPlaying(false);
                        setHasStarted(false);
                        return 0;
                    }
                    return newTime;
                });
            }, 100);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isPlaying]);

    // Update current lyric index berdasarkan waktu
    useEffect(() => {
        const activeIndex = sampleLyrics.findIndex(
            (lyric: LyricLine) => currentTime >= lyric.startTime && currentTime <= lyric.endTime
        );
        setCurrentLyricIndex(activeIndex);
    }, [currentTime]);

    // Update visible window berdasarkan current lyric index dengan logika yang lebih stabil
    useEffect(() => {
        // Tentukan last active lyric untuk mengatasi gap timing
        const getLastActiveLyric = () => {
            // Cari lirik terakhir yang sudah selesai
            for (let i = sampleLyrics.length - 1; i >= 0; i--) {
                if (currentTime > sampleLyrics[i].endTime) {
                    return i;
                }
            }
            return -1;
        };

        let targetLyricIndex = currentLyricIndex;

        // Jika currentLyricIndex adalah -1 (gap antar lirik), gunakan last active lyric + 1
        if (currentLyricIndex === -1 && hasStarted) {
            const lastActive = getLastActiveLyric();
            if (lastActive >= 0 && lastActive < sampleLyrics.length - 1) {
                // Cek apakah kita sedang dalam gap menuju lirik selanjutnya
                const nextLyric = sampleLyrics[lastActive + 1];
                if (nextLyric && currentTime < nextLyric.startTime) {
                    targetLyricIndex = lastActive + 1; // Gunakan lirik yang akan datang
                }
            }
        }

        if (targetLyricIndex >= 0) {
            let newWindow: number[];

            if (targetLyricIndex === 0) {
                // Tahap 1: [0, 1, 2] dengan highlight di index 0
                newWindow = [0, 1, 2];
            } else if (targetLyricIndex === 1) {
                // Tahap 2: [0, 1, 2] dengan highlight di index 1
                newWindow = [0, 1, 2];
            } else {
                // Tahap 3+: sliding window dengan highlight di tengah
                // targetLyricIndex = 2 -> [1, 2, 3]
                // targetLyricIndex = 3 -> [2, 3, 4]
                // dst.
                const startIndex = targetLyricIndex - 1;
                const endIndex = Math.min(targetLyricIndex + 1, sampleLyrics.length - 1);
                newWindow = [];
                for (let i = startIndex; i <= endIndex; i++) {
                    if (i < sampleLyrics.length) {
                        newWindow.push(i);
                    }
                }
            }

            // Update window hanya jika berbeda untuk menghindari flickering
            if (JSON.stringify(newWindow) !== JSON.stringify(visibleWindow)) {
                setVisibleWindow(newWindow);
            }
        } else if (!hasStarted) {
            // Jika belum mulai, tampilkan 3 lirik pertama
            if (JSON.stringify([0, 1, 2]) !== JSON.stringify(visibleWindow)) {
                setVisibleWindow([0, 1, 2]);
            }
        }
        // Jika currentLyricIndex === -1 dan sudah started, JANGAN update window (pertahankan yang ada)
    }, [currentLyricIndex, currentTime, hasStarted, visibleWindow]);

    const stopAudio = (): void => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    const handleRestart = (): void => {
        // Stop interval terlebih dahulu
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Reset karaoke
        setCurrentTime(0);
        setCurrentLyricIndex(-1);
        setIsPlaying(false);
        setHasStarted(false);
        setVisibleWindow([0, 1, 2]); // Reset visible window
        stopAudio();
    };

    const handleMenu = (): void => {
        stopAudio();
        handleRestart();
        navigateTo("menu-game");
    };

    const handleStartKaraoke = (): void => {
        setIsPlaying(true);
        setHasStarted(true);
        setCurrentTime(0); // Reset waktu ke 0
        setCurrentLyricIndex(-1); // Reset index lirik
        setVisibleWindow([0, 1, 2]); // Reset visible window
        stopAudio(); // Stop the instruction audio
    };

    // Komponen Lyrics Display dengan sliding logic yang diperbaiki
    const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ isMobile = false }) => {
        return (
            <div className="flex-1 overflow-hidden relative h-full">
                {!hasStarted ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className={`${isMobile ? 'text-base' : 'text-2xl'} font-bold text-amber-800 ${isMobile ? 'mb-2' : 'mb-4'} text-center ${playpen.className}`}>
                            Lagu Pagi Cerah
                        </h2>
                        {!isMobile && (
                            <p className={`text-amber-700 text-center mb-6 ${playpen.className}`}>
                                Siap untuk bernyanyi?
                            </p>
                        )}
                        <button
                            onClick={handleStartKaraoke}
                            className={`bg-green-500 hover:bg-green-600 text-white ${isMobile ? 'px-3 py-2 text-xs' : 'px-6 py-3'} rounded-full font-bold transition-all hover:scale-105 shadow-lg ${playpen.className} cursor-pointer`}
                        >
                            {isMobile ? '▶ Mulai' : '▶ Mulai Bernyanyi'}
                        </button>
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        {/* Progress bar */}
                        <div className={`w-full bg-amber-200 rounded-full ${isMobile ? 'h-1 mb-2' : 'h-2 mb-4'} flex-shrink-0`}>
                            <div
                                className={`bg-green-500 ${isMobile ? 'h-1' : 'h-2'} rounded-full transition-all duration-100`}
                                style={{ width: `${Math.min((currentTime / 25) * 100, 100)}%` }}
                            />
                        </div>

                        {/* Lyrics container dengan sliding display yang stabil */}
                        <div className="flex-1 flex flex-col justify-center items-center relative">
                            <div
                                className="w-full flex flex-col items-center justify-center"
                                style={{
                                    height: isMobile ? '120px' : '180px',
                                    gap: isMobile ? '8px' : '12px'
                                }}
                            >
                                {visibleWindow.map((lyricIndex) => {
                                    const lyric = sampleLyrics[lyricIndex];
                                    if (!lyric) return null;

                                    const isActive = lyricIndex === currentLyricIndex;
                                    const isPast = currentTime > lyric.endTime && lyric.text !== "";

                                    return (
                                        <div
                                            key={lyricIndex} // Gunakan lyricIndex sebagai key yang stabil
                                            className={`text-center transition-all duration-300 ${playpen.className} w-full px-4 ${isActive
                                                    ? `bg-yellow-300 text-amber-900 font-bold ${isMobile ? 'text-base py-3 px-3' : 'text-xl py-4 px-6'} shadow-lg transform scale-110 rounded-lg border-2 border-yellow-500`
                                                    : isPast
                                                        ? `text-amber-500 ${isMobile ? 'text-sm py-2' : 'text-lg py-3'} opacity-70`
                                                        : `text-amber-700 ${isMobile ? 'text-sm py-2' : 'text-lg py-3'} opacity-90`
                                                }`}
                                            style={{
                                                minHeight: isMobile ? '36px' : '48px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                wordWrap: 'break-word',
                                                lineHeight: '1.4',
                                                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                                zIndex: isActive ? 10 : 1
                                            }}
                                        >
                                            {lyric.text || "\u00A0"}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Debugging info */}
                            {process.env.NODE_ENV === 'development' && (
                                <div className="absolute bottom-0 left-0 text-xs text-amber-600 bg-white p-1 rounded">
                                    Active: {currentLyricIndex} | Time: {currentTime.toFixed(1)}s | Window: [{visibleWindow.join(', ')}]
                                    <br />
                                    Last Active: {(() => {
                                        for (let i = sampleLyrics.length - 1; i >= 0; i--) {
                                            if (currentTime > sampleLyrics[i].endTime) return i;
                                        }
                                        return -1;
                                    })()} | Next Expected: {(() => {
                                        const lastActive = (() => {
                                            for (let i = sampleLyrics.length - 1; i >= 0; i--) {
                                                if (currentTime > sampleLyrics[i].endTime) return i;
                                            }
                                            return -1;
                                        })();
                                        return lastActive >= 0 && lastActive < sampleLyrics.length - 1 ? lastActive + 1 : 'none';
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Desktop layout
    return (
        <div className="relative w-full h-screen bg-sky-400 overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 z-0">
                <Image
                    src={BgMenu}
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Home Button - Tombol Kembali */}
            <div className="absolute top-8 right-8 z-10">
                <button
                    className="flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                    onClick={handleMenu}
                    type="button"
                >
                    <Image src={Home} alt="Home" width={65} height={65} />
                </button>
            </div>

            <div className="absolute top-8 left-8 z-10">
                <button
                    className="flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                    onClick={handleRestart}
                    type="button"
                >
                    <Image src={Restart} alt="Restart" width={65} height={65} />
                </button>
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

            {/* Karaoke Board - Desktop */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="bg-amber-100 border-8 border-amber-800 rounded-2xl shadow-2xl p-6 w-96 h-80 flex flex-col">
                    {/* Board header */}
                    <div className="flex justify-center mb-4 flex-shrink-0">
                        <div className="w-4 h-4 bg-amber-600 rounded-full mx-2" />
                        <div className="w-4 h-4 bg-amber-600 rounded-full mx-2" />
                    </div>

                    <LyricsDisplay isMobile={false} />
                </div>
            </div>

            <div className="absolute -bottom-0 left-0 right-0 z-0">
                <Image src={FooterMenu} alt="Footer" width={2000} height={400} />
            </div>
        </div>
    );
}