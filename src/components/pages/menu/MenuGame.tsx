/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Image from "next/image";
import { useGameState } from "@/context/GameContext";

import BgMenu from "@/assets/icons/BgMenu.webp";
import Pohon from "@/assets/icons/Pohon.png";
import FooterMenu from "@/assets/icons/FooterMenu.png";
import Home from "@/assets/icons/Home.webp";

import JelajahBentuk from "@/assets/icons/JelajahBentuk.gif"
import AyoMenyanyi from "@/assets/icons/AyoMenyanyi.gif"
import MiniGames from "@/assets/icons/MiniGames.gif"
import MontirKecil from "@/assets/icons/MontirKecil.gif"
import MariBerkreasi from "@/assets/icons/MariBerkreasi.gif"
import DuniaBentuk from "@/assets/icons/DuniaBentuk.gif"

// Certificate/Trophy Icon Component
const CertificateIcon = () => (
  <div className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold text-xs px-2 py-1 rounded-full border-2 border-yellow-700 shadow-lg z-20 animate-pulse">
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="drop-shadow-sm"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  </div>
);

export default function MenuGame() {
  const { state, navigateTo } = useGameState();

  const handleBackToMenu = () => {
    navigateTo("menu");
  };

  const handleMenuClick = (menuType: any) => {
    switch (menuType) {
      case 'ayo-menyanyi':
        navigateTo('ayo-menyanyi');
        break;
      case 'jelajah-bentuk':
        const jelajahBentukLevel = state.levelJelajahBentuk;
        if (jelajahBentukLevel === 1) {
          navigateTo('jelajah-bentuk-1');
        } else if (jelajahBentukLevel === 2) {
          navigateTo('jelajah-bentuk-2');
        } else if (jelajahBentukLevel >= 3) {
          navigateTo('jelajah-bentuk-3');
        }
        break;
      case 'dunia-bentuk':
        const duniaBentukLevel = state.levelDuniaBentuk;
        if (duniaBentukLevel === 1) {
          navigateTo('dunia-bentuk-1');
        } else if (duniaBentukLevel === 2) {
          navigateTo('dunia-bentuk-2');
        } else if (duniaBentukLevel === 3) {
          navigateTo('dunia-bentuk-3');
        } else if (duniaBentukLevel === 4) {
          navigateTo('dunia-bentuk-4')
        } else if (duniaBentukLevel >= 5) {
          navigateTo('dunia-bentuk-5')
        }
        break;
      case 'montir-kecil':
        const montirKecilLevel = state.levelMontirKecil;
        if (montirKecilLevel === 1) {
          navigateTo('montir-kecil-1');
        } else if (montirKecilLevel === 2) {
          navigateTo('montir-kecil-2');
        } else if (montirKecilLevel === 3) {
          navigateTo('montir-kecil-3');
        } else if (montirKecilLevel === 4) {
          navigateTo('montir-kecil-4')
        } else if (montirKecilLevel >= 5) {
          navigateTo('montir-kecil-5')
        }
        break;
      case 'mari-berkreasi':
        navigateTo('mari-berkreasi');
        break;
      case 'mini-games':
        const miniGamesLevel = state.levelMiniGames;
        if (miniGamesLevel === 1) {
          navigateTo('mini-games-1');
        } else if (miniGamesLevel === 2) {
          navigateTo('mini-games-2');
        } else if (miniGamesLevel >= 3) {
          navigateTo('mini-games-3');
        }
        break;
      default:
        console.log('Menu not implemented yet');
    }
  };

  // Menu items data with level indicators and completion status
  const menuItems = [
    {
      id: 'ayo-menyanyi',
      icon: AyoMenyanyi,
      width: 270,
      level: null,
      isCompleted: state.isAyoMenyanyiFinished
    },
    {
      id: 'jelajah-bentuk',
      icon: JelajahBentuk,
      width: 270,
      level: state.levelJelajahBentuk,
      isCompleted: state.isJelajahBentukFinished
    },
    {
      id: 'dunia-bentuk',
      icon: DuniaBentuk,
      width: 270,
      level: state.levelDuniaBentuk,
      isCompleted: state.isDuniaBentukFinished
    },
    {
      id: 'montir-kecil',
      icon: MontirKecil,
      width: 210,
      level: state.levelMontirKecil,
      isCompleted: state.isMontirKecilFinished
    },
    {
      id: 'mari-berkreasi',
      icon: MariBerkreasi,
      width: 210,
      level: null,
      isCompleted: state.isMariBekreasFinished
    },
    {
      id: 'mini-games',
      icon: MiniGames,
      width: 280,
      level: state.levelMiniGames,
      isCompleted: state.isMiniGamesFinished
    }
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
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

      {/* Home Button */}
      <div className="absolute top-8 right-8 z-50">
        <button
          className="flex items-center justify-center transition-all hover:scale-105"
          onClick={handleBackToMenu}
        >
          <Image src={Home} alt="Home" width={65} />
        </button>
      </div>

      {/* Center Right Decoration */}
      <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 z-0 animate-pulse">
        <Image
          src={Pohon}
          alt="Center Right Decoration"
          width={250}
          height={250}
        />
      </div>

      {/* Center Left Decoration */}
      <div className="absolute top-1/2 -left-12 transform -translate-y-1/2 z-0 animate-pulse">
        <Image
          src={Pohon}
          alt="Center Left Decoration"
          width={250}
          height={250}
        />
      </div>

      {/* Ground */}
      <div className="absolute -bottom-0 left-0 right-0 z-0">
        <Image src={FooterMenu} alt="Footer" width={2000} />
      </div>

      {/* Menu Items Container */}
      <div className="flex-1 flex items-center justify-center px-8 py-16 z-10">
        <div className="grid grid-cols-3 gap-8 max-w-6xl">
          {menuItems.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => handleMenuClick(item.id)}
                className={`transform transition-all duration-200 hover:scale-110 hover:shadow-2xl active:scale-95 relative ${item.isCompleted ? 'filter brightness-110' : ''
                  }`}
              >
                <Image
                  src={item.icon}
                  alt={item.id}
                  width={item.width}
                  className="h-auto object-contain"
                />

                {/* Completion Glow Effect */}
                {item.isCompleted && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 animate-pulse"></div>
                )}
              </button>

              {/* Level Indicator */}
              {item.level && (
                <div className="absolute -top-2 -left-2 bg-blue-500 text-white font-bold text-sm px-2 py-1 rounded-full border-2 border-blue-700 shadow-lg z-20">
                  Lv {item.level}
                </div>
              )}

              {/* Completion Certificate/Trophy */}
              {item.isCompleted && <CertificateIcon />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}