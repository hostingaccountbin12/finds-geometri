"use client";

import React from "react";
import Image from "next/image";
import ProfilPicture from "@/assets/icons/ProfilPengembang.jpg"
import { Playpen_Sans } from "next/font/google";
import { useGameState } from "@/context/GameContext";

import BgMenu from "@/assets/icons/BgMenu.webp"
import Pohon from "@/assets/icons/Pohon.png"
import FooterMenu from "@/assets/icons/FooterMenu.png"
import Home from "@/assets/icons/Home.webp";

const playpen = Playpen_Sans({ subsets: ["latin"], weight: "700" });

export default function ProfilPage() {
    const { navigateTo } = useGameState();

    const handleBackToMenu = () => {
        navigateTo('menu');
    };

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
            <div className={`absolute top-8 right-8 z-10`}>
                <button
                    className={`flex items-center justify-center transition-all hover:scale-105`}
                    onClick={handleBackToMenu}
                >
                    <Image src={Home} alt="Home" width={65} />
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


            {/* Title */}
            <div className="bg-yellow-400 py-2 md:py-4 px-8 md:px-16 mb-6 md:mb-16 border-4 border-yellow-500 relative z-10">
                <h1 className={`${playpen.className} text-2xl md:text-4xl text-black`}>Profil Pengembang</h1>
            </div>

            {/* Profile Content - Responsive */}
            <div className="flex flex-col md:flex-row bg-blue-200 rounded-3xl p-4 md:p-10 w-11/12 max-w-5xl relative z-10 shadow-xl overflow-y-auto max-h-[70vh] md:max-h-none">
                {/* Profile Image */}
                <div className="md:w-2/5 w-full flex items-center justify-center mb-4 md:mb-0">
                    {/* For desktop */}
                    <div className="relative md:w-72 md:h-96 w-40 h-52 md:block hidden overflow-hidden border-4 border-teal-500 shadow-lg rounded-t-full rounded-b-lg">
                        <Image
                            alt="Profil Pengembang"
                            src={ProfilPicture}
                            layout="fill"
                            objectFit="cover"
                            objectPosition="top"
                        />
                    </div>

                    {/* For mobile landscape */}
                    <div className="relative md:hidden block w-40 h-40 overflow-hidden border-4 border-teal-500 shadow-lg rounded-full">
                        <Image
                            alt="Profil Pengembang"
                            src={ProfilPicture}
                            layout="fill"
                            objectFit="cover"
                            objectPosition="top"
                        />
                    </div>
                </div>

                {/* Profile Info */}
                <div className="md:w-3/5 w-full px-2 md:px-6 py-2 md:py-4 flex flex-col justify-center">
                    <div className="space-y-2 md:space-y-5 text-black">
                        <p className={`${playpen.className} text-lg md:text-2xl`}>
                            <span className="font-semibold">Nama:</span> Zinira Murdya Nabila
                        </p>
                        <p className={`${playpen.className} text-lg md:text-2xl`}>
                            <span className="font-semibold">Email:</span>
                        </p>
                        <p className={`${playpen.className} text-lg md:text-2xl`}>
                            <span className="font-semibold">Instansi:</span> Universitas Negeri Malang
                        </p>
                        <p className={`${playpen.className} text-lg md:text-2xl`}>
                            <span className="font-semibold">Prodi:</span> PGPAUD
                        </p>
                        <p className={`${playpen.className} text-lg md:text-2xl font-semibold`}>Dosen Pembimbing:</p>
                        <p className={`${playpen.className} text-lg md:text-2xl`}>Dr. Yudithia Dian Putra, M.Pd., M.M</p>
                        <p className={`${playpen.className} text-lg md:text-2xl`}>Dr. Ajeng Putri Pratiwi, S.Pd., M.Pd</p>
                    </div>
                </div>
            </div>

            {/* Add specific style for mobile landscape */}
            <style jsx global>{`
                @media (max-width: 767px) and (orientation: landscape) {
                    .h-screen {
                        height: 100vh;
                        min-height: 450px;
                    }
                    
                    /* Ensure content is scrollable if needed */
                    .max-h-\[70vh\] {
                        max-height: 80vh;
                        overflow-y: auto;
                    }
                }
            `}</style>

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