"use client";

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { Button } from "@nextui-org/button";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { WalletButton } from '@/components/wallet-button'
import { useEffect, useState } from "react";

export default function SetUp() {
    const [isUserLogged, setIsUserLogged] = useState(false);
    const [isAdminSetup, setIsAdminSetup] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    async function claim() {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/escalate');

            const data = await response.json();
            if (data.success !== true) {
                throw new Error(data.message)
            }

            setIsAdminSetup(data.success)
            setIsUserAdmin(data.success)
        } catch (e) {
            console.debug(e.message)
        }
    }

    async function initState() {
        try {
            const stateRaw = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/isSetup')
            const state = await stateRaw.json()

            setIsAdminSetup(state.isAdminSetup)
        } catch (e) {
            console.debug('failed getting state', e.message)
        }

        try {
            const loggedRaw = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/loggedUser')
            const logged = await loggedRaw.json()

            setIsUserLogged(logged.hasSigned === true)
            setIsUserAdmin(logged.isAdmin === true)
        } catch (e) {
            console.debug('failed getting logged', e.message)
        }
    }

    useEffect(() => {
        initState()
    }, [])

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            {isUserLogged === false && isAdminSetup === false && <div className="inline-block max-w-lg text-center justify-center">
                <h1 className={title()}>Set up your&nbsp;</h1>
                <h1 className={title({ color: "violet" })}>beautiful&nbsp;</h1>
                <br />
                <h1 className={title()}>
                    web3 store.
                </h1>
                <h2 className={subtitle({ class: "mt-2" })}>
                    Manage authentication and payments with your ethereum wallet.
                </h2>
                <p>
                    Connect wallet to declare your store ownership.
                </p>
            </div>}

            {isUserLogged === false && isAdminSetup === false && <div className="flex gap-3">
                <WalletButton />
            </div>}

            {isUserLogged === true && isAdminSetup === false && <div className="mt-8">
                <Snippet hideSymbol hideCopyButton variant="flat">
                    <span>
                        <Button
                            onClick={claim}
                            className={buttonStyles({ color: "primary", radius: "full", variant: "shadow" })}
                        >
                            Claim the Store
                        </Button>
                    </span>
                </Snippet>
            </div>}

            {isAdminSetup === true && isUserAdmin === true && <div className="mt-8">
                <Snippet hideSymbol hideCopyButton variant="flat">
                    <span>
                        Your store has been setup. Please, add some <Link href="/admin/products">
                            <a>products</a>
                        </Link>.
                    </span>
                </Snippet>
            </div>}
        </section>
    );
}
