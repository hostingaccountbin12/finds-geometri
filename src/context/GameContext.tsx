/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React, { createContext, useContext, useReducer, useEffect, Dispatch } from 'react';

// Define game screen types
export type GameScreen = 'home' | 'menu' | 'menu-game' | 'profil' | 'petunjuk-bermain-1' | 'petunjuk-bermain-2'
    | 'ayo-menyanyi'| 'mari-berkreasi' 
    | 'dunia-bentuk-1' | 'dunia-bentuk-2' | 'dunia-bentuk-3' | 'dunia-bentuk-4' | 'dunia-bentuk-5'
    | 'montir-kecil-1' | 'montir-kecil-2' | 'montir-kecil-3' | 'montir-kecil-4' | 'montir-kecil-5' 
    | 'jelajah-bentuk-1' | 'jelajah-bentuk-2' | 'jelajah-bentuk-3' | 'jelajah-bentuk-4' | 'jelajah-bentuk-5'
    | 'mini-games-1' | 'mini-games-2' | 'mini-games-3' | 'mini-games-4' | 'mini-games-5'

export type Gender = 'male' | 'female';

// Define game state
export type GameState = {
    screen: GameScreen;
    level: number;
    playerName: string;
    gender?: Gender;

    // Level states
    levelDuniaBentuk: number;
    levelJelajahBentuk: number;
    levelMontirKecil: number;
    levelMiniGames: number;

    // Completion states
    isDuniaBentukFinished: boolean;
    isJelajahBentukFinished: boolean;
    isMontirKecilFinished: boolean;
    isMiniGamesFinished: boolean;
    isAyoMenyanyiFinished: boolean;
    isMariBekreasFinished: boolean;
};

// Define action types
export type GameAction =
    | { type: 'NAVIGATE_TO'; payload: { screen: GameScreen } }
    | { type: 'UPDATE_LEVEL'; payload: { level: number } }
    | { type: 'SET_PLAYER_NAME'; payload: { playerName: string } }
    | { type: 'SET_GENDER'; payload: { gender: Gender } }
    | { type: 'UPDATE_LEVEL_DUNIA_BENTUK'; payload: { level: number } }
    | { type: 'UPDATE_LEVEL_JELAJAH_BENTUK'; payload: { level: number } }
    | { type: 'UPDATE_LEVEL_MONTIR_KECIL'; payload: { level: number } }
    | { type: 'UPDATE_LEVEL_MINI_GAMES'; payload: { level: number } }
    | { type: 'SET_DUNIA_BENTUK_FINISHED'; payload: { isFinished: boolean } }
    | { type: 'SET_JELAJAH_BENTUK_FINISHED'; payload: { isFinished: boolean } }
    | { type: 'SET_MONTIR_KECIL_FINISHED'; payload: { isFinished: boolean } }
    | { type: 'SET_MINI_GAMES_FINISHED'; payload: { isFinished: boolean } }
    | { type: 'SET_AYO_MENYANYI_FINISHED'; payload: { isFinished: boolean } }
    | { type: 'SET_MARI_BERKREASI_FINISHED'; payload: { isFinished: boolean } }
    | { type: 'RESET_GAME' }
    | { type: 'SET_FULL_STATE'; payload: GameState };

// Default game state
const defaultGameState: GameState = {
    screen: 'home',
    level: 1,
    playerName: '',
    levelDuniaBentuk: 1,
    levelJelajahBentuk: 1,
    levelMontirKecil: 1,
    levelMiniGames: 1,
    isDuniaBentukFinished: false,
    isJelajahBentukFinished: false,
    isMontirKecilFinished: false,
    isMiniGamesFinished: false,
    isAyoMenyanyiFinished: false,
    isMariBekreasFinished: false,
};

// Storage key
const STORAGE_KEY = 'bankKidsGameState';

// Load from sessionStorage
const getInitialState = (): GameState => {
    if (typeof window !== 'undefined') {
        const savedState = sessionStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                // Merge with default state to ensure all new properties exist
                return { ...defaultGameState, ...parsedState };
            } catch (e) {
                console.error('Error parsing saved game state', e);
            }
        }
    }
    return defaultGameState;
};

// Reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
    let newState: GameState;

    switch (action.type) {
        case 'NAVIGATE_TO':
            newState = { ...state, screen: action.payload.screen };
            break;
        case 'UPDATE_LEVEL':
            newState = { ...state, level: action.payload.level };
            break;
        case 'SET_PLAYER_NAME':
            newState = { ...state, playerName: action.payload.playerName };
            break;
        case 'SET_GENDER':
            newState = { ...state, gender: action.payload.gender };
            break;
        case 'UPDATE_LEVEL_DUNIA_BENTUK':
            newState = { ...state, levelDuniaBentuk: action.payload.level };
            break;
        case 'UPDATE_LEVEL_JELAJAH_BENTUK':
            newState = { ...state, levelJelajahBentuk: action.payload.level };
            break;
        case 'UPDATE_LEVEL_MONTIR_KECIL':
            newState = { ...state, levelMontirKecil: action.payload.level };
            break;
        case 'UPDATE_LEVEL_MINI_GAMES':
            newState = { ...state, levelMiniGames: action.payload.level };
            break;
        case 'SET_DUNIA_BENTUK_FINISHED':
            newState = { ...state, isDuniaBentukFinished: action.payload.isFinished };
            break;
        case 'SET_JELAJAH_BENTUK_FINISHED':
            newState = { ...state, isJelajahBentukFinished: action.payload.isFinished };
            break;
        case 'SET_MONTIR_KECIL_FINISHED':
            newState = { ...state, isMontirKecilFinished: action.payload.isFinished };
            break;
        case 'SET_MINI_GAMES_FINISHED':
            newState = { ...state, isMiniGamesFinished: action.payload.isFinished };
            break;
        case 'SET_AYO_MENYANYI_FINISHED':
            newState = { ...state, isAyoMenyanyiFinished: action.payload.isFinished };
            break;
        case 'SET_MARI_BERKREASI_FINISHED':
            newState = { ...state, isMariBekreasFinished: action.payload.isFinished };
            break;
        case 'RESET_GAME':
            newState = defaultGameState;
            break;
        case 'SET_FULL_STATE':
            newState = action.payload;
            break;
        default:
            return state;
    }

    // Sync to session storage
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    }

    return newState;
};

// Context setup
const GameContext = createContext<{
    state: GameState;
    dispatch: Dispatch<GameAction>;
}>({
    state: defaultGameState,
    dispatch: () => null,
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, null, getInitialState);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedState = sessionStorage.getItem(STORAGE_KEY);
            if (savedState) {
                try {
                    const parsedState = JSON.parse(savedState);
                    const mergedState = { ...defaultGameState, ...parsedState };
                    if (JSON.stringify(mergedState) !== JSON.stringify(state)) {
                        dispatch({ type: 'SET_FULL_STATE', payload: mergedState });
                    }
                } catch (e) {
                    console.error('Error parsing saved game state', e);
                }
            }
        }
    }, []);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameState = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGameState must be used within a GameProvider');
    }

    return {
        ...context,
        // Navigation
        navigateTo: (screen: GameScreen) =>
            context.dispatch({ type: 'NAVIGATE_TO', payload: { screen } }),

        // Basic game functions
        updateLevel: (level: number) =>
            context.dispatch({ type: 'UPDATE_LEVEL', payload: { level } }),
        setPlayerName: (playerName: string) =>
            context.dispatch({ type: 'SET_PLAYER_NAME', payload: { playerName } }),
        setGender: (gender: Gender) =>
            context.dispatch({ type: 'SET_GENDER', payload: { gender } }),

        // Level functions
        updateLevelDuniaBentuk: (level: number) =>
            context.dispatch({ type: 'UPDATE_LEVEL_DUNIA_BENTUK', payload: { level } }),
        updateLevelJelajahBentuk: (level: number) =>
            context.dispatch({ type: 'UPDATE_LEVEL_JELAJAH_BENTUK', payload: { level } }),
        updateLevelMontirKecil: (level: number) =>
            context.dispatch({ type: 'UPDATE_LEVEL_MONTIR_KECIL', payload: { level } }),
        updateLevelMiniGames: (level: number) =>
            context.dispatch({ type: 'UPDATE_LEVEL_MINI_GAMES', payload: { level } }),

        // Completion functions
        setDuniaBentukFinished: (isFinished: boolean) =>
            context.dispatch({ type: 'SET_DUNIA_BENTUK_FINISHED', payload: { isFinished } }),
        setJelajahBentukFinished: (isFinished: boolean) =>
            context.dispatch({ type: 'SET_JELAJAH_BENTUK_FINISHED', payload: { isFinished } }),
        setMontirKecilFinished: (isFinished: boolean) =>
            context.dispatch({ type: 'SET_MONTIR_KECIL_FINISHED', payload: { isFinished } }),
        setMiniGamesFinished: (isFinished: boolean) =>
            context.dispatch({ type: 'SET_MINI_GAMES_FINISHED', payload: { isFinished } }),
        setAyoMenyanyiFinished: (isFinished: boolean) =>
            context.dispatch({ type: 'SET_AYO_MENYANYI_FINISHED', payload: { isFinished } }),
        setMariBekreasFinished: (isFinished: boolean) =>
            context.dispatch({ type: 'SET_MARI_BERKREASI_FINISHED', payload: { isFinished } }),

        // Utility functions
        resetGame: () => {
            context.dispatch({ type: 'RESET_GAME' });
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem(STORAGE_KEY);
            }
        },
    };
};