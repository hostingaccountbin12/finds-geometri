"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Playpen_Sans } from "next/font/google";
import { useAudio } from "@/context/AudioContext";
import { useGameState } from "@/context/GameContext";
import { Gamepad, Notebook, UserRound } from "lucide-react";
import Home from "@/assets/icons/Home.webp";

import BgMenu from "@/assets/icons/BgMenu.webp"
import IconRumah from "@/assets/icons/IconRumah.webp"
import DecorCenterLeft from "@/assets/icons/DecorCenterLeft.png"
import DecorLeftBot from "@/assets/icons/DecorLeftBot.png"
import DecorLeftUp from "@/assets/icons/DecorLeftUp.webp"
import DecorRightBot from "@/assets/icons/DecorRightBot.png"
import FooterMenu from "@/assets/icons/FooterMenu.png"
import Pohon from "@/assets/icons/Pohon.png"
import Star from "@/assets/icons/Star.png"

const playpen = Playpen_Sans({ subsets: ["latin"], weight: "700" });

export default function MenuPage() {
    const { setComponentVolume } = useAudio();
    const { navigateTo } = useGameState();
    const [isMobileLandscape, setIsMobileLandscape] = useState(false);

    // Function to check if device is in mobile landscape mode
    const checkMobileLandscape = () => {
        // Lebih sensitif mendeteksi mode landscape pada mobile
        const isMobile = window.innerWidth <= 1024;
        const isLandscape = window.innerWidth > window.innerHeight;
        setIsMobileLandscape(isMobile && isLandscape);
    };

    // Add event listener for window resize
    useEffect(() => {
        checkMobileLandscape();
        window.addEventListener('resize', checkMobileLandscape);
        return () => window.removeEventListener('resize', checkMobileLandscape);
    }, []);

    useEffect(() => {
        setComponentVolume(0.7);
    }, [setComponentVolume]);

    const handleRegisterClick = () => {
        navigateTo('menu-game');
    };

    const handleToPetunjuk = () => {
        navigateTo('petunjuk-bermain-1')
    }

    const handleProfil = () => {
        navigateTo('profil')
    }

    const handleHome = () => {
        navigateTo("home")
    }

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

            {/* Decorations using imported assets */}
            {/* Left Up Decoration */}
            <div className="absolute top-8 left-16 z-10">
                <Image
                    src={DecorLeftUp}
                    alt="Left Up Decoration"
                    width={isMobileLandscape ? 80 : 100}
                    height={isMobileLandscape ? 80 : 100}
                    className="animate-floating"
                />
            </div>

            {/* Center Up Decoration */}
            <div className="absolute top-8 left-1/2 z-10">
                <Image
                    src={Star}
                    alt="Left Up Decoration"
                    width={isMobileLandscape ? 80 : 100}
                    height={isMobileLandscape ? 80 : 100}
                    className="animate-floating"
                />
            </div>

            {/* Center Right Decoration */}
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-0">
                <Image
                    src={Pohon}
                    alt="Center Right Decoration"
                    width={isMobileLandscape ? 120 : 250}
                    height={isMobileLandscape ? 120 : 250}
                />
            </div>

            {/* Center Left Decoration */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
                <Image
                    src={Pohon}
                    alt="Center Right Decoration"
                    width={isMobileLandscape ? 120 : 250}
                    height={isMobileLandscape ? 120 : 250}
                />
            </div>

            <div className="absolute top-64 left-32 transform -translate-y-1/2 z-0">
                <Image
                    src={DecorCenterLeft}
                    alt="Center Right Decoration"
                    width={isMobileLandscape ? 120 : 150}
                    height={isMobileLandscape ? 120 : 150}
                />
            </div>

            {/* Right Bottom Decoration */}
            <div className="absolute bottom-0 right-0 z-10">
                <Image
                    src={DecorRightBot}
                    alt="Right Bottom Decoration"
                    width={isMobileLandscape ? 60 : 120}
                    height={isMobileLandscape ? 60 : 120}
                />
            </div>

            {/* Left Bottom Decoration */}
            <div className="absolute bottom-0 left-0 z-50">
                <Image
                    src={DecorLeftBot}
                    alt="Right Bottom Decoration"
                    width={isMobileLandscape ? 60 : 120}
                    height={isMobileLandscape ? 60 : 120}
                />
            </div>

            {/* Home Button - Tombol Kembali */}

            {/* Home Button */}
            <div className="absolute top-8 right-8 z-50">
                <button
                    className="flex items-center justify-center transition-all hover:scale-105"
                    onClick={handleHome}
                >
                    <Image src={Home} alt="Home" width={65} />
                </button>
            </div>

            {/* Bank Icon */}
            <div className={`absolute z-20 ${isMobileLandscape ? 'top-0 right-[-20px] scale-[0.45]' : 'top-0/3 right-[-20px]'} animate-floating`}>
                <Image
                    src={IconRumah}
                    alt="Rumah"
                    width={isMobileLandscape ? 350 : 550}
                    height={isMobileLandscape ? 350 : 550}
                />
            </div>


            {/* Menu Buttons */}
            <div className={`absolute z-40 ${playpen.className} ${isMobileLandscape
                ? 'top-1/3 left-1/4'
                : 'top-1/3 left-64 -translate-x-10 mt-8'
                } flex flex-col ${isMobileLandscape ? 'gap-3' : 'gap-5'} animate-floating`}>

                <button
                    className={`bg-yellow-200 ${isMobileLandscape
                        ? 'text-base font-bold py-1 px-4 whitespace-nowrap w-auto'
                        : 'text-2xl font-bold py-4  w-[400px]'
                        } rounded-full shadow-lg border-2 border-green-100 hover:bg-yellow-400 transition-all hover:scale-105 tracking-wider flex items-center`}
                    onClick={handleRegisterClick}
                >
                    <span className={`${isMobileLandscape ? 'mr-2 ml-1 text-xl' : 'ml-4 mr-4 text-4xl'}`}><Gamepad /></span>
                    Mulai Bermain
                </button>

                <button
                    className={`bg-orange-300 ${isMobileLandscape
                        ? 'text-base font-bold py-1 px-4 whitespace-nowrap w-auto'
                        : 'text-2xl font-bold py-4  w-[400px]'
                        } rounded-full shadow-lg border-2 border-purple-100 hover:bg-orange-500 transition-all hover:scale-105 tracking-wider flex items-center`}
                    onClick={handleToPetunjuk}
                >
                    <span className={`${isMobileLandscape ? 'mr-2 ml-1 text-xl' : 'ml-4 mr-4 text-4xl'}`}><Notebook /></span>
                    Petunjuk Bermain
                </button>

                <button
                    className={`bg-red-300 ${isMobileLandscape
                        ? 'text-base font-bold py-1 px-4 whitespace-nowrap w-auto'
                        : 'text-2xl font-bold py-4  w-[400px]'
                        } rounded-full shadow-lg border-2 border-red-100 hover:bg-red-500 transition-all hover:scale-105 tracking-wider flex items-center`}
                    onClick={handleProfil}
                >
                    <span className={`${isMobileLandscape ? 'mr-2 ml-1 text-xl' : 'ml-4 mr-4 text-4xl'}`}><UserRound /></span>
                    Profil Pengembang
                </button>
            </div>

            <div className="absolute -bottom-0 left-0 right-0 z-5">
                <Image
                    src={FooterMenu}
                    alt="Footer"
                    width={2000}
                />
            </div>

        </div>
    );
};