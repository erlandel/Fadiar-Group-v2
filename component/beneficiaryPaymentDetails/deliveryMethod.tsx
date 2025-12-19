"use client";
import { useEffect } from "react";
import { InputField } from "../inputField/inputField";
import { useBeneficiaryDetailsContext } from "../../contexts/BeneficiaryDetailsContext";
import BeneficiaryDetailsStore from "../../store/beneficiaryDetailsStore";

export default function DeliveryMethod() {
  const {
    formData,
    errors,
    handleInputChange,
    clearErrors,
    setFormData,
  } = useBeneficiaryDetailsContext();

  // Cargar datos del store al montar el componente
  useEffect(() => {
    const savedData = BeneficiaryDetailsStore.getState().beneficiaryDetails;
    
    // Solo cargar si hay datos guardados y son diferentes a los actuales
    if (savedData && JSON.stringify(savedData) !== JSON.stringify(formData)) {
      setFormData(savedData);
    }
  }, []); // Array de dependencias vacío para que solo se ejecute una vez

  return (
    <>
      <div>
        <div>
          <h5 className="text-primary font-bold text-xl">
            02 - Forma de entrega
          </h5>
          <p className="text-[#777777] text-md mt-4">
            Añadir domicilio del beneficiario
          </p>
        </div>

        <div className="space-y-6 mt-4">
          <InputField
            type="text"
            placeholder="Dirección"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}

          <textarea
            placeholder="Nota"
            rows={5}
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            className="w-full rounded-2xl px-4 py-3 bg-[#F5F7FA] text-gray-700 placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {errors.note && <p className="text-red-500 text-xs mt-1">{errors.note}</p>}
        </div>
      </div>
    </>
  );
}
