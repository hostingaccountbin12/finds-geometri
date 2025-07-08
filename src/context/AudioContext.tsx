"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AudioContextProps {
    audioPlaying: boolean;
    toggleAudio: () => void;
    setComponentVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio('/audio/Music.mp3');
        audio.loop = true;
        audio.volume = 0.5;
        setAudioElement(audio);

        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
            }
        };
    }, []);

    const toggleAudio = () => {
        if (audioElement) {
            if (audioPlaying) {
                audioElement.pause();
            } else {
                audioElement.play().catch((e) => {
                    console.log("Audio play failed:", e);
                    alert("Click again to play background music!");
                });
            }
            setAudioPlaying(!audioPlaying);
        }
    };

    // New function to set volume based on component
    const setComponentVolume = (volume: number) => {
        if (audioElement) {
            // Ensure volume is between 0 and 1
            const clampedVolume = Math.max(0, Math.min(1, volume));
            audioElement.volume = clampedVolume;
        }
    };

    return (
        <AudioContext.Provider value={{
            audioPlaying,
            toggleAudio,
            setComponentVolume
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
};