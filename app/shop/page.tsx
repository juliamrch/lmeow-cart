"use client";
import ProductList from "@/components/product-list";

import useSWR from 'swr';
import { title } from "@/components/primitives";
import { Spacer, Spinner } from "@nextui-org/react";

export default function ShopPage() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error: loggedAccountError } = useSWR(process.env.NEXT_PUBLIC_API_ENDPOINT + '/product', fetcher, {
        refreshInterval: 1000 * 60,
    })

    if (!data) {
        return (
            <div className="flex">
                <h1 className={title()}>Loading products... <Spinner /></h1>
            </div>
        );
    }

    return (
        <>
            <h1 className={title()}>Shop</h1>

            <Spacer y={10} />

            <ProductList products={data} />
        </>
    );
}
