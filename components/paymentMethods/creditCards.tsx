"use client";
import { useState, useEffect } from "react";
import BuyerDetailsStore from "../../store/buyerDetailsStore";

export default function CreditCards() {
  const [selectedMethod, setSelectedMethod] = useState("Tarjetas de crédito o débito");

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

  return (
    <>
      <div >
        <h5 className="text-primary font-bold text-xl">01 - Forma de pago</h5>

        <div className="w-full lg:w-90 xl:w-80 2xl:w-100 h-36 bg-snow mt-5 border border-gray rounded-xl p-4 shadow-sm font-bold flex">
          <div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer relative">
                <input
                  type="radio"
                  name="metodo"
                  value="Tarjetas de crédito o débito"
                  checked={selectedMethod === "Tarjetas de crédito o débito"}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="peer absolute opacity-0"
                />

                {/* Círculo - ahora es hermano directo del input */}
                <span className="w-6 h-6 rounded-full border-3 border-[#022954] flex items-center justify-center peer-checked:after:w-3 peer-checked:after:h-3 peer-checked:after:rounded-full peer-checked:after:bg-[#022954] peer-checked:after:block after:hidden transition" />
              </label>
            </div>
          </div>

          <div>
            <div className="ml-4">
              <p className="text-[#1E1E1E] text-lg">
                Tarjetas de crédito o débito{" "}
              </p>
              <p className="text-[gray] text-[13px]">
                Comisión por forma de pago: 4%
              </p>
            </div>

            <div>
              <img
                src="/images/creditCards.svg"
                alt="Visa"
                className="h-18 mr-4 "
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-90 xl:w-80 2xl:w-100 h-36 bg-snow mt-5 border border-gray rounded-xl p-6 shadow-sm font-bold flex">
          <div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer relative">
                <input
                  type="radio"
                  name="metodo"
                  value="Saldo TropiPay"
                  checked={selectedMethod === "Saldo TropiPay"}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="peer absolute opacity-0"
                />

                {/* Círculo - ahora es hermano directo del input */}
                <span className="w-6 h-6 rounded-full border-3 border-[#022954] flex items-center justify-center peer-checked:after:w-3 peer-checked:after:h-3 peer-checked:after:rounded-full peer-checked:after:bg-[#022954] peer-checked:after:block after:hidden transition" />
              </label>
            </div>
          </div>

          <div>
            <div className="ml-4">
              <p className="text-[#1E1E1E] text-lg">Saldo TropiPay</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
