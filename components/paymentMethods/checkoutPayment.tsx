"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useBuyerDetailsContext } from "../../contexts/BuyerDetailsContext";
import BuyerDetailsStore from "../../store/buyerDetailsStore";
import cartStore from "../../store/cartStore";
import MatterCart1Store from "../../store/matterCart1Store";

export default function CheckoutPayment() {
  const router = useRouter();
  const { validateForm, formData } = useBuyerDetailsContext();
  const [isClient, setIsClient] = useState(false);

  // Evitar error de hidratación
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Obtener precios del carrito y estado de domicilio solo en el cliente
  const subtotal = isClient ? cartStore.getState().getTotalPrice() : 0;
  const deliveryData = isClient ? MatterCart1Store.getState().formData : { delivery: false, deliveryPrice: 0 };
  const delivery = deliveryData.delivery;
  const deliveryCost = delivery ? (deliveryData.deliveryPrice || 5) : 0;
  const total = subtotal + deliveryCost;

  // Function to handle continue button
  const handleContinue = () => {
    if (validateForm()) {
      console.log("Form data is valid:", formData);

      const paymentMethod = BuyerDetailsStore.getState().buyerDetails.paymentMethod;

      const completeData = {
        firstName: formData.firstName,
        lastName: `${formData.lastName1 || ""} ${formData.lastName2 || ""}`.trim(),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        note: formData.note,
        paymentMethod: paymentMethod || "Tarjeta de Crédito/Débito",
      };

      BuyerDetailsStore.getState().setBuyerDetails(completeData);

      router.push("/cart4");
      console.log("Datos guardados en el store:", completeData);
      console.log("Método de pago:", paymentMethod);
    } else {
      console.log("Form validation failed");
    }
  };

  // Function to handle back button
  const handleBack = () => {
    console.log("Atrás clicked - going back");
    router.back();
  };

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

        <div className="mb-7">
          <div className="bg-[#F5F7FA] rounded-xl overflow-hidden">
            {deliveryCost > 0 && (
              <>
                <div className="flex justify-between items-center p-6 text-[#022954]">
                  <span className="text-md">Subtotal:</span>
                  <span className="font-medium text-xl">$ {subtotal} USD</span>
                </div>

                <div>
                  <div className="flex justify-between items-center gap-6 xl:gap-0 px-6 py-4 text-[#022954]">
                    <span className="text-md">Domicilio:</span>
                    <span className="font-medium whitespace-nowrap text-xl">$ {deliveryCost} USD</span>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between items-center p-4 py-6 bg-[#E2E6EA]">
              <span className="font-bold text-[#022954] text-xl">Total</span>
              <span className="text-xl font-bold text-[#022954]">
                $ {total} <span className="text-xl font-normal">USD</span>
              </span>
            </div>
          </div>


        </div>

        <div className="flex justify-between space-x-4">
          <div className="w-full">
            <button 
              onClick={handleBack}
              className="bg-white text-primary border border-primary py-4 w-full font-semibold rounded-xl hover:scale-103 transition cursor-pointer"
            >
              Atrás
            </button>
          </div>
          <div className="w-full">
            <button 
              onClick={handleContinue}
              className="bg-[#022954] text-white py-4 w-full font-semibold rounded-xl hover:scale-103 transition cursor-pointer"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
