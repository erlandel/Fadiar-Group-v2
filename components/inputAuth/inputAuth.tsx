import { InputHTMLAttributes, useState } from "react";
import { LucideIcon } from "lucide-react";

interface InputAuthProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  endIcon?: LucideIcon;
  endIconClassName?: string;
  onEndIconClick?: () => void;
  statusIcon?: LucideIcon;
  statusIconClassName?: string;
  error?: string;
  className?: string;
  hasError?: boolean;
  hideErrorMessage?: boolean;
}

export default function InputAuth({
  type = "text",
  placeholder = "Contraseña",
  label,
  icon: Icon,
  iconClassName = "",
  endIcon: EndIcon,
  endIconClassName = "",
  onEndIconClick,
  statusIcon: StatusIcon,
  statusIconClassName = "",
  value,
  onChange,
  error,
  hasError = false,
  hideErrorMessage = false,
  disabled = false,
  className = "",
  ...props
}: InputAuthProps) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className={iconClassName} />
          </div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-4 py-1.5 
            ${Icon ? "pl-11" : "pl-4"}
            ${EndIcon && StatusIcon ? "pr-20" : EndIcon || StatusIcon ? "pr-12" : "pr-4"}
            border border-[#d1d5db] rounded-xl
            focus:outline-none
            focus:ring-[0.3px]
            focus:shadow-[0_0_0_5px_rgba(0,0,0,0.15)]
            disabled:bg-gray-100 disabled:cursor-not-allowed
            placeholder:text-gray-500
                     
            transition-all duration-200
            ${(hasError || !!error) && !isFocused ? "border-red-500" : ""}
            ${className}
          `}
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
        {(StatusIcon || EndIcon) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-2">
            {StatusIcon && <StatusIcon className={statusIconClassName} />}
            {EndIcon && (
              <button
                type="button"
                className="text-gray-400"
                onClick={onEndIconClick}
              >
                <EndIcon className={endIconClassName} />
              </button>
            )}
          </div>
        )}
      </div>
      {!hideErrorMessage && error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
