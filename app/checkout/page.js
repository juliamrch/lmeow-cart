"use client";

import React, { useEffect, useState } from "react";
import { title, subtitle } from "@/components/primitives";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Spacer } from "@nextui-org/react";
import { sendTrx } from '@/lib/wallet';
import ProductList from "@/components/product-list";

export default function ShopPage() {
    const [data, setData] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        fetch("http://localhost:3000/api/cart")
            .then((response) => response.json())
            .then((data) => {
                const productIds = Object.keys(data)
                const products = []
                let total = 0
                for (let i = 0,cnt = productIds.length; i < cnt; ++i) {
                    const product = data[productIds[i]]

                    products.push(product)

                    total += +product.price
                }

                setData(products)
                setTotalAmount(total)
            })
            .catch((error) => console.error("Error:", error));
    }, []);

    async function buy() {
        sendTrx(totalAmount)
    }

    // If data is still null, render a loading message
    if (data === null || data.length === 0) {
        return (
            <div className="flex">
                <h1 className={title()}>There are no products in your cart yet.</h1>
                <h2 className={subtitle({ class: "mt-4" })}>
                    You can Connect wallet and start adding some.
                </h2>
            </div>
        );
    }

    // Otherwise, render the data
    return (
        <>
            <h1 className={title()}>Checkout</h1>

            <Spacer y={40} />

            <ProductList products={data} />

            <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                <div>Total: {totalAmount}</div>
                <div><Button onClick={buy}>Pay</Button></div>
            </div>
        </>
    );
}
