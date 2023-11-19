"use client";

import React, { useEffect, useState } from "react";
import { title, subtitle } from "@/components/primitives";
import { Button, Textarea } from "@nextui-org/react";
import { Spacer } from "@nextui-org/react";
import { sendTrx } from '@/lib/wallet';
import ProductList from "@/components/product-list";
import useSWR from "swr";

const API_URL_CART = process.env.NEXT_PUBLIC_API_ENDPOINT + '/cart'

export default function ShopPage() {
    const [totalAmount, setTotalAmount] = useState(0);
    const [shippingAddress, setShippingAddress] = useState("");
    const [products, setProducts] = useState([]);

    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error: cartLoadingError } = useSWR(API_URL_CART, fetcher, {
        refreshInterval: 1000 * 60,
    })

    useEffect(() => {
        if (!data || data.success === false) {
            return
        }
        const productIds = Object.keys(data)
        if (productIds.length === 0) {
            return
        }

        const cartProducts = []
        let total = 0
        for (let i = 0, cnt = productIds.length; i < cnt; ++i) {
            const product = data[productIds[i]]

            cartProducts.push(product)

            total += +product.price
        }

        setProducts(cartProducts)
        setTotalAmount(total)
    }, [data]);

    async function buy() {
        if (!shippingAddress) {
            return alert("Shipping Address is required.")
        }

        const trxHash = await sendTrx(totalAmount)

        console.debug(trxHash)

        const orderRaw = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/order', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                shippingAddress,
                trxHash,
                totalAmount
            })
        })

        const order = await orderRaw.json()
        
        console.debug(order)

        alert(`order id ${order.id}`)
    }

    if (products.length === 0) {
        return (
            <div className="flex">
                <h1 className={title()}>There are no products in your cart yet.</h1>
                <h2 className={subtitle({ class: "mt-4" })}>
                    You can Connect wallet and start adding some.
                </h2>
            </div>
        );
    }

    return (
        <>
            <h1 className={title()}>Checkout</h1>

            <Spacer y={10} />

            <ProductList products={products} showAdd={false} showRemove={true} />

            <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                <Textarea
                    type="text"
                    label="Shipping Address"
                    labelPlacement="outside"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                />
                <div>Total: {totalAmount}</div>
                <div><Button onClick={buy}>Pay</Button></div>
            </div>
        </>
    );
}
