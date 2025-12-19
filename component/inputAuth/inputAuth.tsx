import { InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputAuthProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  className?: string;
}

export default function InputAuth({ 
  type = "text",
  placeholder = "Contraseña",
  label,
  icon: Icon,
  value,
  onChange,
  error,
  disabled = false,
  className = "",
  ...props
}: InputAuthProps) {
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
            <Icon size={20} />
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-4 py-3 
            ${Icon ? 'pl-11' : 'pl-4'}
            border border-[#d1d5db] rounded-xl
            focus:outline-none focus:ring-3 focus:ring-[#bdbdbd] focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            placeholder:text-gray-500
             placeholder:text-lg sm:text-xl
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}