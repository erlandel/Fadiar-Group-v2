"use client";
import { InputField } from "../inputField/inputField";
import PhoneInput from "../phoneInput/phoneInput";
import { Loader } from "lucide-react";
import { usePersonalData } from "../../hooks/myProfileRequests/usePersonalData";

export default function PersonalData() {
  const {
    formData,
    errors,
    handleInputChange,
    handlePhoneChange,
    handleSavePersonalData,
    handleSaveAddress,
    handleUpdatePassword,
    isPersonalDataPending,
    isAddressPending,
    isPasswordPending,
  } = usePersonalData();

  return (
    <>
      <div className="w-full">
        <form onSubmit={handleSavePersonalData}>
          <div className="flex justify-between items-center w-full">
            <div>
              <h5 className="text-primary font-bold text-xl">
                Datos personales
              </h5>
            </div>

            <div>
              <button
                type="submit"
                className="text-[#D69F04] text-md font-bold cursor-pointer disabled:opacity-100 disabled:cursor-pointer"
                disabled={isPersonalDataPending}
              >
                {isPersonalDataPending ? (
                  <span className="inline-flex items-center justify-center ">
                    <Loader className="h-5 w-5 animate-spin " strokeWidth={3} />
                    Guardar
                  </span>
                ) : (
                  "Guardar"
                )}
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
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName">Apellidos</label>
                <InputField
                  type="text"
                  placeholder="Apellidos"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm">
                    {errors.lastName}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone">Teléfono</label>
                <PhoneInput
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="Teléfono"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                {errors.phone && (
                  <span className="text-red-500 text-sm">{errors.phone}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email">Correo Electrónico</label>
                <InputField
                  type="email"
                  placeholder="Correo"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email}</span>
                )}
              </div>
            </div>
          </div>
        </form>

        <form onSubmit={handleSaveAddress} className="mt-10">
          <div className="flex justify-between items-center w-full">
            <div>
              <h5 className="text-primary font-bold text-xl">Dirección</h5>
            </div>

            <div>
              <button
                type="submit"
                className="text-[#D69F04] text-md font-bold cursor-pointer disabled:opacity-100 disabled:cursor-pointer"
                disabled={isAddressPending}
              >
                {isAddressPending ? (
                  <span className="inline-flex items-center justify-center ">
                    <Loader className="h-5 w-5 animate-spin" strokeWidth={3} />
                    Guardar
                  </span>
                ) : (
                  "Guardar"
                )}
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
            {errors.address && (
              <span className="text-red-500 text-sm">{errors.address}</span>
            )}
          </div>
        </form>

        <form onSubmit={handleUpdatePassword} className="mt-10">
          <div className="flex justify-between items-center w-full">
            <div>
              <h5 className="text-primary font-bold text-xl">Contraseña</h5>
            </div>

            <div>
              <button
                type="submit"
                className="text-[#D69F04] text-md font-bold cursor-pointer disabled:opacity-100 disabled:cursor-pointer"
                disabled={isPasswordPending}
              >
                {isPasswordPending ? (
                  <span className="inline-flex items-center justify-center ">
                    <Loader className="h-5 w-5 animate-spin" strokeWidth={3} />
                    Actualizar
                  </span>
                ) : (
                  "Actualizar"
                )}
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
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword">Nueva contraseña</label>
              <InputField
                type="password"
                placeholder="Nueva contraseña"
                name="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
