"use client";

import { title } from "@/components/primitives";
import SideNav from '@/components/sidenav';
import { useRouter } from 'next/navigation';


export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  
	return (
      
      <div>
        <h1 className={title()}>Products</h1>
      </div>


	);
}