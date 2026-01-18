"use client";
import { useState, useEffect } from "react";
import BuyerDetailsStore from "../../store/buyerDetailsStore";
import MatterCart1Store from "../../store/matterCart1Store";
import { EmojioneDepartmentStore, TwemojiCreditCard } from "@/icons/icons";

export default function CreditCards() {
  const [selectedMethod, setSelectedMethod] = useState("Tarjeta de Crédito/Débito");
  const delivery = MatterCart1Store((state) => state.formData.delivery);

  const paymentMethods = [
    { 
      id: "visa",
      title: "Tarjeta de Crédito/Débito", 
      description: "Pago con VISA o MasterCard", 
      icon: <TwemojiCreditCard className="w-9 h-9 " /> 
    },
    { 
      id: "efectivo",
      title: "Efectivo o Transferencia", 
      description: "Pago al momento de la entrega", 
      icon: <img src="/images/MoneyTransfer.webp" alt="Efectivo o Transferencia" width={40} height={40} className="object-contain" /> 
    },
    { 
      id: "tienda",
      title: "Recogida en Tienda", 
      description: "Pago directo en el local", 
      icon: <EmojioneDepartmentStore className="w-9 h-9 text-[#022954]" /> 
    },
    { 
      id: "zelle",
      title: "Zelle", 
      description: "Pago mediante transferencia bancaria", 
      icon: <img src="/images/Zelle.webp" alt="Efectivo o Transferencia" width={37} height={37} className="object-contain" /> 
    }
  ];

  // Cargar método de pago del store al montar
  useEffect(() => {
    const storeData = BuyerDetailsStore.getState().buyerDetails;
    const savedMethod = storeData.paymentMethod;
    
    if (savedMethod) {
      // Normalizar el método guardado (por si acaso hay espacios extras)
      const normalizedSaved = savedMethod.trim();
      if (normalizedSaved !== selectedMethod) {
        setSelectedMethod(normalizedSaved);
      }
    }
  }, []);

  // Ajustar el método seleccionado según delivery y asegurar que siempre haya uno válido
  useEffect(() => {
    const visibleMethods = paymentMethods.filter((method) => 
      delivery ? method.id !== "tienda" : method.id === "tienda"
    );

    const isSelectedVisible = visibleMethods.some(m => m.title === selectedMethod);
    
    if (!isSelectedVisible && visibleMethods.length > 0) {
      setSelectedMethod(visibleMethods[0].title);
    }
  }, [delivery, selectedMethod]);

  // Guardar método de pago en el store cuando cambie
  useEffect(() => {
    if (selectedMethod) {
      BuyerDetailsStore.getState().setPaymentMethod(selectedMethod);
    }
  }, [selectedMethod]);

  return (
    <>
      <div className="w-full">
        <h5 className="text-primary font-bold text-2xl">01 - Formas de Pago</h5>
    

        <div className="mt-6 flex flex-col gap-4">
          {paymentMethods
          .filter((method) => {
            if (delivery) {
              return method.id !== "tienda";
            } else {
              return method.id === "tienda";
            }
          })
          .map((method) => (
            <label 
              key={method.id} 
              className={`w-full sm:max-w-100  lg:w-100  flex items-center justify-between gap-4 cursor-pointer p-4  border rounded-2xl h-30 transition-all focus-within:ring-0 focus-within:outline-none ${
                selectedMethod === method.title 
                  ? "border-gray-300 " 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  {method.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-[#022954] text-lg sm:text-xl font-bold">{method.title}</span>
                  <span className="text-gray-500 text-sm sm:text-md">{method.description}</span>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.title}
                  checked={selectedMethod === method.title}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="peer absolute opacity-0 w-6 h-6 cursor-pointer"
                />
                <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-[#022954] peer-checked:after:w-3 peer-checked:after:h-3 peer-checked:after:rounded-full peer-checked:after:bg-[#022954] peer-checked:after:block after:hidden transition-all" />
              </div>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
