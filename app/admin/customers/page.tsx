"use client";

import { title } from "@/components/primitives";
import { Spacer, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Customers({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true)

    async function initState() {
        try {
            const loggedRaw = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/loggedUser')
            const logged = await loggedRaw.json()

            if (logged.isAdmin === true) {
                return setLoading(false)
            }

            window.location = '/shop'
        } catch (e) {
            console.debug('failed getting logged', e.message)
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
            <h1 className={title()}>Customers</h1>
            <Spacer y={10} />
        </div>
    );
}
