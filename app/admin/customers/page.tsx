"use client";

import { title } from "@/components/primitives";
import { Spacer, Spinner } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import useSWR from 'swr';
import SharedAppDataContext from '@/lib/sharedAppDataContext';

export default function Customers({ children }: { children: React.ReactNode }) {
    const { sharedData, setSharedData } = useContext(SharedAppDataContext);
    const [loading, setLoading] = useState(true)
    const [customers, setCustomers] = useState([])

    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error: customerLoadingError } = useSWR(process.env.NEXT_PUBLIC_API_ENDPOINT + '/customers', fetcher, {
        refreshInterval: 1000 * 60,
    })

    useEffect(() => {
        if (!data || data.length === 0) {
            return
        }

        setCustomers(data)
    }, [data])

    useEffect(() => {
        if (sharedData.userLoaded) {
            if ((!sharedData.loggedUser || !sharedData.loggedUser.isAdmin)) {
                window.location = '/shop'
            }

            setLoading(false)
        }
    }, [sharedData.userLoaded])

    if (loading) {
        return (
            <div className="flex">
                <h1 className={title()}>Loading... <Spinner /></h1>
            </div>
        );
    }

    return (
        <div>
            <h1 className={title()}>Customers</h1>
            <Spacer y={10} />

            {customers.map((customer, index: number) => (
                <div key={index}>
                    <h5>{customer.createdAt} / {customer.updatedAt}</h5>
                    <h5>User {customer.address}</h5>
                    <h5>HasSigned {customer.hasSigned ? 'Yes' : 'No'}</h5>
                    <h5>IsAdmin {customer.isAdmin ? 'Yes' : 'No'}</h5>
                </div>
            ))}
        </div>
    );
}
