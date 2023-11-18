"use client";

import React, { useEffect, useState } from "react";
import { title, subtitle } from "@/components/primitives";

interface Product {
  id: number;
  name: string;
  price: number;
  // add other properties if needed
}

export default function ShopPage() {
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
      <div>
        <h1 className={title()}>There are no products in this store yet.</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Connect wallet and start adding some if you are the admin. Come back later if you are not.
        </h2>
      </div>
    );
  }

  // Otherwise, render the data
  return (
    <div>
      <h1 className={title()}>Shop</h1>
      {data.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
}
