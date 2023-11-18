"use client";

import { UserGroupIcon, HomeIcon, ShoppingBagIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Overview", href: "/admin", icon: HomeIcon },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ClipboardDocumentListIcon,
  },
  { name: "Customers", href: "/admin/customers", icon: UserGroupIcon },
  { name: "Products", href: "/admin/products", icon: ShoppingBagIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md  p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3",
              {
                blue: pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
