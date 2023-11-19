"use client"

import { Button } from "@nextui-org/button";
import { button as buttonStyles } from "@nextui-org/theme";
import { connectWallet, disconnectWallet } from '@/lib/wallet';
import { useContext, useEffect, useState } from 'react';
import SharedAppDataContext from '@/lib/sharedAppDataContext';

export const WalletButton = () => {
    const { sharedData, setSharedData } = useContext(SharedAppDataContext);
    const [isUserLogged, setIsUserLogged] = useState(false);

    async function refreshWallet() {
        try {
            const loggedRaw = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/loggedUser')
            const loggedUser = await loggedRaw.json()

            setSharedData((data) => {
                return { ...data, loggedUser, userLoaded: true }
            })
        } catch (e) {
            console.debug('failed getting logged', e.message)
        }
    }

    useEffect(() => {
        refreshWallet()
    }, [])

    useEffect(() => {
        setIsUserLogged(sharedData.loggedUser && sharedData.loggedUser.hasSigned === true)
    }, [sharedData.loggedUser])

    async function connect() {
        try {
            const success = await connectWallet()
            if (success) {
                refreshWallet()
            }
        } catch (e) {
            console.debug(e.message)
        }
    }

    async function disconnect() {
        await disconnectWallet()

        refreshWallet()
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
