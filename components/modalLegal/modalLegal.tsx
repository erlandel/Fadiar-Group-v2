import { X } from "lucide-react";

interface ModalLegalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const ModalLegal = ({ isOpen, onClose, title, content }: ModalLegalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-1000 w-screen h-screen bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overscroll-contain overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-3xl max-h-[50vh] sm:max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center p-3 sm:p-6 bg-gray-50 border-b border-gray-200 shadow-sm">
          <h3 className="text-xl md:text-2xl font-bold text-primary text-center px-10">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="absolute right-4 p-2 rounded-full transition-colors group cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors" strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 py-2 overflow-y-auto text-gray-700 custom-scrollbar text-justify">
          <div className="max-w-none whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed">
            {content.trim()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLegal;
