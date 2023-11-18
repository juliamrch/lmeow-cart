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
  CardFooter,
  Image,
  Button,
  useDisclosure,
} from "@nextui-org/react";

interface Product {
  name: string;
  price: number;
  image: string;
  id: number;
  description: string;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState<Product[]>(products);

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
      <div className="gap-10 grid grid-cols-2 sm:grid-cols-1">
        {data.map((product: Product, index: number) => (
          <div key={index}>
            <Card isFooterBlurred className="w-full h-[400px] col-span-12 sm:col-span-5">
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p className="text-tiny text-white/60 uppercase font-bold"></p>
                <h4 className="text-black font-medium text-2xl">{product.name}</h4>
              </CardHeader>
              <Image
                removeWrapper
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                alt={product.name}
                src={"api/product/image/" + product.id}
              />
              <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <div>
                  <p className="text-black font-bold">{product.price} ETH</p>
                </div>
                <Button className="text-tiny" color="primary" radius="full" size="sm">
                  Buy
                </Button>
                <Button onPress={onOpen}>Description</Button>
                <Modal isOpen={isOpen} onOpenChange={onOpen}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">{product.name}</ModalHeader>
                        <ModalBody>
                          <p>{product.description}</p>
                        </ModalBody>
                        <ModalFooter>
                          <Button color="danger" variant="light" onPress={onClose}>
                            Close
                          </Button>
                          <Button color="primary" onPress={onClose}>
                            Action
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductList;
