"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGameState } from "@/context/GameContext";
import { Playpen_Sans, Hammersmith_One } from "next/font/google";
import Image from "next/image";

import BgMenu from "@/assets/icons/BgMenu.webp";
import Pohon from "@/assets/icons/Pohon.png";
import FooterMenu from "@/assets/icons/FooterMenu.png";
import Home from "@/assets/icons/Home.webp";

const playpen = Playpen_Sans({ subsets: ["latin"], weight: "700" });
const hammersmith = Hammersmith_One({ subsets: ["latin"], weight: "400" });

export default function PetunjukBermain1() {
  const { navigateTo } = useGameState();
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Buat audio dan mulai play
    const audio = new Audio("/audio/Petunjuk1-6.m4a");
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

  const handleNext = () => {
    stopAudio();
    navigateTo("petunjuk-bermain-2");
  };

  const handleMenu = () => {
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

        <div className={`absolute top-8 left-8 z-30`}>
          <button
            className={`flex items-center justify-center transition-all hover:scale-105`}
            onClick={handleMenu}
          >
            <Image src={Home} alt="Home" width={isMobileLandscape ? 40 : 65} />
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
              className={`text-xl text-black font-bold text-center ${playpen.className}`}
            >
              Petunjuk Bermain
            </h1>
          </div>

          <div className="absolute -bottom-0 left-0 right-0 z-5">
            <Image src={FooterMenu} alt="Footer" width={2000} />
          </div>
        </div>

        {/* Right side - Instructions with fixed height and scrollable content */}
        <div
          className={` ${hammersmith.className} w-2/3 h-full relative flex items-center justify-center px-4`}
        >
          <div className="bg-white p-4 rounded-lg border-4 border-gray-300 shadow-xl h-4/5 w-full flex flex-col z-20">
            {/* Scrollable content */}
            <div className="overflow-y-auto flex-grow">
              <div className="grid grid-cols-[auto_1fr] gap-y-3 gap-x-2">
                {/* Instructions */}
                <div className="text-lg font-bold">1.</div>
                <div className="text-lg font-bold">
                  {`Klik tombol "Mulai Bermain"`}
                </div>

                <div className="text-lg font-bold">2.</div>
                <div className="text-lg font-bold">
                  Pilih permainan yang ingin dimainkan 
                </div>

                <div className="text-lg font-bold">3.</div>
                <div className="text-lg font-bold">
                  {`Klik “Ayo Menyanyi” untuk memulai lagu dan bernyanyi bersama`}
                </div>

                <div className="text-lg font-bold">4.</div>
                <div className="text-lg font-bold flex items-center">
                  {`Klik “Urutkan Bentuk” untuk bermain mengurutkan bentuk geometri`}
                </div>

                <div className="text-lg font-bold">5.</div>
                <div className="text-lg font-bold flex items-center">
                  {`Klik “Dunia Bentuk” untuk bermain mencocokkan gambar dengan bentuk geometri`}
                </div>
                <div className="text-lg font-bold">6.</div>
                <div className="text-lg font-bold flex items-center">
                  {`Klik "Montir Kecil" untuk bermain mencari bentuk geometri yang hilang`}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
            <button
              onClick={handleNext}
              className="bg-gray-800 text-white px-6 py-2 text-lg rounded-full font-bold hover:bg-gray-700 shadow-md hover:scale-105 active:scale-95 transition-transform animate-pulse"
            >
              Selanjutnya
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

  // Desktop layout (unchanged)
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
      <div className={`absolute top-8 right-8 z-10`}>
        <button
          className={`flex items-center justify-center transition-all hover:scale-105`}
          onClick={handleMenu}
        >
          <Image src={Home} alt="Home" width={isMobileLandscape ? 20 : 65} />
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
            className={`text-4xl text-black font-bold text-center ${playpen.className}`}
          >
            Petunjuk Bermain
          </h1>
        </div>
      </div>

      {/* Instruction Board - Updated with max-height to ensure it doesn't take too much space */}
      <div
        className={`${hammersmith.className} absolute top-40 w-4/5 max-w-4xl z-20`}
        style={{ maxHeight: "60vh" }}
      >
        <div
          className="bg-white p-8 rounded-lg border-8 border-gray-300 shadow-xl overflow-y-auto"
          style={{ maxHeight: "calc(60vh - 32px)" }}
        >
          <div className="grid grid-cols-[auto_1fr] gap-y-6 gap-x-4">
            {/* Instructions */}
            <div className="text-3xl font-bold">1.</div>
            <div className="text-3xl font-bold">
              {`Klik "Mulai Bermain" untuk memulai permainan`}
            </div>

            <div className="text-3xl font-bold">2.</div>
            <div className="text-3xl font-bold">
              Pilih permainan yang ingin dimainkan
            </div>

            <div className="text-3xl font-bold">3.</div>
            <div className="text-3xl font-bold">
              {`Klik “Ayo Menyanyi” untuk memulai lagu dan bernyanyi bersama`}
            </div>

            <div className="text-3xl font-bold">4.</div>
            <div className="text-3xl font-bold">
              {`Klik “Urutkan Bentuk” untuk bermain mengurutkan bentuk geometri`}
            </div>

            <div className="text-3xl font-bold">5.</div>
            <div className="text-3xl font-bold flex items-center">
              {`Klik “Dunia Bentuk” untuk bermain mencocokkan gambar dengan bentuk geometri`}
            </div>

            <div className="text-3xl font-bold">6.</div>
            <div className="text-3xl font-bold flex items-center">
              {`Klik "Montir Kecil" untuk bermain mencari bentuk geometri yang hilang`}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Updated position to be further down */}
      <div className="absolute bottom-12 w-full flex justify-center z-40">
        <button
          onClick={handleNext}
          className="bg-gray-800 text-white px-10 py-4 text-xl rounded-full font-bold hover:bg-gray-700 shadow-md hover:scale-105 active:scale-95 transition-transform animate-pulse"
        >
          Selanjutnya
        </button>
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
