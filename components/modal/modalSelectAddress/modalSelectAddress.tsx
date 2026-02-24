import { X, Loader } from "lucide-react";
import { useMemo } from "react";
import { MunicipalityData } from "@/types/location";
import { useGetAddresses } from "@/hooks/addressRequests/useGetAddresses";
import useLocation from "@/hooks/locationRequests/useLocation";

type AddressItem = {
  id: string;
  provincia: string;
  municipio: string;
  municipioId: string;
  direccion: string;
};

type ModalSelectAddressProps = {
  show: boolean;
  onClose: () => void;
  province: string;
  allowedMunicipalities: MunicipalityData[];
  onSelect: (addr: AddressItem, provinceId: string | null) => void;
};

export default function ModalSelectAddress({
  show,
  onClose,
  province,
  allowedMunicipalities,
  onSelect,
}: ModalSelectAddressProps) {
  const { addresses, isLoading, isError } = useGetAddresses();
  const { data } = useLocation();

  const provinceId = useMemo(() => {
    const p = data.find((d) => d.provincia === province);
    return p?.id ?? null;
  }, [data, province]);

  const allowedIds = useMemo(
    () => allowedMunicipalities.map((m) => String(m.id)),
    [allowedMunicipalities]
  );

  const filtered = useMemo(() => {
    return (addresses as any[])
      .filter((addr) => addr.provincia === province)
      .filter(
        (addr) =>
          allowedIds.includes(String(addr.municipioId)) ||
          allowedMunicipalities.some((m) => m.municipio === addr.municipio)
      )
      .map((addr) => ({
        id: String(addr.id),
        provincia: addr.provincia,
        municipio: addr.municipio,
        municipioId: String(addr.municipioId),
        direccion: addr.direccion,
      }));
  }, [addresses, province, allowedIds, allowedMunicipalities]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative shadow-lg mx-2">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 cursor-pointer"
        >
          <X className="w-6 h-6" strokeWidth={2} />
        </button>

        <h5 className="text-primary font-bold text-2xl">Seleccionar Dirección</h5>

        <div className="w-full rounded-lg px-2 sm:px-4 py-3 bg-[#F5F7FA] text-gray-700 mt-4 min-h-[120px] max-h-[480px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <Loader className="animate-spin text-accent" />
            </div>
          ) : isError ? (
            <div className="text-red-500 text-center py-4 text-sm">
              Error al cargar las direcciones
            </div>
          ) : filtered && filtered.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filtered.map((addr) => (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => onSelect(addr, provinceId)}
                  className="flex flex-col text-left justify-between bg-white p-3 rounded-md shadow-sm border border-gray-100 group hover:border-accent/30 transition-all text-sm sm:text-base gap-1 cursor-pointer"
                >
                  <div className="w-full flex justify-between items-start">
                    <div>
                      <div className="gap-1">
                        <span className="text-primary font-bold">Provincia:</span>
                        <span className="ml-0.5 text-gray-600">{addr.provincia}</span>
                      </div>
                      <div className="gap-1">
                        <span className="text-primary font-bold">Municipio:</span>
                        <span className="ml-0.5 text-gray-600">{addr.municipio}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-primary font-bold">Direccion:</span>
                    <span className="ml-1 text-gray-800">{addr.direccion}</span>
                  </div>
                </button>
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
  );
}
