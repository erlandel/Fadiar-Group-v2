"use client";
import { useEffect } from "react";
import { InputField } from "../inputField/inputField";
import PhoneInput from "../phoneInput/phoneInput";
import { useBeneficiaryDetailsContext } from "../../contexts/BeneficiaryDetailsContext";
import BeneficiaryDetailsStore from "../../store/beneficiaryDetailsStore";

export default function BeneficiaryDetails() {
  const {
    formData,
    errors,
    handleInputChange,
    handlePhoneChange,
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
            01 - Datos del beneficiario
          </h5>
          <p className="text-[#777777] text-md mt-4">
            Persona que recibirá y será propietario del producto.
          </p>
        </div>

        <div className="space-y-6 mt-4">
          <InputField
            type="text"
            placeholder="Nombre"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}

          <InputField
            type="text"
            placeholder="Apellidos"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}

          <InputField
            type="gmail"
            placeholder="Correo Electrónico"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

          {/* Teléfono con bandera */}
          <PhoneInput
            phoneValue={formData.phoneValue}
            countryCode={formData.phoneCountry}
            onChange={handlePhoneChange}
            placeholder="Teléfono"
          />
          {errors.phoneValue && <p className="text-red-500 text-xs mt-1">{errors.phoneValue}</p>}

          <InputField
            type="text"
            placeholder="Carnet de Identidad"
            name="identityCard"
            value={formData.identityCard}
            onChange={handleInputChange}
          />
          {errors.identityCard && <p className="text-red-500 text-xs mt-1">{errors.identityCard}</p>}
        </div>

      </div>
    </>
  );
}
