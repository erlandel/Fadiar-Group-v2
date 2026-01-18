"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import cartStore from "@/store/cartStore";
import MatterCart1Store from "@/store/matterCart1Store";
import PayerPaymentDetails from "./payerPaymentDetails";
import RecipientPaymentDetails from "./recipientPaymentDetails";
import ProductListConfirmation from "./productListConfirmation";

export default function PaymentConfirmation() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const totalPrice = cartStore((state) => state.getTotalPrice());
  const { delivery, deliveryPrice } = MatterCart1Store((state) => state.formData);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className="md:col-span-2 xl:col-span-1">
          <ProductListConfirmation />
        </div>

        <div className="w-full max-w-120 mx-auto md:mx-0">
          <RecipientPaymentDetails />
        </div>

        <div className="w-full max-w-120 mx-auto md:mx-0">
          <div>
            <PayerPaymentDetails />
          </div>

          <div className=" mt-10">
            <div>
              <h5 className="text-primary font-bold text-xl pb-1">IMPORTE</h5>
              <div className="w-full  border-b-2 border-gray"></div>
            </div>

            <div>
              <div className="mb-4 mt-4 ">
                <div className="bg-[#F5F7FA] rounded-xl overflow-hidden">
                  {mounted && delivery && (
                    <div className="p-4 space-y-6">
                      <div className="flex justify-between items-center  text-[#022954]">
                        <span className="text-md">Subtotal:</span>
                        <span className="font-medium">
                          $ {totalPrice.toFixed(2)} USD
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-[#022954]">
                          <span className="text-md">Domicilio:</span>
                          <span className="font-medium whitespace-nowrap text-xl">
                            $ {(deliveryPrice || 0).toFixed(2)} USD
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-2 py-4  bg-[#E2E6EA]">
                    <span className="font-bold text-[#022954] text-2xl">
                      Total
                    </span>
                    <span className="text-xl font-bold text-[#022954]">
                      $ {(mounted ? totalPrice + (delivery ? (deliveryPrice || 0) : 0) : 0).toFixed(2)}{" "}
                      <span className="text-2xl font-normal">USD</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between space-x-2">
              <div className="w-full">
                <button
                  className="bg-white text-primary border border-primary py-3 w-full font-semibold rounded-xl hover:scale-103 transition cursor-pointer"
                  onClick={() => router.back()}
                >
                  Atrás
                </button>
              </div>
              <div className="w-full">
                <button className="bg-[#022954] text-white py-3 w-full font-semibold rounded-xl hover:scale-103 transition cursor-pointer">
                  Continuar
                </button>
              </div>
            </div>
          </div>

        </div>


      </div>
    </>
  );
}
