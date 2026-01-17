"use client";
import { useEffect, useState } from "react";
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
    setFormData,
  } = useBuyerDetailsContext();

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    const trimmed = value.trim().replace(/\s+/g, " ");

    if (trimmed.length === 0) {
      setFormData({
        lastName1: "",
        lastName2: "",
      });
      setLastNameError("");
      return;
    }

    const parts = trimmed.split(" ");
    const lastName1 = parts.shift() ?? "";
    const lastName2 = parts.join(" ");

    setFormData({
      lastName1,
      lastName2,
    });

    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    let error = "";
    if (lastName1.trim().length === 0) {
      error = "Ingresa el primer apellido";
    } else if (!nameRegex.test(lastName1)) {
      error = "Error de escritura";
    } else if (lastName2.trim().length === 0) {
      error = "Ingresa el segundo apellido";
    } else if (!nameRegex.test(lastName2)) {
      error = "Error de escritura";
    }

    setLastNameError(error);
  };

  // Cargar datos del store al montar el componente
  useEffect(() => {
    const savedData = BuyerDetailsStore.getState().buyerDetails;
    
    if (savedData) {
      let lastName1 = "";
      let lastName2 = "";

      if (savedData.lastName) {
        const parts = savedData.lastName.trim().replace(/\s+/g, " ").split(" ");
        lastName1 = parts.shift() ?? "";
        lastName2 = parts.join(" ");
        setLastName(`${lastName1} ${lastName2}`.trim());
      }

      setFormData({
        firstName: savedData.firstName ?? "",
        lastName1,
        lastName2,
        email: savedData.email ?? "",
        phone: savedData.phone ?? "+53 ",
        address: savedData.address ?? "",
        note: savedData.note ?? "",
      });
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
                <p className="text-red-500 text-xs mt-1 ml-2">{errors.firstName}</p>
              )}
            </div>
            <div>
              <InputField
                type="text"
                placeholder="Apellidos"
                name="lastName"
                value={lastName}
                onChange={handleLastNameChange}
              />
              {(lastNameError || errors.lastName1 || errors.lastName2) && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {lastNameError || errors.lastName1 || errors.lastName2}
                </p>
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
                <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>
              )}
            </div>

            {/* Phone with flag */}
            <div>
              <PhoneInput
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="Teléfono"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1  ml-2">{errors.phone}</p>
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
              <p className="text-red-500 text-xs mt-1 ml-2">{errors.address}</p>
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
