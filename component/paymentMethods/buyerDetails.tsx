"use client";
import { useEffect } from "react";
import { InputField } from "../inputField/inputField";
import PhoneInput from "../phoneInput/phoneInput";
import { useBuyerDetailsContext } from "../../contexts/BuyerDetailsContext";
import BuyerDetailsStore from "../../store/buyerDetailsStore";

export default function BuyerDetails() {
  const {
    formData,
    errors,
    handleInputChange,
    handlePhoneChange,
    validateForm,
    clearErrors,
    setFormData,
  } = useBuyerDetailsContext();

  // Cargar datos del store al montar el componente
  useEffect(() => {
    const savedData = BuyerDetailsStore.getState().buyerDetails;
    
    // Solo cargar si hay datos guardados y son diferentes a los actuales
    if (savedData && JSON.stringify(savedData) !== JSON.stringify(formData)) {
      setFormData(savedData);
    }
  }, []); // Array de dependencias vacío para que solo se ejecute una vez

  return (
    <>
      <div >
        <h5 className="text-primary font-bold text-xl ">
          02 - Datos del comprador
        </h5>
        <p className="text-[#777777] text-md mt-4">
          Propietario de la cuenta desde donde se realiza la compra
        </p>
        <div className="w-full space-y-6 mt-4">
          {/* 2 column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputField
                type="text"
                placeholder="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <InputField
                type="text"
                placeholder="Apellidos"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
            <div>
              <InputField
                type="email"
                placeholder="Correo Electrónico"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone with flag */}
            <div>
              <PhoneInput
                phoneValue={formData.phoneValue}
                countryCode={formData.phoneCountry}
                onChange={handlePhoneChange}
                placeholder="Teléfono"
              />
              {errors.phoneValue && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneValue}</p>
              )}
            </div>
          </div>

          <div>
            <InputField
              type="text"
              placeholder="Dirección"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* Note */}
          <textarea
            placeholder="Nota"
            rows={5}
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            className="w-full rounded-2xl px-4 py-3 bg-[#F5F7FA] text-gray-700 placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>
    </>
  );
}
