/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, DragEvent } from "react";
import { Check, X } from "lucide-react";
import Home from "@/assets/icons/Home.webp";
import Image from "next/image";

//Tempat
import BoxBulat from "@/assets/icons/dunia-bentuk/BoxBulat.png"
import BoxLonjong from "@/assets/icons/dunia-bentuk/BoxLonjong.png"
import BoxPersegi from "@/assets/icons/dunia-bentuk/BoxPersegi.gif"
import BoxStar from "@/assets/icons/dunia-bentuk/BoxStar.png"

//Bentuk
import Bintang from "@/assets/icons/dunia-bentuk/Bintang.png"
import Cermin from "@/assets/icons/dunia-bentuk/Cermin.webp"
import Jam from "@/assets/icons/dunia-bentuk/Jam.webp"
import Sofa from "@/assets/icons/dunia-bentuk/Sofa.png"
import { useGameState } from "@/context/GameContext";

// Type definitions
interface GameItem {
  id: number;
  name: string;
  shape: string;
  image: any; // Changed to any to accommodate imported images
  bgColor: string;
}

interface ShapeSlot {
  id: number;
  shape: string;
  image: any; // Added image property for slot shapes
  bgColor: string;
}

interface DroppedItems {
  [key: number]: GameItem;
}

interface Feedback {
  [key: number]: boolean;
}

// Data untuk game - menggunakan gambar yang sudah diimport
const gameData: GameItem[] = [
  {
    id: 1,
    name: "sofa",
    shape: "rectangle",
    image: Sofa,
    bgColor: "bg-blue-400"
  },
  {
    id: 2,
    name: "star",
    shape: "star",
    image: Bintang,
    bgColor: "bg-yellow-400"
  },
  {
    id: 3,
    name: "mirror",
    shape: "oval",
    image: Cermin,
    bgColor: "bg-cyan-200"
  },
  {
    id: 4,
    name: "clock",
    shape: "circle",
    image: Jam,
    bgColor: "bg-white"
  }
];

const shapeSlots: ShapeSlot[] = [
  { id: 1, shape: "oval", image: BoxLonjong, bgColor: "bg-blue-500" },
  { id: 2, shape: "star", image: BoxStar, bgColor: "bg-blue-500" },
  { id: 3, shape: "rectangle", image: BoxPersegi, bgColor: "bg-blue-500" },
  { id: 4, shape: "circle", image: BoxBulat, bgColor: "bg-blue-500" }
];

export default function DuniaBentuk1(): JSX.Element {
  const [draggedItem, setDraggedItem] = useState<GameItem | null>(null);
  const [droppedItems, setDroppedItems] = useState<DroppedItems>({});
  const [feedback, setFeedback] = useState<Feedback>({});
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Mobile state
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const { navigateTo, updateLevelDuniaBentuk, state, setPlayingInstructionDuniaBentuk } = useGameState();
  const { isPlayingInstructionDuniaBentuk } = state

  // Audio ref untuk kontrol audio
  const audioRef = useRef<HTMLAudioElement>(null);

  // Function to check if device is mobile
  const checkDevice = (): void => {
    const isMobileDevice = window.innerWidth <= 1024;
    setIsMobile(isMobileDevice);
  };

  // Desktop drag handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: GameItem): void => {
    if (isMobile) return; // Disable drag on mobile
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    if (isMobile) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, slot: ShapeSlot): void => {
    if (isMobile) return;
    e.preventDefault();

    if (!draggedItem) return;

    const isCorrect = draggedItem.shape === slot.shape;

    // Update dropped items
    const newDroppedItems: DroppedItems = { ...droppedItems };

    // Remove item from previous slot if it exists
    Object.keys(newDroppedItems).forEach(key => {
      const numKey = Number(key);
      if (newDroppedItems[numKey]?.id === draggedItem.id) {
        delete newDroppedItems[numKey];
      }
    });

    newDroppedItems[slot.id] = draggedItem;
    setDroppedItems(newDroppedItems);

    // Update feedback
    const newFeedback: Feedback = { ...feedback };
    newFeedback[slot.id] = isCorrect;
    setFeedback(newFeedback);

    // Update completed count
    const correctCount = Object.values(newFeedback).filter(Boolean).length;
    setCompletedCount(correctCount);

    setDraggedItem(null);

    // Show feedback for a moment
    setTimeout(() => {
      if (!isCorrect) {
        // Remove incorrect item after showing X
        const updatedDropped: DroppedItems = { ...newDroppedItems };
        delete updatedDropped[slot.id];
        setDroppedItems(updatedDropped);

        const updatedFeedback: Feedback = { ...newFeedback };
        delete updatedFeedback[slot.id];
        setFeedback(updatedFeedback);
      }
    }, 1000);
  };

  // Mobile click handlers - adaptasi dari JelajahBentuk1
  const handleItemClick = (item: GameItem): void => {
    if (!isMobile) return; // Only work on mobile
    if (showSuccess || completedCount === 4) return; // Disable clicks when game is completed

    // Check if item is already correctly placed
    const isCorrectlyPlaced = Object.entries(droppedItems).some(([slotId, droppedItem]) =>
      droppedItem?.id === item.id && feedback[Number(slotId)] === true
    );

    if (isCorrectlyPlaced) return; // Don't allow selecting correctly placed items

    // Toggle selection
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };

  const handleSlotClick = (slot: ShapeSlot): void => {
    if (!isMobile || !selectedItem) return;
    if (showSuccess || completedCount === 4) return; // Disable clicks when game is completed

    // Check if slot already has a correctly placed item
    if (droppedItems[slot.id] && feedback[slot.id] === true) return;

    const isCorrect = selectedItem.shape === slot.shape;

    // Update dropped items
    const newDroppedItems: DroppedItems = { ...droppedItems };

    // Remove item from previous slot if it exists
    Object.keys(newDroppedItems).forEach(key => {
      const numKey = Number(key);
      if (newDroppedItems[numKey]?.id === selectedItem.id) {
        delete newDroppedItems[numKey];
      }
    });

    newDroppedItems[slot.id] = selectedItem;
    setDroppedItems(newDroppedItems);

    // Update feedback
    const newFeedback: Feedback = { ...feedback };
    newFeedback[slot.id] = isCorrect;
    setFeedback(newFeedback);

    // Update completed count
    const correctCount = Object.values(newFeedback).filter(Boolean).length;
    setCompletedCount(correctCount);

    setSelectedItem(null); // Clear selection after placing

    // Show feedback for a moment
    setTimeout(() => {
      if (!isCorrect) {
        // Remove incorrect item after showing X
        const updatedDropped: DroppedItems = { ...newDroppedItems };
        delete updatedDropped[slot.id];
        setDroppedItems(updatedDropped);

        const updatedFeedback: Feedback = { ...newFeedback };
        delete updatedFeedback[slot.id];
        setFeedback(updatedFeedback);
      }
    }, 1000);
  };

  // Handle clicking on dropped item in mobile (to remove it)
  const handleDroppedItemClick = (item: GameItem, slotId: number): void => {
    if (!isMobile) return;
    if (showSuccess || completedCount === 4) return;
    if (feedback[slotId] === true) return; // Don't allow removing correctly placed items

    // Remove item from slot
    const newDroppedItems: DroppedItems = { ...droppedItems };
    delete newDroppedItems[slotId];
    setDroppedItems(newDroppedItems);

    const newFeedback: Feedback = { ...feedback };
    delete newFeedback[slotId];
    setFeedback(newFeedback);

    // Update completed count
    const correctCount = Object.values(newFeedback).filter(Boolean).length;
    setCompletedCount(correctCount);

    setSelectedItem(null);
  };

  const handleBackToMenu = () => {
    // Stop audio ketika kembali ke menu
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    navigateTo("menu-game");
  };

  // Check device on mount and resize
  useEffect(() => {
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Effect untuk mengontrol audio instruction berdasarkan state
  useEffect(() => {
    const playAudio = async () => {
      try {
        // Logika 1: Jika isPlayingInstructionDuniaBentuk false, ubah menjadi true dan putar audio
        if (!isPlayingInstructionDuniaBentuk) {
          setPlayingInstructionDuniaBentuk(true);

          if (audioRef.current) {
            audioRef.current.volume = 0.9; // Set volume (0.0 - 1.0)
            await audioRef.current.play();
          }
        }
        // Logika 2: Jika isPlayingInstructionDuniaBentuk true, tidak melakukan apa-apa
        // (audio tidak diputar dan state tidak diubah)
      } catch (error) {
        console.log("Audio could not be played automatically:", error);
        // Audio mungkin diblokir oleh browser policy, biarkan user mengklik untuk memutar
      }
    };

    playAudio();

    // Cleanup: pause audio ketika component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []); // Dependency array kosong karena kita hanya ingin ini berjalan sekali saat mount

  // Effect to handle completion
  useEffect(() => {
    if (completedCount === 4) {
      setShowSuccess(true);

      // Update level to 2 if current level is 1
      if (state.levelDuniaBentuk === 1) {
        updateLevelDuniaBentuk(2);
      }

      // Auto navigate to dunia-bentuk-2 after 3 seconds
      const timer = setTimeout(() => {
        // Stop audio sebelum pindah ke level berikutnya
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        navigateTo("dunia-bentuk-2");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [completedCount, navigateTo, updateLevelDuniaBentuk, state.levelDuniaBentuk]);

  return (
    <div className="relative w-full h-screen bg-[#fef625] overflow-hidden flex flex-col">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
      >
        <source src="/audio/Dunia bentuk Fige.m4a" type="audio/mp4" />
      </audio>

      {/* Home Button - Tombol Kembali */}
      <div className="absolute top-8 right-8 z-10">
        <button
          className="flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
          onClick={handleBackToMenu}
          type="button"
        >
          <Image src={Home} alt="Home" width={65} height={65} />
        </button>
      </div>

      {/* Mobile Instructions */}
      {isMobile && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 bg-blue-500 text-white px-4 py-2 rounded-lg text-center max-w-xs">
          <p className="text-sm font-semibold">
            {selectedItem ?
              "Klik slot bentuk yang sesuai untuk menempatkan gambar" :
              "Klik gambar untuk memilih, lalu klik slot bentuk yang sesuai"
            }
          </p>
        </div>
      )}

      {/* Title */}
      <div className="pt-20 pb-8 text-center">
        <h1 className="text-6xl font-bold text-black mb-4">Dunia Bentuk!</h1>
        <p className="text-3xl text-black font-semibold">
          Cocokkan gambar berikut sesuai bentuk geometrinya!
        </p>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="flex gap-12 items-center max-w-5xl w-full mx-auto">

          {/* Left side - Draggable items */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-6">
              {gameData.map((item) => {
                const isCorrectlyPlaced = Object.entries(droppedItems).some(([slotId, droppedItem]) =>
                  droppedItem?.id === item.id && feedback[Number(slotId)] === true
                );

                return (
                  <div
                    key={item.id}
                    className="w-36 h-44 flex items-center justify-center"
                  >
                    {!isCorrectlyPlaced && (
                      <div
                        draggable={!isMobile}
                        onDragStart={!isMobile ? (e) => handleDragStart(e, item) : undefined}
                        onClick={isMobile ? () => handleItemClick(item) : undefined}
                        className={`${isMobile ?
                          'cursor-pointer' :
                          'cursor-grab active:cursor-grabbing'
                          } transition-all duration-200 ${selectedItem?.id === item.id ?
                            'scale-110 ring-4 ring-blue-400 ring-offset-2 shadow-lg' :
                            'hover:scale-105'
                          }`}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={240}
                          height={240}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right side - Drop zones */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl border-8 border-gray-800 p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                {shapeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    onDragOver={!isMobile ? handleDragOver : undefined}
                    onDrop={!isMobile ? (e) => handleDrop(e, slot) : undefined}
                    onClick={isMobile ? () => handleSlotClick(slot) : undefined}
                    className={`relative w-32 h-36 flex items-center justify-center transition-all duration-200 ${isMobile ? 'cursor-pointer' : ''
                      } ${isMobile && selectedItem ? 'hover:bg-blue-100 hover:scale-105' : ''
                      }`}
                  >
                    {droppedItems[slot.id] ? (
                      <div
                        onClick={isMobile ? (e) => {
                          e.stopPropagation();
                          handleDroppedItemClick(droppedItems[slot.id], slot.id);
                        } : undefined}
                        className={isMobile ? 'cursor-pointer' : ''}
                      >
                        <Image
                          src={droppedItems[slot.id].image}
                          alt={droppedItems[slot.id].name}
                          width={150}
                          height={150}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <Image
                        src={slot.image}
                        alt={`${slot.shape} slot`}
                        width={240}
                        height={240}
                        className="object-contain opacity-70"
                      />
                    )}

                    {/* Feedback Icons */}
                    {feedback[slot.id] !== undefined && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                        {feedback[slot.id] ? (
                          <Check size={24} className="text-white bg-green-500 rounded-full p-1" />
                        ) : (
                          <X size={24} className="text-white bg-red-500 rounded-full p-1" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border-8 border-green-500 max-w-md w-full mx-4">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-6xl font-bold text-green-600 mb-4">Kerja Bagus!</h2>
            <p className="text-2xl text-gray-700 mb-6">
              Kamu berhasil mencocokkan semua bentuk!
            </p>
            <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
              <span>Melanjutkan ke level berikutnya...</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}