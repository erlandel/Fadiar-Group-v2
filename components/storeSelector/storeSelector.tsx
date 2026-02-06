"use client"
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { onClickOutside } from "@/utils/clickOutside";

type StoreOption = {
  id: string | number;
  name: string;
};

type Props = {
  stores: StoreOption[];
  selectedId: string | number;
  onChange: (id: string | number) => void;
  label?: string;
};

export default function StoreSelector({
  stores,
  selectedId,
  onChange,
  label = "Tienda(s)",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cleanup = onClickOutside(ref.current, () => setOpen(false), {
      enabled: open,
    });
    return cleanup;
  }, [open]);

  const selectedName =
    stores.find((t) => t.id === selectedId)?.name || "Todas";

  return (
    <div className="flex items-center   gap-2" ref={ref}>
      <span className="font-bold text-primary sm:text-lg whitespace-nowrap">
        {label}
      </span>
      <span className="text-primary text-xl font-bold">:</span>
      <div className="relative">
        <div
          className="flex items-center justify-between bg-gray-50 rounded-lg p-2 cursor-pointer  transition-colors min-w-[200px]"
          onClick={() => setOpen(!open)}
        >
          <span className="font-bold text-accent whitespace-nowrap truncate sm:text-lg">
            {selectedName}
          </span>
          <ChevronDown
            className={`h-5 w-5 ml-2 text-primary transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <ul className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-100 max-h-60 overflow-auto py-1 w-full min-w-[200px]">
            {stores.map((tienda) => (
              <li
                key={tienda.id}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm transition-colors ${
                  selectedId === tienda.id
                    ? "bg-primary/5 text-primary font-bold"
                    : "text-gray-700"
                }`}
                onClick={() => {
                  onChange(tienda.id);
                  setOpen(false);
                }}
              >
                {tienda.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
