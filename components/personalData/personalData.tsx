"use client";
import { useState } from "react";
import { InputField } from "../inputField/inputField";
import PhoneInput from "../phoneInput/phoneInput";
import { Loader, Pencil, Trash2 } from "lucide-react";
import { usePersonalData } from "../../hooks/myProfileRequests/usePersonalData";
import { useGetAddresses } from "../../hooks/addressRequests/useGetAddresses";
import ModalAddress from "../modal/modalAddress/modalAddress";
import { useAddAddress } from "../../hooks/addressRequests/useAddAddress";
import { useEditAddress } from "../../hooks/addressRequests/useEditAddress";
import { useDeleteAddress } from "../../hooks/addressRequests/useDeleteAddress";

export default function PersonalData() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [initialAddress, setInitialAddress] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    formData,
    errors,
    handleInputChange,
    handlePhoneChange,
    handleSavePersonalData,
    handleUpdatePassword,
    isPersonalDataPending,
    isPasswordPending,
  } = usePersonalData();

  const {
    addresses,
    isLoading: isLoadingAddresses,
    isError: isErrorAddresses,
  } = useGetAddresses();

  const { addAddressMutation, isPending: isAddingAddress } = useAddAddress();
  const { editAddressMutation, isPending: isEditingAddress } = useEditAddress();
  const { deleteAddressMutation } = useDeleteAddress();

  const handleOpenAddModal = () => {
    setModalMode("add");
    setInitialAddress("");
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: any) => {
    setModalMode("edit");
    setEditingId(addr.id);
    setInitialAddress(addr.direccion || "");
    setIsModalOpen(true);
  };

  const handleDeleteAddress = (id: string) => {
    setDeletingId(id);
    deleteAddressMutation(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  const handleModalConfirm = (data: {
    address: string;
    municipalityId: string;
  }) => {
    if (modalMode === "add") {
      addAddressMutation(data, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    } else if (modalMode === "edit" && editingId) {
      editAddressMutation(
        {
          id_direccion: editingId,
          municipio: data.municipalityId,
          direccion: data.address,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingId(null);
          },
        }
      );
    }
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
            <div className="w-full rounded-lg px-2 sm:px-4 py-3 bg-[#F5F7FA] text-gray-700 placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-accent mt-2 min-h-[100px] max-h-[400px] overflow-y-auto ">
              {isLoadingAddresses ? (
                <div className="flex justify-center items-center h-20">
                  <Loader className="animate-spin text-accent" />
                </div>
              ) : isErrorAddresses ? (
                <div className="text-gray-500 font-bold text-center py-4 text-sm">
                  No hay direcciones registradas
                </div>
              ) : addresses && addresses.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {addresses.map((addr: any) => (
                    <div
                      key={addr.id}
                      className="flex flex-col justify-between  bg-white p-3 rounded-md shadow-sm border border-gray-100 group hover:border-accent/30 transition-all text-sm sm:text-base "
                    >
                      <div className="w-full flex justify-between items-start">
                        <div>
                          <div className="gap-1">
                            <span className="text-primary font-bold">
                              Provincia:
                            </span>
                            <span className=" ml-0.5 text-gray-600  py-0.5 rounded-full">
                              {addr.provincia}
                            </span>
                          </div>

                          <div className="gap-1 ">
                            <span className="text-primary font-bold">
                              Municipio:
                            </span>
                            <span className=" ml-0.5 text-gray-600  py-0.5 ">
                              {addr.municipio}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="text-[#D69F04] cursor-pointer"
                            title="Editar"
                            onClick={() => handleOpenEditModal(addr)}
                          >
                            <Pencil className="w-5 h-5 sm:w-6 sm:h-6" />
                          </button>
                          {deletingId === addr.id ? (
                            <Trash2
                              className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer text-red-500 transition-colors
                                animate__animated  animate__flash animate__infinite"
                            />
                          ) : (
                            <button
                              type="button"
                              className="text-red-500 transition-colors cursor-pointer"
                              title="Eliminar"
                              onClick={() => handleDeleteAddress(addr.id)}
                            >
                              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div >
                        <span className="text-primary font-bold">
                          Dirección:
                        </span>
                        <span className="ml-1 text-gray-800 wrap-break-word">
                          {addr.direccion}
                        </span>
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
        initialValue={initialAddress}
        initialProvince={addresses?.find((a: any) => a.id === editingId)?.provincia}
        initialMunicipalityId={addresses?.find((a: any) => a.id === editingId)?.municipioId ?? null}
        onConfirm={(value) => handleModalConfirm(value)}
        isPending={modalMode === "add" ? isAddingAddress : isEditingAddress}
      />
    </>
  );
}
