"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { MaterialSymbolsClose, MaterialSymbolsMenu } from "@/icons/icons";

export default function Menu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/products", label: "Productos" },
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "FAQ" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <>
      {/* Botón hamburguesa - Solo visible en móvil */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden  top-4 left-4 z-50 p-2"
        aria-label="Abrir menú"
      >
     <MaterialSymbolsMenu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0   bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menú móvil - Drawer */}
      <div
        className={`fixed top-0  left-0  p-2 h-9/12 rounded-2xl  w-75 bg-white z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-2" : "-translate-x-full"
        }`}
      >
        <div className="p-6 ">
          {/* Logo y botón cerrar */}
          <div className="flex justify-between items-center mb-8">
            <Image src="/images/logo.svg" alt="Logo" width={100} height={50} />
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Cerrar menú"
            >
              <MaterialSymbolsClose className="w-6 h-6" />
            </button>
          </div>

          <hr className="mb-6 border-gray-200" />

          {/* Links del menú móvil */}
          <nav className="flex flex-col gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-md text-gray-700 hover:text-[#002b5c] transition ${
                    isActive ? "text-[#002b5c] font-semibold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Menú desktop - Solo visible en md y superiores */}
      <div className="hidden md:block w-full bg-white ml-5">
        <nav className="flex justify-center gap-10 text-sm text-gray-700 p-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-[#002b5c] transition ${
                  isActive ? "text-primary font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
