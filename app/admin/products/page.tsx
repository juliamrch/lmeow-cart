"use client";

import { title, subtitle } from "@/components/primitives";
import AddProduct from "@/components/add-product"
import ProductList from "@/components/product-list"
import {Spacer} from "@nextui-org/react";
import { useEffect, useState } from 'react';


export default function ProductsPage({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);
	return (
      
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2 className={subtitle()}>Welcome, Admin</h2>
          <Spacer y={10} />
        <h1 className={title()}>Products</h1>
          <Spacer y={10} />

        
        <div>
        <ProductList products={products} />
        </div>

      <div style={{ marginLeft: 'auto' }}>
        <AddProduct />
        </div>
  


      </div>


	);
}