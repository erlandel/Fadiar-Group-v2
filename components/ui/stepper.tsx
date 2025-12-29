"use client";

import { Check, DollarSign, ShoppingCart, Truck } from "lucide-react";

interface CheckoutStepperProps {
  currentStep?: number;
}

export function CheckoutStepper({ currentStep = 0 }: CheckoutStepperProps) {
  const steps = [
    {
      id: 0,
      label: "Carrito de compra",
      icon: ShoppingCart,
    },
    {
      id: 1,
      label: "Datos de pago",
      icon: DollarSign,
    },
    {
      id: 2,
      label: "Datos de entrega",
      icon: Truck,
    },
    {
      id: 3,
      label: "Completar",
      icon: Check,
    },
  ];

  return (
    <div className="w-full   p-4">
      <div className="relative flex items-center justify-between">
        {/* Connecting Lines Layer */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex items-center px-8 sm:px-12 pointer-events-none z-0">
          {steps.slice(0, -1).map((step, index) => {
            let lineStyle = "bg-[#E1E5EB]"; // Default gray

            if (index < currentStep) {
              lineStyle = "bg-[#d69f04]"; // Completed steps
            } else if (index === currentStep) {
              lineStyle =
                "bg-[linear-gradient(to_right,#d69f04_50%,#E1E5EB_50%)]";
            }

            return (
              <div
                key={`line-${index}`}
                className={`h-px w-full transition-all duration-300 ${lineStyle}`}
              />
            );
          })}
        </div>

        {/* Steps Layer */}
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isActive
                    ? "border-accent bg-white text-primary "
                    : isCompleted
                    ? "border-accent bg-white text-primary " 
                    : "border-transparent bg-[#E1E5EB] text-gray-500" 
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <span
                className={`mt-4 text-[10.71px] font-bold sm:text-sm transition-colors duration-300 absolute top-12 whitespace-nowrap text-center ${
                  isActive
                    ? "text-primary font-bold"
                    : isCompleted
                    ? "text-primary font-bold" 
                    : "text-gray-500" 
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
