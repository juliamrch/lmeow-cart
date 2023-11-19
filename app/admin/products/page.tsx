"use client";

import { title } from "@/components/primitives";
import AddProduct from "@/components/add-product"
import Product from "@/components/product"
import { Spacer, Spinner } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import SharedAppDataContext from '@/lib/sharedAppDataContext';

export default function Products({ children }: { children: React.ReactNode }) {
    const { sharedData, setSharedData } = useContext(SharedAppDataContext);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (sharedData.userLoaded) {
            if ((!sharedData.loggedUser || !sharedData.loggedUser.isAdmin)) {
                window.location = '/shop'
            }

            setLoading(false)
        }
    }, [sharedData.userLoaded])

    if (loading) {
        return (
            <div className="flex">
                <h1 className={title()}>Loading... <Spinner /></h1>
            </div>
        );
    }

    return (
        <div>
            <h1 className={title()}>Products</h1>
            <Spacer y={10} />
            <AddProduct />
        </div>
    );
}