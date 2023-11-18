import { ethers } from 'ethers';

async function getWalletProvider() {
    if (typeof window === 'undefined') {
        console.debug("Wallet is not installed");

        return null
    }

    if (typeof window.ethereum === 'undefined') {
        console.debug("Ethereum wallet is not installed");

        return null
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        await provider.send("eth_requestAccounts", []);
        console.log(await provider.getSigner())
        return provider;
    } catch (error) {
        console.error(error);
    }
}

export const connectWallet = async () => {
    const provider = await getWalletProvider()
    if (provider === null) {
        return null
    }

    const signer = await provider.getSigner()
    const address = signer.address
    let signature

    try {
        const getMessageToSignResponse = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/getMessageToSign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address })
        });

        const data = await getMessageToSignResponse.json();
        signature = await signer.signMessage(data.message)
    } catch (e) {
        throw new Error('Failed signing the message.')
    }

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ address, signature }),
        });

        const data = await response.json();
        if (data.success !== true) {
            throw new Error(data.message)
        }
    } catch (e) {
        throw new Error(e.message)
    }
};

export const disconnectWallet = async () => {
    return fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
            } else {
                console.error("Logout failed:", data.message);
            }
        });
};
