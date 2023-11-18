import React, { ChangeEvent, useState } from "react";
import { Input } from "@nextui-org/react";
import { useInput } from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import { title, subtitle } from "@/components/primitives";

export default function AddProduct() {
  return (
    <>
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
        </div>
      </div>

      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Card isFooterBlurred radius="lg" className="border-none"></Card>
        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"></div>
      </div>
    </>
  );
}
