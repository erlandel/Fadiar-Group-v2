import  { useState, useEffect } from "react";
import { X, Loader, ChevronDown } from "lucide-react";
import useLocation from "@/hooks/locationRequests/useLocation";

interface ModalAddressProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  initialValue?: string;
  initialProvince?: string;
  initialMunicipalityId?: string | null;
  onConfirm: (data: { address: string; municipalityId: string }) => void;
  isPending?: boolean;
}

export default function ModalAddress({
  isOpen,
  onClose,
  mode,
  initialValue = "",
  initialProvince,
  initialMunicipalityId = null,
  onConfirm,
  isPending = false,
}: ModalAddressProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const {
    data,
    loading,
    selectedProvince,
    selectedMunicipality,
    selectedMunicipalityId,
    municipalities,
    handleProvinceChange,
    handleMunicipalityChange,
    setSelectedProvince,
    setSelectedProvinceId,
    setSelectedMunicipality,
    setSelectedMunicipalityId,
    openProvinces,
    setOpenProvinces,
    openMunicipalities,
    setOpenMunicipalities,
    provincesRef,
    municipalitiesRef,
  } = useLocation({ useGlobalStore: false });

  const [validationError, setValidationError] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "add") {
      setSelectedProvince("");
      setSelectedProvinceId(null);
      setSelectedMunicipality("");
      setSelectedMunicipalityId(null);
      setOpenProvinces(false);
      setOpenMunicipalities(false);
      setValidationError(false);
      setSubmitAttempted(false);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen) return;
    if (mode !== "edit") return;
    if (!data || data.length === 0) return;
    if (!initialProvince) return;
    // Preseleccionar provincia
    const prov = data.find((p) => p.provincia === initialProvince);
    if (prov) {
      setSelectedProvince(prov.provincia);
      setSelectedProvinceId(prov.id);
      // Preseleccionar municipio si lo tenemos
      if (initialMunicipalityId) {
        const mun = prov.municipios.find((m) => m.id === initialMunicipalityId);
        if (mun) {
          setSelectedMunicipality(mun.municipio);
          setSelectedMunicipalityId(mun.id);
        }
      }
    }
  }, [isOpen, mode, initialProvince, initialMunicipalityId, data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/50 ">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative shadow-lg mx-2">
        <div>
          <div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              <X className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>

          <div>
            <h5 className="text-primary font-bold text-2xl">
              {mode === "add" ? "Añadir Dirección" : "Editar Dirección"}
            </h5>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedMunicipalityId && value) {
              onConfirm({
                address: value,
                municipalityId: selectedMunicipalityId,
              });
            } else {
              setValidationError(true);
              setSubmitAttempted(true);
            }
          }}
        >
          <div className="mt-4 w-full">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex flex-col relative w-full" ref={provincesRef}>
                <label className="mb-1 text-sm font-medium">Provincia</label>
                <div
                  tabIndex={0}
                  className="flex h-12 items-center justify-between rounded-xl border border-gray-100 bg-[#F5F7FA] px-3 cursor-pointer focus-within:ring-2 focus-within:ring-accent focus:outline-none focus:ring-2 focus:ring-accent w-full"
                  onClick={() => setOpenProvinces((prev) => !prev)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenProvinces((prev) => !prev);
                    }
                  }}
                >
                  <span
                    className={
                      selectedProvince ? "text-gray-800" : "text-gray-500"
                    }
                  >
                    {selectedProvince || "Seleccione una provincia"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>

                {validationError && !selectedProvince && (
                  <span className="text-red-500 text-sm mt-1 ml-2">
                    Este campo es requerido
                  </span>
                )}

                {openProvinces && (
                  <ul className="absolute w-full mt-20 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-60 overflow-auto">
                    {data.map((prov) => (
                      <li
                        key={prov.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors text-gray-700"
                        onClick={() => {
                          handleProvinceChange(prov, () => {
                            setOpenProvinces(false);
                            setValidationError(false);
                            setSubmitAttempted(false);
                          });
                        }}
                      >
                        {prov.provincia}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Municipio */}
              <div
                className="flex flex-col relative w-full"
                ref={municipalitiesRef}
              >
                <label className="mb-1 text-sm font-medium">Municipio</label>
                <div
                  tabIndex={0}
                  className="flex h-12 items-center justify-between rounded-2xl border border-gray-100 bg-[#F5F7FA] px-3 cursor-pointer focus-within:ring-2 focus-within:ring-accent focus:outline-none focus:ring-2 focus:ring-accent w-full"
                  onClick={() => {
                    if (selectedProvince) {
                      setOpenMunicipalities(!openMunicipalities);
                    } else {
                      setValidationError(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (selectedProvince) {
                        setOpenMunicipalities(!openMunicipalities);
                      } else {
                        setValidationError(true);
                      }
                    }
                  }}
                >
                  <span
                    className={
                      selectedMunicipality ? "text-gray-800" : "text-gray-500"
                    }
                  >
                    {selectedMunicipality || "Seleccione un municipio"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>

                {submitAttempted && !selectedMunicipality && (
                  <span className="text-red-500 text-sm mt-1 ml-2">
                    Este campo es requerido
                  </span>
                )}

                {openMunicipalities && (
                  <ul className="absolute w-full mt-20 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-60 overflow-auto">
                    {municipalities.map((mun) => (
                      <li
                        key={mun.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors text-gray-700"
                        onClick={() => {
                          handleMunicipalityChange(mun, () => {
                            setOpenMunicipalities(false);
                            setValidationError(false);
                            setSubmitAttempted(false);
                          });
                        }}
                      >
                        {mun.municipio}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center w-full mt-4 md:mt-6">
            <div>
              <div>
                <button
                  type="submit"
                  className="text-[#D69F04] text-md font-bold cursor-pointer disabled:opacity-100 disabled:cursor-pointer"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="inline-flex items-center justify-center ">
                      <Loader
                        className="h-5 w-5 animate-spin text-white"
                        strokeWidth={3}
                      />
                      Guardar
                    </span>
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <label htmlFor="address">
              {mode === "add" ? "Agregar nueva dirección" : "Editar dirección"}
            </label>
            <textarea
              placeholder="Escriba su dirección"
              rows={5}
              name="address"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-2xl px-4 py-3 bg-[#F5F7FA] text-gray-700 placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-accent mt-2"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
