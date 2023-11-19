"use client";

import { title } from "@/components/primitives";
import { Spacer, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import useSWR from 'swr';
import ProductList from "@/components/product-list";

interface Order {
        createdAt: string;
        updatedAt: string;
        user: string;
        trxHash: string;
        receipt: { status: number };
        shippingAddress: string;
        totalAmount: number;
        totalTransacted: number;
        cart: { [key: string]: any };
        }

export default function BasicPage() {
    const [loading, setLoading] = useState(true)

    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error: loggedAccountError } = useSWR(process.env.NEXT_PUBLIC_API_ENDPOINT + '/order', fetcher, {
        refreshInterval: 1000 * 60,
    })

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
            <h1 className={title()}>Orders</h1>

            <Spacer y={10} />

            {data.map((order: Order, index: number) => (
                <div key={index}>
                    <h5>{order.createdAt} / {order.updatedAt}</h5>
                    <h5>User {order.user}</h5>
                    <h5>Hash {order.trxHash}</h5>
                    <h5>Status {order.receipt ? (order.receipt.status === 1 ? 'Success' : 'Fail') : 'Unknown'}</h5>
                    <h5>Shipping {order.shippingAddress}</h5>
                    <h5>Order Amount {order.totalAmount}</h5>
                    <h5>Transacted {order.totalTransacted}</h5>
                    <ProductList products={Object.keys(order.cart).reduce((all: any[], v) => { all.push(order.cart[v]); return all }, [])} showAdd={false} showRemove={false} />
                </div>
            ))}
        </div>
    );
}
