"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import MatterCart1Store from "../../store/matterCart1Store";

export default function CheckoutPayment() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Evitar error de hidratación
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Obtener precios del carrito y estado de domicilio solo en el cliente
  const deliveryData = isClient ? MatterCart1Store.getState().formData : { delivery: false, deliveryPrice: 0, stores: [] };
  
  const subtotal = isClient ? (deliveryData.stores || []).reduce((acc: number, store: any) => {
    return acc + (store.products || []).reduce((storeAcc: number, product: any) => {
      const price = parseFloat(String(product.price).replace(/[^0-9.]/g, ""));
      return storeAcc + price * product.quantity;
    }, 0);
  }, 0) : 0;

  const delivery = deliveryData.delivery;
  const deliveryCost = delivery ? (deliveryData.deliveryPrice || 0) : 0;
  const total = subtotal + deliveryCost;

  return (
    <>
      {/* FORMA DE PAGO*/}
      <div className="w-100 ">
        <div>
          <h5 className="text-primary font-bold text-xl">FORMA DE PAGO</h5>
          <div className="w-full  border-b-2 border-gray"></div>
        </div>
        <div className="relative h-20 w-full ">
          <img
            src="/images/mastercard.webp"
            alt="Mastercard"
            className="absolute top-5 right-2 h-8 w-12"
          />
        </div>
        <div>
          <h5 className="text-primary font-bold text-xl">IMPORTE</h5>
          <div className="w-full  border-b-2 border-gray"></div>
        </div>

        <div className="mb-7 mt-4">
          <div className="bg-[#F5F7FA] rounded-xl overflow-hidden">
            {isClient && delivery && (
              <>
                <div className="flex justify-between items-center p-6 text-[#022954]">
                  <span className="text-md">Subtotal:</span>
                  <span className="font-medium text-xl">$ {subtotal.toFixed(2)} USD</span>
                </div>

                <div>
                  <div className="flex justify-between items-center gap-6 xl:gap-0 px-6 py-2 text-[#022954]">
                    <span className="text-md">Domicilio:</span>
                    <span className="font-medium whitespace-nowrap text-xl">$ {deliveryCost.toFixed(2)} USD</span>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between items-center p-4 py-6 bg-[#E2E6EA]">
              <span className="font-bold text-[#022954] text-xl">Total</span>
              <span className="text-xl font-bold text-[#022954]">
                $ {total.toFixed(2)} <span className="text-xl font-normal">USD</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between space-x-4">
          <div className="w-full">
            <button 
              onClick={() => router.push("/cart1")}
              className="bg-white text-primary border border-primary py-4 w-full font-semibold rounded-xl hover:scale-103 transition cursor-pointer"
            >
              Atrás
            </button>
          </div>
          <div className="w-full">
            <button 
              onClick={() => router.push("/cart3")}
              className="bg-[#022954] text-white py-4 w-full font-semibold rounded-xl hover:scale-103 transition cursor-pointer hover:bg-[#034078] hover:shadow-lg  disabled:opacity-40"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
