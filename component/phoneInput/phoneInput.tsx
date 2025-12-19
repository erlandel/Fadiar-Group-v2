"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IcSharpSearch } from "@/icons/icons";

interface Country {
  name: string;
  code: string;
  flag: string;
  phoneCode: string;
}

interface PhoneInputProps {
  phoneValue?: string;
  countryCode?: string;
  onChange?: (phoneValue: string, countryCode: string) => void;
  placeholder?: string;
  defaultCountry?: { name: string; code: string; phoneCode: string };
}

export default function PhoneInput({
  phoneValue = "",
  countryCode = "+53",
  onChange,
  placeholder = "Teléfono",
  defaultCountry = { name: "Cuba", code: "CU", phoneCode: "+53" },
}: PhoneInputProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputPhoneValue, setInputPhoneValue] = useState(phoneValue);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cargar países
  useEffect(() => {
    async function loadFlags() {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd"
        );
        if (!res.ok) throw new Error("Error al cargar países");

        const data = await res.json();
       
        if (!Array.isArray(data)) throw new Error("Datos inválidos recibidos");

        const mapped = data.map((c: any) => ({
          name: c.name.common,
          code: c.cca2,
          flag: c.flags.png,
          phoneCode: c.idd?.root ? c.idd.root + (c.idd.suffixes?.[0] || "") : "",
        }));

        setCountries(mapped);
        setFilteredCountries(mapped);
      } catch (err) {
        console.error("ERROR:", err);
      }
    }

    loadFlags();
  }, []);

  // Filtrar países según búsqueda
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery, countries]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Sincronizar inputPhoneValue cuando el phoneValue prop cambia
  useEffect(() => {
    setInputPhoneValue(phoneValue);
  }, [phoneValue]);

  // Sincronizar selectedCountry cuando el countryCode prop cambia
  useEffect(() => {
    if (countries.length > 0) {
      const country = countries.find(c => c.phoneCode === countryCode);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [countryCode, countries]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputPhoneValue(newValue);
    if (onChange) {
      onChange(newValue, selectedCountry.phoneCode);
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery(""); // Limpiar búsqueda al seleccionar
    if (onChange) {
      onChange(inputPhoneValue, country.phoneCode);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div className="w-full flex items-center gap-2 rounded-2xl px-4 py-3 bg-[#F5F7FA] text-gray-700 focus-within:ring-2 focus-within:ring-accent overflow-hidden">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center cursor-pointer gap-1 hover:opacity-80 transition-opacity"
        >
          <img
            src={`https://flagcdn.com/32x24/${selectedCountry.code.toLowerCase()}.png`}
            alt={`B`}
            className="w-6 h-auto"
          />
          {isDropdownOpen ? (
            <ChevronUp className="h-3 w-3 min-w-5 min-h-4" />
          ) : (
            <ChevronDown className="h-3 w-3 min-w-5 min-h-4" />
          )}
        </button>
        <span className="text-gray-600 ml-4">|</span>
        <input
          type="text"
          placeholder={placeholder}
          value={inputPhoneValue}
          onChange={handlePhoneChange}
          className="flex-1 min-w-0 bg-transparent outline-none text-gray-700 placeholder:text-gray-500"
        />
      </div>

      {/* Dropdown de países */}
      {isDropdownOpen && (
        <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto bg-white rounded-2xl shadow-lg border border-gray-200">
          {/* Buscador fijo */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-3">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <IcSharpSearch className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar país..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
              />
            </div>
          </div>
          
          {/* Lista de países filtrados */}
          <div>
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
                >
                  <img
                    src={country.flag}
                    alt={`Bandera de ${country.name}`}
                    className="w-6 h-auto"
                  />
                  <span className="text-gray-700">{country.name}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No se encontraron países
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
