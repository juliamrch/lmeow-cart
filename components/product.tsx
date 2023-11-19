import React from "react";
import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";

export default function Product() {
  const list = [
    {
      title: "Orange",
      img: "/images/fruit-1.jpeg",
      price: "$5.50",
    },
  ];

  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      {list.map((product, index) => (
        <Card shadow="sm" key={index} isPressable onPress={() => console.log("item pressed")}>
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={product.title}
              className="w-full object-cover h-[140px]"
              src={product.img}
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{product.title}</b>
            <p className="text-default-500">{product.price}</p>
          </CardFooter>
          <Button color="secondary">Buy</Button>
        </Card>
      ))}
    </div>
  );
}
