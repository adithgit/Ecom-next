"use client"

import { StoreModal } from "@/components/modals/store-modal";
import { useState, useEffect } from "react";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    // Check whether its rendered on server or client
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted){
        return null;
    }

    return (
        <>
          <StoreModal />
        </>
    )
}