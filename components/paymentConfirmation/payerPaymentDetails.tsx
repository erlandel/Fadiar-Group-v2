"use client";

import BuyerDetailsStore from "@/store/buyerDetailsStore";
import { useRouter } from "next/navigation";

export default function PayerPaymentDetails() {
  const router = useRouter();
  const buyerDetails = BuyerDetailsStore((state) => state.buyerDetails);

  return (
    <div className="w-full  xl:min-w-full wrap-break-word">
      <div>
        <h5 className="text-primary font-bold text-xl ml-4 pb-1">
          DATOS DE PAGO
        </h5>
        <div className="w-full  border-b-2 border-gray"></div>
      </div>

      <div className="space-y-3 mt-4 ">
        <div className="ml-4">
          <p className="text-[gray] ">
            Método de pago:{" "}
            <span className="text-primary wrap-break-word">{buyerDetails.paymentMethod}</span>
          </p>
        </div>

        <div className="w-full  border-b-2 border-gray"></div>

        <div className="ml-4">
          <p className="text-accent cursor-pointer" onClick={() => router.push('/cart2')}>Editar método de pago</p>
        </div>
      </div>
    </div>
  );
}