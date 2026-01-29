
import { useState } from "react";
import { Info, X } from "lucide-react";

const InformationMessage = () => {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div >
      {showInfo && (
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 relative transition-all animate-in fade-in slide-in-from-top-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Info className="h-5 w-5 text-blue-800" />
          </div>
          <div className="flex-1 pr-8">
            <h4 className="text-sm font-bold text-blue-900 mb-1">
              Información de Entrega
            </h4>
            <p className="text-xs md:text-sm text-blue-800 leading-relaxed">
              Se realizará en un plazo de 24 a 48 horas. Nuestro equipo logístico contactará al destinatario a través del número telefónico proporcionado para coordinar la entrega.
            </p>
          </div>
          <button
            onClick={() => setShowInfo(false)}
            className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" strokeWidth={4} />
          </button>
        </div>
      )}
    </div>
  );
};

export default InformationMessage;
