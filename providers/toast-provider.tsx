"use client"

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast"

export const ToasterProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    // Prevent hydration errors
    // Check whether its rendered on server or client
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted){
        return null;
    }

    return <Toaster />
}