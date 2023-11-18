"use client"

import { Button } from "@nextui-org/button";
import { button as buttonStyles } from "@nextui-org/theme";
import { connectWallet, disconnectWallet } from '@/lib/wallet';
import { useEffect, useState } from 'react';

export const WalletButton = () => {
    const [isUserLogged, setIsUserLogged] = useState(false);

    async function initState() {
        try {
            const loggedRaw = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/loggedUser')
            const logged = await loggedRaw.json()

            setIsUserLogged(logged.hasSigned === true)
        } catch (e) {
            console.debug('failed getting logged', e.message)
        }
    }

    useEffect(() => {
        initState()
    }, [])

    async function connect() {
        try {
            const success = await connectWallet()

            window.location.reload()
        } catch (e) {
            console.debug(e.message)
        }
    }

    async function disconnect() {
        await disconnectWallet()

        window.location.reload()
    }

    return (
        <div className="flex gap-3">
            {isUserLogged ?
                <Button
                    onClick={disconnect}
                    className={buttonStyles({ color: "secondary", radius: "full", variant: "shadow" })}
                >
                    Disconnect Wallet
                </Button> :
                <Button
                    onClick={connect}
                    className={buttonStyles({ color: "secondary", radius: "full", variant: "shadow" })}
                >
                    Connect Wallet
                </Button>}
        </div>
    );
};
