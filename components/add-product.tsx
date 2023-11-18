import React, { ChangeEvent, useState } from 'react';
import {Input} from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import {title, subtitle} from "@/components/primitives";


export default function AddProduct() {
return (
 <div className="card mx-auto max-w-3xl" style={{ 
    border: '1px solid #ddd', 
    borderRadius: '8px', 
    padding: '20px', 
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' 
}}>
    <h2 className={subtitle({ class: "mt-4" })}>
        Add a product</h2>
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
       <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Input 
          type="title"
          label="Title"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small"></span>
            </div>
          }
          />
        <Input 
          type="number"
          label="Price"
          placeholder="0.00"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
          endContent={
            <div className="flex items-center">
              <label className="sr-only" htmlFor="currency">
                Currency
              </label>
              <select
                className="outline-none border-0 bg-transparent text-default-400 text-small"
                id="currency"
                name="currency"
              >
                <option>USD</option>
                <option>ETH</option>
                <option>EUR</option>
              </select>
            </div>
        
          }
          />
        <Input 
          type="number"
          label="Quantity"
          placeholder="0"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small"></span>
            </div>
          }
          />
        <div>
            <label>Upload Product Image:</label>
            <input type="file" accept="image/*" />
          </div>
      </div>
    </div>
    </div>
  );
}

/*interface AddProductProps {
    
  }

const  AddProduct:  React.FC<AddProductProps> = ({ children }) => {
  const [product, setProduct] = useState({ title: '', img: '', price: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the product to your server
    console.log(product);
  };


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="title" value={product.title} onChange={handleChange} />
      </label>
      <label>
        Image URL:
        <input type="text" name="img" value={product.img} onChange={handleChange} />
      </label>
      <label>
        Price:
        <input type="text" name="price" value={product.price} onChange={handleChange} />
      </label>
      <input type="submit" value="Add Product" />
      {children}
    </form>
  );
}

export default AddProduct;*/