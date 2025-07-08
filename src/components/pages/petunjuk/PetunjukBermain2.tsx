"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useGameState } from "@/context/GameContext";
import { DynaPuff } from "next/font/google";
import Image from "next/image";
import Home from "@/assets/icons/Home.webp";
import Restart from "@/assets/icons/Restart.webp"
import BackNext from "@/assets/icons/BackNext.gif"
import Start from "@/assets/icons/Start.webp"

import BgMenu from "@/assets/icons/BgMenu.webp";
import Pohon from "@/assets/icons/Pohon.png";
import FooterMenu from "@/assets/icons/FooterMenu.png";

const dynaPuff = DynaPuff({ subsets: ["latin"], weight: "700" });

export default function PetunjukBermain2() {
  const { navigateTo, state } = useGameState();
  const { playerName } = state;
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Buat audio dan mulai play
    const audio = new Audio("/audio/Ketujuh.m4a");
    audioRef.current = audio;
    audio.play().catch((e) => {
      console.warn("Audio autoplay diblokir oleh browser:", e);
    });

    return () => {
      // Bersihkan audio saat komponen di-unmount
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Check if we're in mobile landscape mode
  useEffect(() => {
    const checkOrientation = () => {
      // Consider mobile landscape when width > height and width < 1024px (typical tablet/desktop breakpoint)
      const isLandscape = window.innerWidth > window.innerHeight;
      const isMobile = window.innerWidth < 1024;
      setIsMobileLandscape(isLandscape && isMobile);
    };

    // Initial check
    checkOrientation();

    // Check on resize and orientation change
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleBackPetunjuk1 = () => {
    stopAudio();
    navigateTo("petunjuk-bermain-1");
  };

  const handlePlayGame = () => {
    stopAudio();
    if (!playerName || playerName.trim() === "") {
      navigateTo("register");
    } else {
      navigateTo("game");
    }
  };

  const handleBackToMenu = () => {
    stopAudio();
    navigateTo("menu");
  };

  // Mobile landscape layout
  if (isMobileLandscape) {
    return (
      <div className="relative w-full h-screen overflow-hidden flex flex-row">
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


        <div className={`absolute top-2 left-14 z-30`}>
          <button
            className={`flex items-center justify-center transition-all hover:scale-105`}
            onClick={handleBackToMenu}
          >
            <Image src={Home} alt="Home" width={isMobileLandscape ? 30 : 65} />
          </button>
        </div>

        <div className="absolute top-2 left-2 z-10">
          <button
            className="bg-[#4caf50] rounded-full p-2 shadow-md flex items-center justify-center hover:bg-[#388e3c] hover:scale-110 active:scale-95 transition-transform"
            onClick={handleBackPetunjuk1}
          >
            <ArrowLeft size={16} className="text-white" />
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
            alt="Center Right Decoration"
            width={250}
            height={250}
          />
        </div>

        {/* Left side - Title and decorations */}
        <div className="w-1/3 h-full relative flex flex-col items-center justify-center">
          <div className="bg-yellow-300 py-2 px-4 rounded-xl shadow-lg transform border-4 border-yellow-400 animate-bounce">
            <h1
              className={`text-xl text-black font-bold text-center ${dynaPuff.className}`}
            >
              Petunjuk Bermain
            </h1>
          </div>
        </div>

        {/* Right side - Instructions and buttons */}
        <div className="w-2/3 h-full relative flex flex-col items-center justify-center px-4 py-8 z-20">
          {/* Instructions */}
          <div className="bg-white p-4 rounded-lg border-4 border-gray-300 shadow-xl w-full overflow-y-auto mb-4">
            <div className="grid grid-cols-[auto_1fr] gap-y-3 gap-x-2">
              <div className="text-lg font-bold">7.</div>
              <div className="text-lg font-bold flex items-center flex-wrap gap-1">
                Klik
                <Image
                  alt="Restart"
                  src={Restart}
                  width={24}
                  height={24}
                  className="inline-block"
                />
                untuk memulai ulang Permainan
              </div>
              <div className="text-lg font-bold">8.</div>
              <div className="text-lg font-bold flex items-center flex-wrap gap-1">
                Klik
                <Image
                  alt="Back Next"
                  src={BackNext}
                  width={24}
                  height={24}
                  className="inline-block"
                />
                untuk mengubah bentuk geometri
              </div>

              <div className="text-lg font-bold">9.</div>
              <div className="text-lg font-bold flex items-center flex-wrap gap-1">
                Klik
                <Image
                  alt="Start"
                  src={Start}
                  width={24}
                  height={24}
                  className="inline-block"
                />
                untuk melanjutkan permainan
              </div>

              <div className="text-lg font-bold">10.</div>
              <div className="text-lg font-bold flex items-center flex-wrap gap-1">
                Klik
                <Image
                  alt="Home"
                  src={Home}
                  width={24}
                  height={24}
                  className="inline-block"
                />
                untuk kembali ke menu utama
              </div>

            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-2 w-full">
            <button
              onClick={handleBackToMenu}
              className="bg-gray-800 text-white px-4 py-2 text-sm rounded-full font-bold hover:bg-gray-700 shadow-md hover:scale-105 active:scale-95 transition-transform animate-pulse"
            >
              Kembali Ke Menu
            </button>
            <button
              onClick={handlePlayGame}
              className="bg-gray-800 text-white px-4 py-2 text-sm rounded-full font-bold hover:bg-gray-700 shadow-md hover:scale-105 active:scale-95 transition-transform animate-pulse"
            >
              Mulai Bermain
            </button>
          </div>
        </div>

        {/* Floating particles */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-white opacity-50 animate-float"
            style={{
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          />
        ))}

        <div className="absolute -bottom-0 left-0 right-0 z-0">
          <Image src={FooterMenu} alt="Footer" width={2000} />
        </div>
      </div>
    );
  }

  // Desktop layout (updated)
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

      {/* Home Button - Tombol Kembali */}
      <div
        className={`absolute ${isMobileLandscape ? "top-2 right-2" : "top-8 right-8"
          } z-10`}
      >
        <button
          className={`flex items-center justify-center transition-all hover:scale-105`}
          onClick={handleBackToMenu}
        >
          <Image src={Home} alt="Home" width={isMobileLandscape ? 20 : 65} />
        </button>
      </div>

      {/* Back Button dengan animasi hover */}
      <div className="absolute top-8 left-8 z-10">
        <button
          className="bg-[#4caf50] rounded-full p-4 shadow-md flex items-center justify-center hover:bg-[#388e3c] hover:scale-110 active:scale-95 transition-transform"
          onClick={handleBackPetunjuk1}
        >
          <ArrowLeft size={24} className="text-white" />
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
          alt="Center Right Decoration"
          width={250}
          height={250}
        />
      </div>

      {/* Title Bar dengan animasi bounce */}
      <div className="absolute top-20 w-2/3 max-w-3xl animate-bounce">
        <div className="bg-yellow-300 py-4 px-8 rounded-xl shadow-lg transform border-4 border-yellow-400">
          <h1
            className={`text-4xl text-black font-bold text-center ${dynaPuff.className}`}
          >
            Petunjuk Bermain
          </h1>
        </div>
      </div>
      {/* Instruction Board - Updated with max-height to ensure it doesn't take too much space */}
      <div
        className="absolute top-40 w-4/5 max-w-4xl"
        style={{ maxHeight: "60vh" }}
      >
        <div
          className="bg-white p-8 rounded-lg border-8 border-gray-300 shadow-xl overflow-y-auto"
          style={{ maxHeight: "calc(60vh - 32px)" }}
        >
          <div className="grid grid-cols-[auto_1fr] gap-y-6 gap-x-4">
            <div className="text-3xl font-bold">7.</div>
            <div className="text-3xl font-bold flex items-center flex-wrap gap-2">
              Klik
              <Image
                alt="Restart"
                src={Restart}
                width={32}
                height={32}
                className="inline-block"
              />
              untuk memulai ulang Permainan
            </div>
            <div className="text-3xl font-bold">8.</div>
            <div className="text-3xl font-bold flex items-center flex-wrap gap-2">
              Klik
              <Image
                alt="Back Next"
                src={BackNext}
                width={55}
                height={55}
                className="inline-block"
              />
              untuk mengubah bentuk geometri
            </div>
            <div className="text-3xl font-bold">9.</div>
            <div className="text-3xl font-bold flex items-center flex-wrap gap-2">
              Klik
              <Image
                alt="Start"
                src={Start}
                width={32}
                height={32}
                className="inline-block"
              />
              untuk melanjutkan permainan
            </div>
            <div className="text-3xl font-bold">10.</div>
            <div className="text-3xl font-bold flex items-center flex-wrap gap-2">
              Klik
              <Image
                alt="Home Shop"
                src={Home}
                width={32}
                height={32}
                className="inline-block"
              />
              untuk kembali ke menu utama
            </div>
          </div>
        </div>
      </div>
      {/* Navigation - Updated position to be further down */}
      <div className="absolute bottom-12 w-full flex justify-center z-20">
        <div className="flex gap-4">
          <button
            onClick={handleBackToMenu}
            className="bg-gray-800 text-white px-10 py-4 text-xl rounded-full font-bold hover:bg-gray-700 shadow-md hover:scale-105 active:scale-95 transition-transform animate-pulse"
          >
            Kembali Ke Menu
          </button>
          <button
            onClick={handlePlayGame}
            className="bg-gray-800 text-white px-10 py-4 text-xl rounded-full font-bold hover:bg-gray-700 shadow-md hover:scale-105 active:scale-95 transition-transform animate-pulse"
          >
            Mulai Bermain
          </button>
        </div>
      </div>
      {/* Tambahan animasi partikel */}
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-white opacity-50 animate-float"
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 5}s`,
          }}
        />
      ))}

      <div className="absolute -bottom-0 left-0 right-0 z-0">
        <Image src={FooterMenu} alt="Footer" width={2000} />
      </div>
    </div>
  );
}
