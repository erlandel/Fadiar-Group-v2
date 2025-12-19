"use client"
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FloatingLabelInputProps {
  type: "email" | "password" | "text";
  label: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  className?: string;
  error?: string;
}

export default function FloatingLabelInput({
  type,
  label,
  required = false,
  value,
  onChange,
  name,
  id,
  className = "",
  error,
}: FloatingLabelInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === "password" && showPassword ? "text" : type;
  return (
    <div className={`mt-6 group ${className}`}>
      <div className="relative">
        <input
          type={inputType}
          required={required}
          value={value}
          onChange={onChange}
          name={name}
          id={id}
          placeholder=" "
          className={`w-full h-10 md:h-11 bg-transparent border-2 border-white outline-none rounded-full text-base text-white px-4 transition-all duration-500 peer focus:border-white ${type === "password" ? "pr-12" : ""}`}
        />
        <label className="absolute top-1/2 left-4 -translate-y-1/2 text-md font-bold pointer-events-none transition-all duration-500 text-gray peer-focus:top-[-10px] peer-focus:text-sm peer-focus:px-1.5 peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:px-1.5 peer-[:not(:placeholder-shown)]:text-accent">
          {label}
        </label>
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1 ml-4">{error}</p>
      )}
    </div>
  );
}
