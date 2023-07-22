import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { url } from "inspector";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout(
    {
        children,
        params
    }:{
        children: React.ReactNode,
        params: { storeId: string }
    }
) {
    const { userId } = auth();
    
    if(!userId){
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    if(!store){
        redirect("/");
    }

    return (
        <>
        <Navbar />
        { children }
        </>
    )


}