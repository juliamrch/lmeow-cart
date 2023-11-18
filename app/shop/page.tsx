"use client";

import React, { useEffect, useState } from "react";
import { title, subtitle } from "@/components/primitives";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Spacer } from "@nextui-org/react";

interface Product {
  id: number;
  name: string;
  price: number;
  // add other properties if needed
}

export default function PublicShopPage() {
  const [data, setData] = useState(null);

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

      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {data.map((product: Product, index: number) => (
          <div key={index}>
            <Card shadow="sm" isPressable onPress={() => console.log("item pressed")}>
              <CardBody className="overflow-visible p-0">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={product.name}
                  className="w-full object-cover h-[140px]"
                  src={product.image}
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>{product.name}</b>
                <p className="text-default-500">{product.price}</p>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
