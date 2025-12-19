"use client";
import { useState } from "react";
import { InputField } from "../inputField/inputField";
import PhoneInput from "../phoneInput/phoneInput";

export default function PersonalData() {
  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneCountry: "",
    address: "",
   password: "",
   confirmPassword: "",
  });

  // Function to handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle phone changes
  const handlePhoneChange = (value: string, countryCode: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
      phoneCountry: countryCode,
    }));
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center w-full">
          <div>
            <h5 className="text-primary font-bold text-xl">Datos personales</h5>
          </div>

          <div>
            <button className="text-[#D69F04] text-md font-bold cursor-pointer">
              Guradar
            </button>
          </div>
        </div>

        <div className="mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName">Nombre</label>
              <InputField
                type="text"
                placeholder="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName">Apellidos</label>
              <InputField
                type="text"
                placeholder="Apellidos"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone">Teléfono</label>
              <PhoneInput
                phoneValue={formData.phone}
                countryCode={formData.phoneCountry}
                onChange={handlePhoneChange}
                placeholder="Teléfono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email">Correo Electrónico</label>
              <InputField
                type="email"
                placeholder="Correo"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center w-full">
            <div>
              <h5 className="text-primary font-bold text-xl">Dirección</h5>
            </div>

            <div>
              <button className="text-[#D69F04] text-md font-bold cursor-pointer">
                Guradar
              </button>
            </div>
          </div>

          <div className="mt-3">
            <label htmlFor="address">Dirección</label>
            <textarea
              placeholder="Escriba su dirección"
              rows={5}
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full rounded-2xl px-4 py-3 bg-[#F5F7FA] text-gray-700 placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center w-full">
            <div>
              <h5 className="text-primary font-bold text-xl">Contraseña</h5>
            </div>

            <div>
              <button className="text-[#D69F04] text-md font-bold cursor-pointer">
                Actualizar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Contraseña actual</label>
              <InputField
                type="password"
                placeholder="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword">Nueva contraseña</label>
              <InputField
                type="password"
                placeholder="Contraseña"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
