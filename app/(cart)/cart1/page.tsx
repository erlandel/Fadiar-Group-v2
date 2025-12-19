"use client";

import Amount from "@/component/amount/amount";
import CartCard from "@/component/cartCard/cartCard";
import { CheckoutStepper } from "@/component/ui/stepper";

import { SectionAbout3 } from "@/section/aboutUS/sectionAbout3";
import { SectionAbout4 } from "@/section/aboutUS/sectionAbout4";
import useCartStore from "@/store/cartStore";

export default function Cart1() {
  const items = useCartStore((state) => state.items); 
  const removeItem = useCartStore((state) => state.removeItem); 

  console.log(items);

  return (
    <div>
      <div className="md:px-25">
        <div className="mx-4">
          <div className="mt-10">
            <p className="text-xs text-gray-400 mb-4">
              <span className="text-gray-400">Home - </span>
              <span className="text-primary font-semibold">
                Carrito de Compras
              </span>
            </p>
            <h1 className="text-3xl text-primary font-bold">Carrito</h1>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-160 ml-2 lg:ml-20">
              <CheckoutStepper currentStep={0} />
            </div>
          </div>

          <div className="mt-20 flex flex-col justify-center items-center lg:flex-row lg:items-start gap-20">
            {/* LISTA DEL CARRITO */}
            <div className="w-full flex flex-col gap-y-3 lg:w-140">
              <div className="flex flex-col gap-y-4">
                {items.length === 0 ? (
                  <p className="text-gray-400 text-md xl:text-2xl">
                    Tu carrito está vacío.
                  </p>
                ) : (
                  items.map((item) => (
                    <CartCard
                      key={item.productId}
                      brand={item.brand}
                      price={item.price}
                      image={item.image}
                      title={item.title}
                      quantityProducts={item.quantity}
                      width="w-full"
                      padding="p-3 sm:p-4"
                      actionIcon="delete"
                      productId={item.productId}
                      onDelete={removeItem}
                    />
                  ))
                )}
              </div>
            </div>

            <div>
              <Amount />
            </div>
          </div>
        </div>

        <div className="sm:py-20">
          <SectionAbout3 />
        </div>
      </div>

      <div className="sm:hidden mt-60">
        <SectionAbout4 />
      </div>
    </div>
  );
}