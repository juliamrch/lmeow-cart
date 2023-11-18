"use client";
import ProductList from "@/components/product-list";

import React, { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Spacer } from "@nextui-org/react";

interface Product {
  name: string;
  price: number;
  image: string;
  id: number;
  description: string;
}

export default function ShopPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Destructure onOpenChange here
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

      <ProductList products={data} />
    </>
  );
}
