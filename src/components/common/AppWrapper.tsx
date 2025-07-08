"use client"

import { useEffect, useState } from "react";
// import { useGameState } from "@/context/GameContext";
import LoadingScreen from "./LoadingScreen";
import BankKidsApp from "../pages/route/RouteRendering";

export default function AppWrapper() {
    const [isLoading, setIsLoading] = useState(true);
    // const { state } = useGameState();

    useEffect(() => {
        // Short timeout to ensure hydration and state loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return <BankKidsApp />;
}