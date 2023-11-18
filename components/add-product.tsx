import React, { ChangeEvent, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import { title, subtitle } from "@/components/primitives";
import { Spacer, Input, Button } from "@nextui-org/react";
import {} from "@nextui-org/react";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [currency, setCurrency] = useState("USD");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const product = { title, price, quantity, currency };

    const response = await fetch("http://localhost:3000/api/product", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      // Handle error
      console.error("Failed to update product");
      alert("Failed to update product");
    } else {
      // Handle success
      console.log("Product updated successfully");
      alert(`Product updated successfully: ${JSON.stringify(response)}`);
    }
  };

  return (
    <>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              label="Title"
              labelPlacement="outside"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Spacer y={6} />
            <Input
              type="number"
              label="Price"
              placeholder="0.00"
              labelPlacement="outside"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
            <select
              className="outline-none border-0 bg-transparent text-default-400 text-small"
              id="currency"
              name="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option>USD</option>
              <option>ETH</option>
              <option>EUR</option>
            </select>
            <Spacer y={6} />
            <Input
              type="number"
              label="Quantity"
              placeholder="0"
              labelPlacement="outside"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />

            <Spacer y={6} />
            <Button color="primary">Add product</Button>
          </form>
        </div>
      </div>
    </>
  );
}
