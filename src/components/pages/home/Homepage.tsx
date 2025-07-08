import React, { useEffect, useState } from "react";
import { Atma } from "next/font/google";
import Image from "next/image";
import DecorLeftUp from "@/assets/icons/DecorLeftUp.webp"
import DecorCenterRight from "@/assets/icons/DecorCenterRight.webp"
import DecorRightUp from "@/assets/icons/DecorRightUp.png"
import DecorRightBot from "@/assets/icons/DecorRightBot.png"
import BgHome from "@/assets/icons/BgHome.webp"
import FooterGrass from "@/assets/icons/FooterGrass.webp"
import FooterDecor from "@/assets/icons/FooterDecor.gif"

import { useAudio } from "@/context/AudioContext";
import { useGameState } from "@/context/GameContext";

const atma = Atma({ subsets: ["latin"], weight: "700" });

export default function Homepage() {
    const { audioPlaying, toggleAudio, setComponentVolume } = useAudio();
    const { navigateTo } = useGameState();
    const [isMobileLandscape, setIsMobileLandscape] = useState(false);

    // Function to check if device is in mobile landscape mode
    const checkMobileLandscape = () => {
        const isMobile = window.innerWidth <= 804;
        const isLandscape = window.innerWidth > window.innerHeight;
        setIsMobileLandscape(isMobile && isLandscape);
    };

    useEffect(() => {
        setComponentVolume(0.7);
    }, [setComponentVolume]);

    // Add event listener for window resize
    useEffect(() => {
        checkMobileLandscape();
        window.addEventListener('resize', checkMobileLandscape);
        return () => window.removeEventListener('resize', checkMobileLandscape);
    }, []);

    const handleStartClick = () => {
        navigateTo('menu');
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={BgHome}
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Music Control Button */}
            <div className={`absolute ${isMobileLandscape ? 'top-2 right-2' : 'top-8 right-8'} z-20`}>
                <button
                    onClick={toggleAudio}
                    className={`bg-white rounded-full ${isMobileLandscape ? 'p-3' : 'p-5'} shadow-md flex items-center justify-center hover:scale-110 transition-transform`}
                >
                    <div className={`text-sky-800 ${isMobileLandscape ? 'text-xl' : 'text-2xl'}`}>
                        {audioPlaying ? '🔊' : '🔇'}
                    </div>
                </button>
            </div>

            {/* Decorations using imported assets */}
            {/* Left Up Decoration */}
            <div className="absolute top-8 left-8 z-10">
                <Image
                    src={DecorLeftUp}
                    alt="Left Up Decoration"
                    width={isMobileLandscape ? 80 : 120}
                    height={isMobileLandscape ? 80 : 120}
                    className="animate-floating"
                />
            </div>

            {/* Right Up Decoration */}
            <div className="absolute top-12 right-32 z-10">
                <Image
                    src={DecorRightUp}
                    alt="Right Up Decoration"
                    width={isMobileLandscape ? 60 : 130}
                    height={isMobileLandscape ? 60 : 130}
                    className="animate-bounce"
                />
            </div>

            {/* Main Title */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-50">
                <div className="text-center">
                    <h1 className="text-8xl font-bernoru text-yellow-400 stroke-black stroke-2 mb-2 animate-pulse">
                        FIGE
                    </h1>
                    <h2 className={`text-7xl ${atma.className} font-bold text-[#cf6f5f] stroke-white stroke-1`}>
                        Find Geometri
                    </h2>
                </div>
            </div>

            {/* Start Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-8 z-50">
                <button
                    className="bg-orange-400 hover:bg-orange-500 text-white text-3xl font-bold py-4 px-12 rounded-full shadow-lg border-4 border-white hover:scale-110 transition-all duration-300 animate-bounce"
                    onClick={handleStartClick}
                >
                    START
                </button>
            </div>

            {/* Center Right Decoration */}
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-10">
                <Image
                    src={DecorCenterRight}
                    alt="Center Right Decoration"
                    width={isMobileLandscape ? 120 : 300}
                    height={isMobileLandscape ? 120 : 300}
                />
            </div>

            {/* Right Bottom Decoration */}
            <div className="absolute bottom-8 right-0 z-10 -rotate-45">
                <Image
                    src={DecorRightBot}
                    alt="Right Bottom Decoration"
                    width={isMobileLandscape ? 60 : 120}
                    height={isMobileLandscape ? 60 : 120}
                />
            </div>

            {/* Footer */}
            <div className="absolute -bottom-80 left-0 right-0 z-5">
                <Image
                    src={FooterGrass}
                    alt="Footer"
                    width={2000}
                />
            </div>
            <div className="absolute bottom-0 -left-44 right-0 z-5">
                <Image
                    src={FooterDecor}
                    alt="Footer"
                    width={800}
                />
            </div>

            {/* Mobile landscape instruction */}
            {isMobileLandscape && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 text-sky-800 py-1 px-3 rounded-full text-xs z-20">
                    For best experience, rotate your device
                </div>
            )}
        </div>
    );
}