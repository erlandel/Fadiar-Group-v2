"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import cartStore from "../../store/cartStore";
import { useBeneficiaryDetailsContext } from "../../contexts/BeneficiaryDetailsContext";

export default function ShippingMethod(){
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const { validateAllForms } = useBeneficiaryDetailsContext();

    // Evitar error de hidratación
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Obtener precios del carrito solo en el cliente
    const subtotal = isClient ? cartStore.getState().getTotalPrice() : 0;
    const total = isClient ? subtotal + 5 : 5;

    const handleContinue = () => {
        const isValid = validateAllForms();
        if (isValid) {
            router.push('/cart4');
        }
    };

    const handleBack = () => {
        router.back();
    };

    return(

        <>
          {/* METODO DE ENTREGA*/}
      <div className="w-full lg:w-80  2xl:w-90">
        <div>
          <h5 className="text-primary font-bold text-xl">METODO DE ENTREGA</h5>
          <div className="w-full  border-b-2 border-gray"></div>
        </div>

        <div className="text-primary">
            <p className="mb-6">Entrega a Domicilio</p>
        </div>

        <div>
          <h5 className="text-primary font-bold text-xl">FORMA DE PAGO</h5>
          <div className="w-full  border-b-2 border-gray"></div>
        </div>

        <div className="relative h-20 w-full ">
          <img
            src="/images/mastercard.svg"
            alt="Mastercard"
            className="absolute top-2  h-12 w-10"
          />
        </div>
        <div>
          <h5 className="text-primary font-bold text-xl">IMPORTE</h5>
          <div className="w-full  border-b-2 border-gray"></div>
        </div>

        <div className="mb-8">
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
              <span className="font-bold text-[#022954] text-2xl">Total</span>
              <span className="text-2xl font-bold text-[#022954]">
                $ {total} <span className="text-2xl font-normal">USD</span>
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