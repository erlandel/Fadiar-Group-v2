"use client";
import { useState, useRef, useEffect } from "react";
import { UserCircle } from "lucide-react";
import Link from "next/link";
import {
  MdiRegister,
  NextUilExit,
  TablerUserCircle,
  UilExit,
} from "@/icons/icons";
import useAuthStore from "@/store/authStore";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { access_token, clearAuth } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer focus:outline-none"
        aria-label="User menu"
      >
        <TablerUserCircle className="mt-1 " />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-58 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 z-50  space-x-2  ">
          {access_token ? (
            <>
              <Link
                href="/myProfile"
                className="group flex items-center hover:bg-[#F5F7FA] transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                <UserCircle
                  className="text-[#777777] group-hover:text-[#022954] transition-colors"
                  width={22}
                  height={22}
                />
                <span className="text-[#777777] group-hover:text-[#022954]  group-hover:font-bold font-medium text-md ml-2 transition-colors">
                  Perfil
                </span>
              </Link>

              <Link
                href="/orders"
                className="group flex items-center hover:bg-[#F5F7FA] transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                <NextUilExit
                  className="text-[#777777] group-hover:text-[#022954] transition-colors"
                  width={20}
                  height={20}
                />
                <span className="text-[#777777] group-hover:text-[#022954] font-medium group-hover:font-bold ml-2 transition-colors">
                  Mis Pedidos
                </span>
              </Link>

              <button
                className="group flex items-center  hover:bg-[#F5F7FA]  transition-colors w-full p-2 cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  clearAuth();
                  if (typeof window !== "undefined") {
                    try {
                      localStorage.removeItem("auth-storage");
                    } catch {}
                  }
                }}
              >
                <UilExit
                  className="text-[#EB0C0C] group-hover:text-[#EB0C0C] transition-colors"
                  width={20}
                  height={20}
                />

                <span className="text-[#EB0C0C] group-hover:font-bold ml-2">
                  Cerrar Sesión
                </span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="group flex items-center hover:bg-[#F5F7FA] transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                <NextUilExit
                  className="text-[#777777] group-hover:text-[#022954] transition-colors"
                  width={20}
                  height={20}
                />
                <span className="text-[#777777] group-hover:text-[#022954] font-medium group-hover:font-bold ml-2 transition-colors">
                  Login
                </span>
              </Link>

              <Link
                href="/register"
                className="group flex items-center hover:bg-[#F5F7FA] transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                <div className="group">
                  <MdiRegister />
                </div>

                <span className="text-[#777777] group-hover:text-[#022954] font-medium group-hover:font-bold ml-2 transition-colors">
                  Registrse
                </span>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
