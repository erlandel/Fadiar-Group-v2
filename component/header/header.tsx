"use client";
import Menu from "@/component/menu/menu";
import Serchbar from "@/component/searchBar/searchBar";
import UserDropdown from "@/component/userDropdown/userDropdown";
import { TablerShoppingCart } from "@/icons/icons";
import Image from "next/image";
import "@fontsource/just-me-again-down-here";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import useCartStore from '@/store/cartStore';

export default function Header() {
  const pathname = usePathname();
  const isCart4 = pathname === "/cart4";
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full bg-white z-50">
      <div className={`pt-4 flex justify-between px-4 md:justify-between lg:px-25 items-start ${isCart4 ? "2xl:px-20" : "2xl:px-28"}`}>
        <Link href="/">
          <div className="hidden md:block cursor-pointer">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="h-10 w-32"
              priority 
            />
          </div>
        </Link>

        <div className="hidden md:block">
          <Serchbar />
        </div>

        <div className="md:hidden mr-auto">
          <Menu />
        </div>

        <div className="flex items-center gap-4">

            <Link 
              href="/cart1" 
              className={`relative ${mounted && totalItems === 0 ? 'pointer-events-none' : 'cursor-pointer'}`}
            >
              <TablerShoppingCart className="cursor-pointer" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

          <UserDropdown />
        </div>
      </div>

      <div className="hidden md:block">
        <Menu />
      </div>

      <div className="md:hidden px-4 mt-4 pb-4">
        <Serchbar />
      </div>
    </div>
  );
}
