"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useBuyerDetailsContext } from "../../contexts/BuyerDetailsContext";
import BuyerDetailsStore from "../../store/buyerDetailsStore";
import cartStore from "../../store/cartStore";

export default function CheckoutPayment() {
  const router = useRouter();
  const { validateForm, formData } = useBuyerDetailsContext();
  const [isClient, setIsClient] = useState(false);

  // Evitar error de hidratación
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Obtener precios del carrito solo en el cliente
  const subtotal = isClient ? cartStore.getState().getTotalPrice() : 0;
  const total = isClient ? subtotal + 5 : 5;

  // Function to handle continue button
  const handleContinue = () => {
    if (validateForm()) {
      console.log("Form data is valid:", formData);
      
      // Obtener método de pago del store
      const paymentMethod = BuyerDetailsStore.getState().buyerDetails.paymentMethod;
      
      // Guardar datos completos en el store (incluyendo método de pago)
      const completeData = {
        ...formData,
        paymentMethod: paymentMethod || "Tarjetas de crédito o débito", // Valor por defecto si no existe
      };
      
      BuyerDetailsStore.getState().setBuyerDetails(completeData);
      
      // Navigate to next step or payment
      router.push('/cart3');
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
      <div className="w-full xl:w-65  2xl:w-90 ">
        <div>
          <h5 className="text-primary font-bold text-xl">FORMA DE PAGO</h5>
          <div className="w-full  border-b-2 border-gray"></div>
        </div>
        <div className="relative h-20 w-full ">
          <img
            src="/images/mastercard.svg"
            alt="Mastercard"
            className="absolute top-2 right-2 h-12 w-10"
          />
        </div>
        <div>
          <h5 className="text-primary font-bold text-xl">IMPORTE</h5>
          <div className="w-full  border-b-2 border-gray"></div>
        </div>

        <div className="mb-7">
          <div className="bg-[#F5F7FA] rounded-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 text-[#022954]">
              <span className="text-md">Subtotal:</span>
              <span className="font-medium text-xl">$ {subtotal} USD</span>
            </div>
             

            <div>
              <div className="flex justify-between items-center px-6 py-4 text-[#022954]">
                <span className="text-md">Comisión por forma de pago:</span>
                <span className="font-medium whitespace-nowrap text-xl">$ 5 USD</span>
              </div>
            </div>

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
