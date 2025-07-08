"use client"

import { useGameState } from "@/context/GameContext";
import Homepage from "../home/Homepage";
import MenuPage from "../menu/Menupage";
import PetunjukBermain1 from "../petunjuk/PetunjukBermain1";
import PetunjukBermain2 from "../petunjuk/PetunjukBermain2";
import ProfilPage from "../profil/ProfilPage";
import MenuGame from "../menu/MenuGame";
import AyoMenyanyi from "../ayo-menyanyi/AyoMenyanyi";
import MontirKecil1 from "../montir-kecil/MontirKecil1";
import DuniaBentuk1 from "../dunia-bentuk/DuniaBentuk1";
import DuniaBentuk2 from "../dunia-bentuk/DuniaBentuk2";
import MariBerkreasi from "../mari-berkreasi/MariBerkreasi";
import MiniGames1 from "../mini-games/MiniGames1";
import JelajahBentuk1 from "../jelajah-bentuk/JelajahBentuk1";
import DuniaBentuk3 from "../dunia-bentuk/DuniaBentuk3";
import DuniaBentuk4 from "../dunia-bentuk/DuniaBentuk4";
import DuniaBentuk5 from "../dunia-bentuk/DuniaBentuk5";
import MontirKecil2 from "../montir-kecil/MontirKecil2";
import MontirKecil3 from "../montir-kecil/MontirKecil3";
import MontirKecil4 from "../montir-kecil/MontirKecil4";
import MontirKecil5 from "../montir-kecil/MontirKecil5";
import MiniGames2 from "../mini-games/MiniGames2";
// Import other game screens as needed

export default function BankKidsApp() {
    const { state } = useGameState();

    // Render screen based on game state
    switch (state.screen) {
        case 'home':
            return <Homepage />;
        case 'menu':
            return <MenuPage />;
        case 'menu-game':
            return <MenuGame />;
        case 'ayo-menyanyi':
            return <AyoMenyanyi />;
        case 'dunia-bentuk-1':
            return <DuniaBentuk1 />;
        case 'dunia-bentuk-2':
            return <DuniaBentuk2 />;
        case 'dunia-bentuk-3':
            return <DuniaBentuk3 />;
        case 'dunia-bentuk-4':
            return <DuniaBentuk4 />;
        case 'dunia-bentuk-5':
            return <DuniaBentuk5 />;
        case 'montir-kecil-1':
            return <MontirKecil1 />;
        case 'montir-kecil-2':
            return <MontirKecil2 />;
        case 'montir-kecil-3':
            return <MontirKecil3 />;
        case 'montir-kecil-4':
            return <MontirKecil4 />;
        case 'montir-kecil-5':
            return <MontirKecil5 />;
        case 'mari-berkreasi':
            return <MariBerkreasi />;
        case 'mini-games-1':
            return <MiniGames1 />;
        case 'mini-games-2':
            return <MiniGames2 />;
        case 'jelajah-bentuk-1':
            return <JelajahBentuk1 />;
        case 'petunjuk-bermain-1':
            return <PetunjukBermain1 />
        case 'petunjuk-bermain-2':
            return <PetunjukBermain2 />
        case 'profil':
            return <ProfilPage />
        // Add other game screens as needed
        // case 'game-screen-1':
        //     return <GameScreen1 />;
        // case 'game-screen-2':
        //     return <GameScreen2 />;
        default:
            return <Homepage />;
    }
}