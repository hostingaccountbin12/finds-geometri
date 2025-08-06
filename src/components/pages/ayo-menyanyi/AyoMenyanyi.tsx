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
import { useAudio } from "@/context/AudioContext";

const playpen = Playpen_Sans({ subsets: ["latin"], weight: "700" });

// Sample lyrics data dengan timing (dalam detik)
interface LyricLine {
    text: string;
    startTime: number;
    endTime: number;
}

const sampleLyrics: LyricLine[] = [
    { text: "..........", startTime: 1, endTime: 3.5 },
    { text: "Hai teman-teman lihatlah", startTime: 4, endTime: 8.5 },
    { text: "bentuk-bentuk di sekitar kita", startTime: 9, endTime: 13 },
    { text: "Seperti gunung namanya segitiga ", startTime: 13.5, endTime: 17.5 },
    { text: "Seperti kotak itu persegi", startTime: 18, endTime: 22 },
    { text: "Kotak yang panjang disebut persegi panjang", startTime: 22.5, endTime: 26.5 },
    { text: "Seperti bulan disebut lingkaran", startTime: 26.5, endTime: 31 },
    { text: "..........", startTime: 31.5, endTime: 36 },
    { text: "Hai teman-teman lihatlah", startTime: 36.5, endTime: 40.5 },
    { text: "masih ada bentuk-bentuk lain! ", startTime: 41, endTime: 46 },
    { text: "Berbentuk bintang seperti di langit", startTime: 46, endTime: 50 },
    { text: "Penuh kasih sayang itulah bentuk hati", startTime: 50, endTime: 54.5 },
    { text: "Mirip dengan atap rumah itu trapesium", startTime: 55, endTime: 58.5 },
    { text: "Ada juga oval mirip dengan cermin", startTime: 59, endTime: 64 },
    { text: "..........", startTime: 64.5, endTime: 68 },
    { text: "Itulah bentuk di sekitar kita!", startTime: 68.5, endTime: 72 },
    { text: "Tetaplah ingat bentuk geometri", startTime: 72, endTime: 77 },
    { text: "Segitiga, persegi, lingkaran dan bintang", startTime: 77.5, endTime: 81 },
    { text: "Ada juga persegi panjang", startTime: 81.5, endTime: 86 },
    { text: "Trapesium, Oval", startTime: 86.5, endTime: 88.5 },
    { text: "dan hati", startTime: 89, endTime: 90.5 },
    { text: "Itulah bentuk-bentuk geometri", startTime: 91, endTime: 96 },
    { text: "..........", startTime: 96.5, endTime: 98 },
];

interface LyricsDisplayProps {
    isMobile?: boolean;
}

export default function AyoMenyanyi(): JSX.Element {
    const { navigateTo } = useGameState();
    const { pauseBackgroundMusic, resumeBackgroundMusic } = useAudio()
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Karaoke states
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(-1);
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [visibleWindow, setVisibleWindow] = useState<number[]>([0, 1, 2]); // Track visible lyric indices
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Pause background music ketika masuk ke halaman karaoke
        pauseBackgroundMusic();

        // Resume background music ketika keluar dari halaman
        return () => {
            resumeBackgroundMusic();
        };
    }, [pauseBackgroundMusic, resumeBackgroundMusic]);

    useEffect(() => {
        // Hanya buat audio object tanpa auto play
        const audio = new Audio("/audio/Lagu Bentuk bentuk geometri.mp3");
        audio.preload = "auto"; // Preload audio untuk performa yang lebih baik
        audioRef.current = audio;

        // Event listener untuk mendeteksi akhir audio
        const handleAudioEnded = () => {
            setIsPlaying(false);
            setHasStarted(false);
            setCurrentTime(0);
            setCurrentLyricIndex(-1);
            setVisibleWindow([0, 1, 2]);
        };

        audio.addEventListener('ended', handleAudioEnded);

        return () => {
            // Bersihkan audio saat komponen di-unmount
            if (audioRef.current) {
                audioRef.current.removeEventListener('ended', handleAudioEnded);
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Simulasi audio timer untuk karaoke - hanya berjalan saat isPlaying true
    useEffect(() => {
        if (isPlaying && hasStarted) {
            intervalRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    const newTime = prev + 0.1;
                    // Reset jika sudah selesai (25 detik)
                    if (newTime >= 98) {
                        setIsPlaying(false);
                        setHasStarted(false);
                        // Reset audio
                        if (audioRef.current) {
                            audioRef.current.pause();
                            audioRef.current.currentTime = 0;
                        }
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
    }, [isPlaying, hasStarted]);

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

        // Stop audio
        stopAudio();

        // Reset semua state karaoke
        setCurrentTime(0);
        setCurrentLyricIndex(-1);
        setIsPlaying(false);
        setHasStarted(false);
        setVisibleWindow([0, 1, 2]); // Reset visible window
    };

    const handleMenu = (): void => {
        // Stop audio dan reset semuanya sebelum navigasi
        stopAudio();
        handleRestart();

        // Resume background music sebelum navigasi
        resumeBackgroundMusic();
        navigateTo("menu-game");
    };

    const handleStartKaraoke = (): void => {
        // Reset state terlebih dahulu
        setCurrentTime(0);
        setCurrentLyricIndex(-1);
        setVisibleWindow([0, 1, 2]);

        // Mulai audio
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((e: Error) => {
                console.warn("Audio play gagal:", e);
            });
        }

        // Set state karaoke
        setIsPlaying(true);
        setHasStarted(true);
    };

    // Komponen Lyrics Display dengan sliding logic yang diperbaiki
    const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ isMobile = false }) => {
        return (
            <div className="flex-1 overflow-hidden relative h-full">
                {!hasStarted ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className={`${isMobile ? 'text-base' : 'text-3xl'} font-bold ${isMobile ? 'mb-2' : 'mb-6'} text-center ${playpen.className}`}>
                            Lagu Bentuk Bentuk Geometri
                        </h2>
                        {!isMobile && (
                            <p className={`text-center mb-8 text-lg ${playpen.className}`}>
                                Siap untuk bernyanyi?
                            </p>
                        )}
                        <button
                            onClick={handleStartKaraoke}
                            className={`bg-green-500 hover:bg-green-600 text-white ${isMobile ? 'px-3 py-2 text-xs' : 'px-8 py-4 text-lg'} rounded-full font-bold transition-all hover:scale-105 shadow-lg ${playpen.className} cursor-pointer`}
                        >
                            {isMobile ? '▶ Mulai' : '▶ Mulai Bernyanyi'}
                        </button>
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        {/* Progress bar */}
                        <div className={`w-full bg-amber-200 rounded-full ${isMobile ? 'h-1 mb-2' : 'h-3 mb-6'} flex-shrink-0`}>
                            <div
                                className={`bg-green-500 ${isMobile ? 'h-1' : 'h-3'} rounded-full transition-all duration-100`}
                                style={{ width: `${Math.min((currentTime / 98) * 100, 100)}%` }}
                            />
                        </div>

                        {/* Lyrics container dengan sliding display yang stabil */}
                        <div className="flex-1 flex flex-col justify-center items-center relative">
                            <div
                                className="w-full flex flex-col items-center justify-center"
                                style={{
                                    height: isMobile ? '120px' : '240px',
                                    gap: isMobile ? '8px' : '16px'
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
                                                ? `bg-yellow-300 text-black font-bold ${isMobile ? 'text-base py-3 px-3' : 'text-2xl py-5 px-8'} shadow-lg transform scale-110 rounded-lg border-2 border-yellow-500`
                                                : isPast
                                                    ? `text-gray-500 ${isMobile ? 'text-sm py-2' : 'text-xl py-4'} opacity-70`
                                                    : `text-black ${isMobile ? 'text-sm py-2' : 'text-xl py-4'} opacity-90`
                                                }`}
                                            style={{
                                                minHeight: isMobile ? '36px' : '60px',
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

            {/* Karaoke Board - Desktop - DIPERBESAR */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="bg-amber-100 border-8 border-amber-800 rounded-2xl shadow-2xl p-8 w-[600px] h-[450px] flex flex-col">
                    {/* Board header */}
                    <div className="flex justify-center mb-6 flex-shrink-0">
                        <div className="w-5 h-5 bg-amber-600 rounded-full mx-3" />
                        <div className="w-5 h-5 bg-amber-600 rounded-full mx-3" />
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