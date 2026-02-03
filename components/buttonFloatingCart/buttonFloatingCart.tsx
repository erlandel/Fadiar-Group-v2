'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ShoppingCartIcon from '../shoppingCartIcon';
import useCartStore from '@/store/cartStore';

export default function ButtonFloatingCart() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  const isVisible = mounted && totalItems >0;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push('/cart1');
      }}
      type="button"
      className={`z-100 fixed right-3 bottom-24 2xl:right-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-110 active:scale-95 animate__animated ${
        isVisible ? 'animate__fadeInRight opacity-100' : 'animate__fadeOutRight opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative">
        <ShoppingCartIcon className="h-6 w-6" />
        {mounted && totalItems > 0 && (
          <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] sm:text-xs rounded-full h-4.5 w-4.5  flex items-center justify-center font-bold">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </div>
    </button>
  );
}
