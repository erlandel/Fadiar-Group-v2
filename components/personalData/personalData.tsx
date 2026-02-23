"use client";
import { useState } from "react";
import { InputField } from "../inputField/inputField";
import PhoneInput from "../phoneInput/phoneInput";
import { Loader, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { usePersonalData } from "../../hooks/myProfileRequests/usePersonalData";
import { useGetAddresses } from "../../hooks/addressRequests/useGetAddresses";
import ModalAddress from "../modal/modalAddress/modalAddress";
import { useAddAddress } from "../../hooks/addressRequests/useAddAddress";

export default function PersonalData() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

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

  const {
    addresses,
    isLoading: isLoadingAddresses,
    isError: isErrorAddresses,
  } = useGetAddresses();

  const { addAddressMutation, isPending: isAddingAddress } = useAddAddress();

  const handleOpenAddModal = () => {
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleModalConfirm = (data: {
    address: string;
    municipalityId: string;
  }) => {
    addAddressMutation(data, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

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

        <div className="mt-10">
          <div className="flex justify-between items-center w-full">
            <div>
              <h5 className="text-primary font-bold text-xl">Direcciones</h5>
            </div>

            <div>
              <button
                type="button"
                className="text-[#D69F04] text-md font-bold cursor-pointer disabled:opacity-100 disabled:cursor-pointer"
                onClick={handleOpenAddModal}
              >
                Añadir
              </button>
            </div>
          </div>

          <div className="mt-3">
            <h6>Listdo de direcciones</h6>
            <div className="w-full rounded-lg px-4 py-3 bg-[#F5F7FA] text-gray-700 placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-accent mt-2 min-h-[100px]">
              {isLoadingAddresses ? (
                <div className="flex justify-center items-center h-20">
                  <Loader className="animate-spin text-accent" />
                </div>
              ) : isErrorAddresses ? (
                <div className="text-red-500 text-center py-4 text-sm">
                  Error al cargar las direcciones
                </div>
              ) : addresses && addresses.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {addresses.map((addr: any) => (
                    <div
                      key={addr.id}
                      className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border border-gray-100 group hover:border-accent/30 transition-all"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-col  gap-2 mb-1">
                          <div className="gap-1">
                            <span className="text-primary font-bold">
                              Provincia:
                            </span>
                            <span className=" ml-0.5 text-gray-600  py-0.5 rounded-full">
                              {addr.provincia}
                            </span>
                          </div>
                          <div>
                            <span className="text-primary font-bold">
                              Municipio:
                            </span>
                            <span className=" ml-0.5 text-gray-600  py-0.5 rounded-full">
                              {addr.municipio}
                            </span>
                          </div>
                        </div>
                        <div className="flex">
                          <span className="text-primary font-bold">
                            Direccion:
                          </span>
                          <p className="ml-0.5 text-gray-800 font-medium wrap-break-word">
                            {addr.direccion}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          className="text-primary p-1.5  cursor-pointer "
                          title="Editar"
                        >
                          <Pencil className="w-6 h-6" />
                        </button>
                        <button
                          type="button"
                          className="text-red-500  p-1.5   cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4 italic text-sm">
                  No hay direcciones registradas
                </div>
              )}
            </div>
          </div>
        </div>

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
      <ModalAddress
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        onConfirm={(value) => handleModalConfirm(value)}
        isPending={isAddingAddress}
      />
    </>
  );
}
