"use client";

import {  useRef } from "react";
import { InputField } from "../inputField/inputField";
import PhoneInput from "../phoneInput/phoneInput";
import { Check, ChevronDown, X } from "lucide-react";
import { FormData as MatterFormData } from "@/store/matterCart1Store";
import { NotoV1Information } from "@/icons/icons";

type MunicipalityData = {
  id: number;
  municipio: string;
};

type ModalRecipientPaymentDetailsProps = {
  show: boolean;
  onClose: () => void;
  editData: MatterFormData;
  setEditData: React.Dispatch<React.SetStateAction<MatterFormData>>;
  errors: Partial<Record<keyof MatterFormData, string>>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof MatterFormData, string>>>>;
  isClient: boolean;
  storeProvince: string;
  municipalitiesWithCommonDelivery: MunicipalityData[];
  municipalitiesRef: React.RefObject<HTMLDivElement | null>;
  openMunicipalities: boolean;
  setOpenMunicipalities: React.Dispatch<React.SetStateAction<boolean>>;
  handleMunicipalityChange: (
    mun: MunicipalityData,
    onSelect?: (mun: MunicipalityData) => void,
  ) => void;
  handlePhoneChange: (value: string) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  lastNameInput: string;
  setLastNameInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function ModalRecipientPaymentDetails({
  show,
  onClose,
  editData,
  setEditData,
  errors,
  setErrors,
  isClient,
  storeProvince,
  municipalitiesWithCommonDelivery,
  municipalitiesRef,
  openMunicipalities,
  setOpenMunicipalities,
  handleMunicipalityChange,
  handlePhoneChange,
  handleInputChange,
  lastNameInput,
  setLastNameInput,
  handleSubmit,
}: ModalRecipientPaymentDetailsProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40">
      <div
        ref={modalRef}
        className="relative w-full max-w-xl mx-4 bg-white rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#022954]">Editar datos de entrega</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-2">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="modal-delivery"
                className="peer h-4 w-4 shrink-0 rounded-sm border border-gray-400 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#022954] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-[#022954] checked:border-[#022954] appearance-none"
                checked={editData.delivery}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setEditData((prev) => ({ ...prev, delivery: isChecked }));
                  if (!isChecked && errors.address) {
                    setErrors((prev) => ({ ...prev, address: undefined }));
                  }
                }}
              />
              <Check className="absolute h-3 w-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5" />
            </div>

            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="modal-delivery"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-500"
              >
                ¿Necesitas entrega a domicilio?
              </label>
            </div>
          </div>

          {isClient && editData.delivery && (
            <div>
              <div className="w-full flex justify-center mt-3">
                <p className="flex sm:items-center text-accent text-md">
                  <NotoV1Information className="h-4.5 w-4.5 mr-0.5 min-w-5 mt-1 sm:mt-0" />
                  Revise los municipios a los cuales se está haciendo domicilio.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-md mt-3 pb-6">
                <div id="modal-field-firstName">
                  <label className="ml-2 font-medium text-gray-600">Nombre</label>
                  <InputField
                    type="text"
                    placeholder="Nombre"
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleInputChange}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1 ml-2">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div id="modal-field-lastName">
                  <label className="ml-2 font-medium text-gray-600">Apellidos</label>
                  <InputField
                    type="text"
                    placeholder="Apellidos"
                    name="lastName"
                    value={lastNameInput}
                    onChange={handleInputChange}
                  />
                  {errors.lastName1 && (
                    <p className="text-red-500 text-xs mt-1 ml-2">
                      {errors.lastName1}
                    </p>
                  )}
                  {!errors.lastName1 && errors.lastName2 && (
                    <p className="text-red-500 text-xs mt-1 ml-2">
                      {errors.lastName2}
                    </p>
                  )}
                </div>

                <div id="modal-field-province">
                  <label className="ml-2 font-medium text-gray-600">Provincia</label>
                  <InputField
                    type="text"
                    name="province"
                    value={isClient ? storeProvince : ""}
                    readOnly
                    placeholder="Provincia"
                  />
                  {errors.province && (
                    <p className="text-red-500 text-xs mt-1 ml-2">
                      {errors.province}
                    </p>
                  )}
                </div>

                <div
                  className="flex flex-col"
                  id="modal-field-municipality"
                >
                  <label className="ml-2 font-medium text-gray-600">Municipio</label>
                  <div className="relative z-10" ref={municipalitiesRef}>
                    <div
                      tabIndex={0}
                      className="flex h-12 items-center justify-between rounded-2xl border border-gray-100 bg-[#F5F7FA] px-3 cursor-pointer focus-within:ring-2 focus-within:ring-accent focus:outline-none focus:ring-2 focus:ring-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (storeProvince) {
                          setOpenMunicipalities((prev) => !prev);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          if (storeProvince) {
                            setOpenMunicipalities((prev) => !prev);
                          }
                        }
                      }}
                    >
                      <span
                        className={
                          editData.municipality ? "text-gray-800" : "text-gray-500"
                        }
                      >
                        {editData.municipality || "Seleccione un municipio"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>

                    {openMunicipalities && (
                      <ul className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[100] max-h-40 overflow-y-auto overflow-x-hidden">
                        {municipalitiesWithCommonDelivery.map((mun) => (
                          <li
                            key={mun.id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors text-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMunicipalityChange(mun, (m) => {
                                const update = { municipality: m.municipio };
                                setEditData((prev) => ({ ...prev, ...update }));
                                setErrors((prev) => ({
                                  ...prev,
                                  municipality: undefined,
                                }));
                              });
                              setOpenMunicipalities(false);
                            }}
                          >
                            {mun.municipio}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {errors.municipality && (
                    <p className="text-red-500 text-xs mt-1 ml-2">
                      {errors.municipality}
                    </p>
                  )}
                </div>

                <div className="space-y-2" id="modal-field-phone">
                  <label className="ml-2 font-medium text-gray-600">Teléfono</label>
                  <div className="relative">
                    <PhoneInput
                      value={editData.phone}
                      onChange={handlePhoneChange}
                      placeholder="Teléfono"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 ml-2">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div id="modal-field-address">
                  <label className="ml-2 font-medium text-gray-600">Dirección</label>
                  <InputField
                    type="text"
                    placeholder="Dirección"
                    name="address"
                    value={editData.address}
                    onChange={handleInputChange}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1 ml-2">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-primary border border-primary h-11 px-6 font-semibold rounded-xl hover:scale-103 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#022954] text-white h-11 px-6 font-semibold rounded-xl hover:bg-[#034078] hover:shadow-lg hover:scale-103 transition cursor-pointer"
            >
              Guardar 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
