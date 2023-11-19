"use client";

import SideNav from "@/components/sidenav";
import { useRouter } from "next/navigation";
import { title } from "@/components/primitives";
import { Spacer } from "@nextui-org/react";

export default function AdminPage() {
  return (
    <div>
      <h1 className={title()}>Welcome, Admin</h1>
      <Spacer y={10} />
    </div>
  );
}
