import { ReactNode } from "react";

interface ButtonPromoHome1Props {
  name: string;
  color: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  onClick?: () => void;
}

export default function ButtonPromoHome1({
  name: nombre,
  color,
  icon,
  iconPosition = "right",
  className = "inline-flex items-center sm:gap-2 rounded-md px-3 sm:px-6 py-2 gap-1 sm:py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
  onClick,
}: ButtonPromoHome1Props) {
  return (
    <button
      className={className}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {icon && iconPosition === "left" && <span>{icon}</span>}
      <span>{nombre}</span>
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
}
