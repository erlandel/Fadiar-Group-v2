import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  className?: string;
}

export const InputField: React.FC<InputProps> = ({ 
  type = "text", 
  placeholder, 
  className = "",
  ...props 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full rounded-2xl px-4 py-3 bg-[#F5F7FA] text-gray-700 placeholder:text-gray-500 placeholder:text-md focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
      {...props}
    />
  );
};
