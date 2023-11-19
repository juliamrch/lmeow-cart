import React, { ChangeEvent, useState, useRef } from "react";

import { title, subtitle } from "@/components/primitives";
import { Spacer, Input, Button } from "@nextui-org/react";
import {} from "@nextui-org/react";
import { CameraIcon } from './CameraIcon.jsx';
// Automatically optimize images for less bandwith consumption
import Image from 'next/image';


export default function AddProduct() {
    const formRef = useRef(null);
  const [name, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [weight, setWeight] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //const fileInputRef = useRef();

    const product = { title, price, stock, weight, category, image };
    console.log(product); // Log the product object

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      console.log('form',formData)
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
    }
    const response = await fetch("http://localhost:3000/api/product", {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      // Handle error
      console.error("Failed to update product");
      alert("Failed to update product");
      const errorMessage = await response.text(); // Get the error message from the server
      console.error(errorMessage); // Log the error message
    } else {
      // Handle success
      console.log("Product updated successfully");
      alert(`Product updated successfully: ${JSON.stringify(response)}`);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
          <form ref={formRef} onSubmit={handleSubmit}>
            <Input
              type="text"
              label="Title"
              name="name"
              labelPlacement="outside"
              value={name.toString()}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Spacer y={6} />
            <Input
              type="text"
              label="Category"
              name="category"
              labelPlacement="outside"
              value={category.toString()}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Spacer y={6} />
            <Input
              type="number"
              label="Price in ETH"
              name="price"
              placeholder="0.00"
              labelPlacement="outside"
              value={price.toString()}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />

            <Spacer y={6} />
            <Input
              type="number"
              label="Stock"
              name="stock"
              placeholder="0.00"
              labelPlacement="outside"
              value={stock.toString()}
              onChange={(e) => setStock(parseInt(e.target.value))}
            />

            <Spacer y={6} />
            <Input
              type="number"
              label="Weight"
              name="weight"
              placeholder="0"
              labelPlacement="outside"
              value={weight.toString()}
              onChange={(e) => setWeight(parseInt(e.target.value))}
            />

            <Spacer y={6} />
            <div>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleImageUpload}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <Spacer y={6} />
              <Button onClick={handleClick} color="success" endContent={<CameraIcon />}>
                Upload Image
              </Button>
              {image && <Image src={image} alt="preview" />}
            </div>

            <Spacer y={6} />

            <Button type="submit" color="primary">
              Add product
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
