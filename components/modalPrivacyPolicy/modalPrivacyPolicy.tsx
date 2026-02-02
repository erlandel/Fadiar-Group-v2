import { X } from "lucide-react";
import { privacyPolicy } from "@/data/privacyPolicy";

interface ModalPrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalPrivacyPolicy = ({ isOpen, onClose }: ModalPrivacyPolicyProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 w-screen h-screen bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overscroll-contain overflow-y-auto">
      {/* Background overlay to close when clicking outside */}
  
      
      <div className="relative bg-white w-full max-w-3xl max-h-[50vh] sm:max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all transform duration-300 ease-out">
        {/* Header */}
        <div className="relative flex items-center justify-center px-6 py-4 shadow-sm border-b border-gray-100">
          <h3 className="text-2xl font-bold text-primary text-center">Política de Privacidad</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-6"
          >
            <X className="w-6 h-6 text-gray-500 hover:text-primary transition-colors cursor-pointer" strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-8 mb-4 overflow-y-auto text-gray-700 custom-scrollbar text-justify">
          <div className="max-w-none whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed">
            {privacyPolicy}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModalPrivacyPolicy;
