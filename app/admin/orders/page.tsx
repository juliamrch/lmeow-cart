"use client";

import { title } from "@/components/primitives";
import AddProduct from "@/components/add-product";
import Product from "@/components/product";
import { Spacer } from "@nextui-org/react";

export default function Products({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className={title()}>Orders</h1>
      <Spacer y={10} />
    </div>
  );
}
