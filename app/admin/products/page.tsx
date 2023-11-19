"use client";

import { title } from "@/components/primitives";
import AddProduct from "@/components/add-product"
import Product from "@/components/product"
import {Spacer,Spinner} from "@nextui-org/react";
import { useEffect, useState } from "react";


export default function BasicPage() {
    const [loading, setLoading] = useState(true)

    async function initState() {
        try {
            const loggedRaw = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/loggedUser')
            const logged = await loggedRaw.json()

            if (logged.isAdmin === true) {
                return setLoading(false)
            }

            window.location.href = '/shop'
        } catch (e) {
            if (e instanceof Error) {
            console.debug('failed getting logged', e.message)
            }
        }
    }

    useEffect(() => {
        initState()
    }, [])

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