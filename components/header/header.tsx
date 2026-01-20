"use client";
import Menu from "@/components/menu/menu";
import Serchbar from "@/components/searchBar/searchBar";
import UserDropdown from "@/components/userDropdown/userDropdown";
import { AkarIconsLocation, TablerShoppingCart } from "@/icons/icons";
import Image from "next/image";
import "@fontsource/just-me-again-down-here";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import useCartStore from "@/store/cartStore";
import useProductsByLocationStore from "@/store/productsByLocationStore";

export default function Header() {
  const pathname = usePathname();
  const isCart4 = pathname === "/cart4";
  const isCartStep = ["/cart1", "/cart2", "/cart3"].includes(pathname);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { setIsOpen } = useProductsByLocationStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full bg-white z-50">
      <div
        className={`pt-4 flex justify-between px-4 xl:justify-between xl:px-25 items-start ${isCart4 ? "2xl:px-20" : "2xl:px-28"}`}
      >
        <Link href="/">
          <div className="hidden xl:block cursor-pointer">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="h-10 w-32"
            />
          </div>
        </Link>

        <div className="hidden xl:block">
          <Serchbar />
        </div>

        <div className="xl:hidden mr-auto">
          <Menu />
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/cart1"
            className={`relative ${mounted && totalItems === 0 ? "pointer-events-none" : "cursor-pointer"}`}
          >
            <TablerShoppingCart className="cursor-pointer" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <UserDropdown />

          <div>
            <AkarIconsLocation
              className={`${isCartStep ? "opacity-50 cursor-default" : "cursor-pointer"}`}
              onClick={() => !isCartStep && setIsOpen(true)}
            />
          </div>
          
        </div>
      </div>

      <div className="hidden xl:block">
        <Menu />
      </div>

      <div className="xl:hidden px-4 mt-4 pb-4">
        <Serchbar />
      </div>
    </div>
  );
}
