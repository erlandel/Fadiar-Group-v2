import { useState } from "react";
import { X } from "lucide-react";

interface InformationMessageProps {
  onClose?: () => void;
  title?: string;
  variant?: "delivery" | "pickup";
  orderId?: string;
}

const InformationMessage = ({
  onClose,
  title = "¡Gracias por su compra!",
  variant = "delivery",
  orderId = "",
}: InformationMessageProps) => {
  const [showInfo, setShowInfo] = useState(true);

  const handleClose = () => {
    setShowInfo(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div>
      {showInfo && (
        <div className="mb-6 bg-blue-50  rounded-xl py-6 px-8 flex flex-col gap-4 relative transition-all animate-in fade-in slide-in-from-top-2 ">
          <button
            onClick={handleClose}
            className="absolute  top-4 right-4 text-[#5b7aa7] hover:text-primary transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" strokeWidth={4} />
          </button>

          <div className="w-full text-center  mt-4 ">
            <h4 className="text-2xl md:text-[40px] font-bold text-primary ">
              {title}
            </h4>
            <div className="mx-auto mt-3 h-2 w-25 bg-primary rounded-full" />
          </div>

          <div className="space-y-8 mt-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/iconsSVG/CheckCircle.svg"
                alt="Confirmación"
                className="w-6 h-6 md:h-12 md:w-12 shrink-0"
              />
              <div className="text-lg text-primary leading-snug">
                <p>Su pedido ha sido confirmado exitosamente.</p>
                <p>
                  Número pedido: <span className="font-bold">#{orderId}</span>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="/images/iconsSVG/CalendarClock.svg"
                alt="Plazo"
                className="w-6 h-6 md:h-12 md:w-12 shrink-0"
              />
              <p className="text-lg text-primary leading-snug">
                {variant === "delivery"
                  ? "La entrega se realizará en un plazo de 24 a 48 horas."
                  : "Puede recogerlo en nuestra sede en un plazo de 7 días hábiles."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={
                  variant === "delivery"
                    ? "/images/iconsSVG/Smartphone.svg"
                    : "/images/iconsSVG/FileText.svg"
                }
                alt={variant === "delivery" ? "Contacto" : "Documento"}
                className="w-6 h-6 md:h-14 md:w-12 shrink-0"
              />
              <p className="text-lg text-primary leading-snug">
                {variant === "delivery"
                  ? "Nuestro equipo logístico se comunicará al número telefónico proporcionado para coordinar los detalles."
                  : "Deberá presentar su número de pedido al momento de la recogida."}
              </p>
            </div>

            {variant === "pickup" && (
              <div className="flex ml-3 ">
                <p className="text-lg text-primary leading-snug">
                  Si necesita más información, nuestro equipo estará disponible
                  para asistirle.
                </p>
              </div>
            )}
          </div>

          <div className="text-center text-primary font-bold uppercase text-[22px] mt-2 mb-4">
            Gracias por confiar en Grupo Fadiar.
          </div>
        </div>
      )}
    </div>
  );
};

export default InformationMessage;
