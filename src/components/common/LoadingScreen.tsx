"use client"

import React from "react";
import BgMenu from "@/assets/icons/BgMenu.webp";
import Image from "next/image";

export default function LoadingScreen() {
    return (
        <div className="flex items-center justify-center w-full h-screen">
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
            <div className="flex flex-col items-center z-50">
                <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
                <p className="mt-4 text-xl font-bold text-white">Loading...</p>
            </div>
        </div>
    );
}