"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import cartStore from "@/store/cartStore";
import PayerPaymentDetails from "./payerPaymentDetails";
import RecipientPaymentDetails from "./recipientPaymentDetails";
import ProductListConfirmation from "./productListConfirmation";

export default function PaymentConfirmation() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const totalPrice = cartStore((state) => state.getTotalPrice());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="flex flex-col xl:flex-row gap-4 space-y-6 xl:space-y-0">
        <div className="xl:w-1/4">
        <ProductListConfirmation />
        </div>

        <div className=" xl:w-1/4">
          <RecipientPaymentDetails />
        </div>

        <div className=" xl:w-1/4">
          <PayerPaymentDetails />
        </div>

        <div className=" max-w-100 xl:w-1/4">
          <div>
            <h5 className="text-primary font-bold text-xl  pb-1">IMPORTE</h5>
            <div className="w-full  border-b-2 border-gray"></div>
          </div>

          <div>
            <div className="mb-4 mt-4 ">
              <div className="bg-[#F5F7FA] rounded-xl overflow-hidden">
                <div className="p-4 space-y-6">
                  <div className="flex justify-between items-center  text-[#022954]">
                    <span className="text-md">Subtotal:</span>
                    <span className="font-medium">
                      $ {mounted ? totalPrice.toFixed(2) : "0.00"} USD
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[#022954]">
                      <span className="text-md">
                        Comisión por forma de pago:
                      </span>
                      <span className="font-medium whitespace-nowrap text-xl">
                        $ 5 USD
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[#022954]">
                      <span className="text-md">Costo de envio:</span>
                      <span className="font-medium whitespace-nowrap text-xl">
                        $ 10 USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 py-4  bg-[#E2E6EA]">
                  <span className="font-bold text-[#022954] text-2xl">
                    Total
                  </span>
                  <span className="text-xl font-bold text-[#022954]">
                    $ {(mounted ? totalPrice + 5 + 10 : 15).toFixed(2)}{" "}
                    <span className="text-2xl font-normal">USD</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between space-x-2">
            <div className="w-full">
              <button
                className="bg-white text-primary border border-primary py-2 w-full font-semibold rounded-xl hover:scale-103 transition cursor-pointer"
                onClick={() => router.back()}
              >
                Atrás
              </button>
            </div>
            <div className="w-full">
              <button className="bg-[#022954] text-white py-2 w-full font-semibold rounded-xl hover:scale-103 transition cursor-pointer">
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
