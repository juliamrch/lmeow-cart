"use client";

import React, { useEffect, useState } from "react";
import { title, subtitle } from "@/components/primitives";
import { Card, CardHeader, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { Spacer } from "@nextui-org/react";

interface Product {
  name: string;
  price: number;
  image: string;
  // add other properties if needed
}

export default function App() {
  //const [data, setData] = useState(null);
  const [data, setData] = useState<Product[] | null>(null);
  useEffect(() => {
    fetch("http://localhost:3000/api/product")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  // If data is still null, render a loading message
  if (data === null) {
    return (
      <div className="flex">
        <h1 className={title()}>Loading products...</h1>
      </div>
    );
  }

  // Otherwise, render the data
  return (
    <>
      <h1 className={title()}>Shop</h1>

      <Spacer y={40} />

      <div className="gap-2 grid grid-cols-2 sm:grid-cols-1">
        {data.map((product: Product, index: number) => (
          <div key={index}>
            <Card isFooterBlurred className="w-full h-[400px] col-span-12 sm:col-span-5">
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold"></p>
                <h4 className="text-black font-medium text-2xl">{product.name}</h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card example background"
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                alt={product.name}
                src={product.image ? "api/product/image/" + product.id : "https://placehold.co/600x400/png"}
              />
              <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black font-bold">{product.price} ETH</p>
                </div>
                <Button className="text-tiny" color="primary" radius="full" size="sm">
                  Buy
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
