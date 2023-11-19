"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import SharedAppDataContext from '@/lib/sharedAppDataContext';

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
    const [sharedData, setSharedData] = React.useState({ loggedUser: null, userLoaded: false })
    const router = useRouter();

    return (
        <NextUIProvider navigate={router.push}>
            <SharedAppDataContext.Provider value={{ sharedData, setSharedData }}>
                <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
            </SharedAppDataContext.Provider>
        </NextUIProvider>
    );
}
