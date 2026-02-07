import { useState } from "react";
import { Info, X } from "lucide-react";

interface InformationMessageProps {
  onClose?: () => void;
  title?: string;
  bodyLines?: string[];
}

const InformationMessage = ({
  onClose,
  title = "¡Gracias por su compra!",
  bodyLines = [],
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
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col items-start gap-1 relative transition-all animate-in fade-in slide-in-from-top-2 ">
          <div className="flex">
            <div className="bg-blue-100 p-1 rounded-lg">
              <Info className="w-5 h-5 md:h-7 md:w-7 text-blue-800" />
            </div>
            <div className="flex-1 ml-2 ">
              <h4 className="text-xl md:text-2xl font-bold text-blue-900 mb-1">
                {title}
              </h4>
            </div>

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" strokeWidth={4} />
            </button>
          </div>
          <div className="xl:ml-15">
            {bodyLines.map((line, idx) => {
              const isOrderIdLine = /^Número pedido:/i.test(line);
              if (isOrderIdLine) {
                const idText = line.replace(/^Número pedido:\s*/i, "");
                return (
                  <p key={idx} className="text-md md:text-xl text-blue-800 leading-relaxed">
                    {"Número pedido:"}{" "}
                    <span className="font-bold">{idText}</span>
                  </p>
                );
              }
              return (
                <p key={idx} className="text-md md:text-xl text-blue-800 leading-relaxed">
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InformationMessage;
