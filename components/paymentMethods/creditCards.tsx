"use client";
import { useState, useEffect } from "react";
import BuyerDetailsStore from "../../store/buyerDetailsStore";
import MatterCart1Store from "../../store/matterCart1Store";
import { EmojioneDepartmentStore, EmojioneMoneyBag, StreamlineUltimateColorDataTransferCircle, TwemojiCreditCard } from "@/icons/icons";

export default function CreditCards() {
  const [selectedMethod, setSelectedMethod] = useState("Tarjeta de Crédito/Débito");
  const delivery = MatterCart1Store((state) => state.formData.delivery);

  // Cargar método de pago del store al montar
  useEffect(() => {
    const storeData = BuyerDetailsStore.getState().buyerDetails;
    const savedMethod = storeData.paymentMethod;
    
    console.log("Método de pago del store:", savedMethod);
    
    if (savedMethod && savedMethod !== selectedMethod) {
      setSelectedMethod(savedMethod);
    }
  }, []); // Solo ejecutar al montar

  // Guardar método de pago en el store cuando cambie
  useEffect(() => {
    BuyerDetailsStore.getState().setPaymentMethod(selectedMethod);
  }, [selectedMethod]);

  // Ajustar el método seleccionado si el filtro cambia
  useEffect(() => {
    if (delivery) {
      if (selectedMethod === "Recogida en Tienda") {
        setSelectedMethod("Tarjeta de Crédito/Débito");
      }
    } else {
      setSelectedMethod("Recogida en Tienda");
    }
  }, [delivery]);

  return (
    <>
      <div>
        <h5 className="text-primary font-bold text-xl">01 - Formas de Pago</h5>
    

        <div className="mt-6 flex flex-col gap-4">
          {[
            { 
              id: "visa",
              title: "Tarjeta de Crédito/Débito", 
              description: "Pago con VISA o MasterCard", 
              icon: <TwemojiCreditCard className="w-7 h-7 " /> 
            },
            { 
              id: "efectivo",
              title: "Efectivo", 
              description: "Pago al momento de la entrega", 
              icon: <EmojioneMoneyBag className="w-10 h-10 " /> 
            },
            { 
              id: "tienda",
              title: "Recogida en Tienda", 
              description: "Pago directo en el local", 
              icon: <EmojioneDepartmentStore className="w-8 h-8 text-[#022954]" /> 
            },
            { 
              id: "zelle",
              title: "Transferencia Zelle", 
              description: "Pago mediante transferencia bancaria", 
              icon: <StreamlineUltimateColorDataTransferCircle className="w-9 h-9 " /> 
            }
          ]
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
              className={`max-w-100 flex items-center justify-between gap-4 cursor-pointer p-4 border rounded-2xl h-24 transition-all focus-within:ring-0 focus-within:outline-none ${
                selectedMethod === method.title 
                  ? "border-gray-300 " 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  {method.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-[#022954] text-lg font-bold">{method.title}</span>
                  <span className="text-gray-500 text-sm">{method.description}</span>
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
