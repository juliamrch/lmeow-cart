"use client";

import { title } from "@/components/primitives";
import { Button, Spacer, Spinner } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import useSWR from 'swr';
import ProductList from "@/components/product-list";
import SharedAppDataContext from '@/lib/sharedAppDataContext';

export default function Orders({ children }: { children: React.ReactNode }) {
    const { sharedData, setSharedData } = useContext(SharedAppDataContext);
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([]);

    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error: loggedAccountError } = useSWR(process.env.NEXT_PUBLIC_API_ENDPOINT + '/order', fetcher, {
        refreshInterval: 1000 * 60,
    })

    useEffect(() => {
        if (sharedData.userLoaded) {
            if ((!sharedData.loggedUser || !sharedData.loggedUser.isAdmin)) {
                window.location = '/shop'
            }

            setLoading(false)
        }
    }, [sharedData.userLoaded])

    useEffect(() => {
        if (!data || data.success === false) {
            return
        }
        if (data.length === 0) {
            return
        }

        setProducts(data)
    }, [data]);

    async function ship(id) {
        const orderRaw = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/order/' + id, {
            method: 'POST'
        })

        const order = await orderRaw.json()

        console.debug(order)

        alert(`order id ${order.success}`)
    }

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

            {products.map((order, index: number) => (
                <div key={index}>
                    <h5>{order.createdAt} / {order.updatedAt}</h5>
                    <h5>User {order.user}</h5>
                    <h5>Hash {order.trxHash}</h5>
                    <h5>Status {order.receipt ? (order.receipt.status === 1 ? 'Success' : 'Fail') : 'Unknown'}</h5>
                    <h5>Shipping Address {order.shippingAddress}</h5>
                    <h5>Order Amount {order.totalAmount}</h5>
                    <h5>Transacted {order.totalTransacted}</h5>
                    <h5>Is Shipped {order.shipped ? 'Yes' : 'No'}</h5>
                    {!order.shipped && <Button onClick={() => { ship(order.id) }}>Ship</Button>}
                    <ProductList products={Object.keys(order.cart).reduce((all, v) => { all.push(order.cart[v]); return all }, [])} showAdd={false} showRemove={false} />
                </div>
            ))}
        </div>
    );
}
