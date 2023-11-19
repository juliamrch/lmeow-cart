"use client";

import { title, subtitle } from "@/components/primitives";
import { Spacer } from "@nextui-org/react";

export default function Products({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2 className={subtitle()}>Welcome, Admin</h2>
        <Spacer y={10} />
    
      <h1 className={title()}>Customers</h1>
        <Spacer y={10} />
    </div>
  );
}
