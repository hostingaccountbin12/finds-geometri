"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AudioContextProps {
    audioPlaying: boolean;
    toggleAudio: () => void;
    setComponentVolume: (volume: number) => void;
    pauseBackgroundMusic: () => void;
    resumeBackgroundMusic: () => void;
    isBackgroundMusicPaused: boolean;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
    const [isBackgroundMusicPaused, setIsBackgroundMusicPaused] = useState(false);

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
                // Only play if not manually paused by component
                if (!isBackgroundMusicPaused) {
                    audioElement.play().catch((e) => {
                        console.log("Audio play failed:", e);
                        alert("Click again to play background music!");
                    });
                }
            }
            setAudioPlaying(!audioPlaying);
        }
    };

    // Function to temporarily pause background music (for components like karaoke)
    const pauseBackgroundMusic = () => {
        if (audioElement && audioPlaying) {
            audioElement.pause();
            setIsBackgroundMusicPaused(true);
        }
    };

    // Function to resume background music
    const resumeBackgroundMusic = () => {
        if (audioElement && audioPlaying && isBackgroundMusicPaused) {
            audioElement.play().catch((e) => {
                console.log("Audio resume failed:", e);
            });
            setIsBackgroundMusicPaused(false);
        }
    };

    // Function to set volume (keep this for other components that might need it)
    const setComponentVolume = (volume: number) => {
        if (audioElement) {
            const clampedVolume = Math.max(0, Math.min(1, volume));
            audioElement.volume = clampedVolume;
        }
    };

    return (
        <AudioContext.Provider value={{
            audioPlaying,
            toggleAudio,
            setComponentVolume,
            pauseBackgroundMusic,
            resumeBackgroundMusic,
            isBackgroundMusicPaused
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