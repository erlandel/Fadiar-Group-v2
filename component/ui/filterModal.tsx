import React, { useRef, useEffect, useState } from "react";

export type FilterOption = {
  label: string;
  value: string | number;
  key?: string;
};

export type FilterType = "checkbox" | "radio" | "range";

interface FilterSectionProps {
  title: string;
  type: FilterType;

  // Para checkbox y radio:
  options?: FilterOption[];
  selected?: (string | number)[];

  // Para range:
  min?: number;
  max?: number;
  step?: number;
  valueMin?: number;
  valueMax?: number;

  // Handlers
  onChange?: (value: any) => void;
  onApply?: (value: any) => void; // Se llama cuando termina de ajustar el rango
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  type,
  options = [],
  selected = [],
  min = 0,
  max = 100,
  step = 1,
  valueMin = min,
  valueMax = max,
  onChange,
  onApply,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Por defecto abierto

  const getPercentage = (value: number) => {
    if (max === min) return 0;
    const pct = ((value - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  const clampValue = (value: number, minVal: number, maxVal: number) => {
    return Math.max(minVal, Math.min(maxVal, value));
  };

  // Función para evitar que los thumbs se superpongan (más flexible)
  const getClampedMin = (value: number) => {
    // Permitir que se acerquen más, solo evitar superposición total
    const minGap = Math.max(1, Math.floor((max - min) * 0.01)); // 1% del rango como mínimo
    return Math.max(min, Math.min(value, valueMax - minGap));
  };

  const getClampedMax = (value: number) => {
    // Permitir que se acerquen más, solo evitar superposición total
    const minGap = Math.max(1, Math.floor((max - min) * 0.01)); // 1% del rango como mínimo
    return Math.min(max, Math.max(value, valueMin + minGap));
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || isDraggingMin || isDraggingMax) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const value = Math.round((percentage / 100) * (max - min) + min);
    
    const distToMin = Math.abs(value - valueMin);
    const distToMax = Math.abs(value - valueMax);
    
    if (distToMin < distToMax) {
      const newMin = getClampedMin(value);
      onChange?.([newMin, valueMax]);
    } else {
      const newMax = getClampedMax(value);
      onChange?.([valueMin, newMax]);
    }
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!trackRef.current || (!isDraggingMin && !isDraggingMax)) return;
      
      const rect = trackRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      // Hacer el movimiento más suave y preciso
      const rawValue = (percentage / 100) * (max - min) + min;
      const value = Math.round(rawValue);
      
      if (isDraggingMin) {
        const newMin = getClampedMin(value);
        onChange?.([newMin, valueMax]);
      } else if (isDraggingMax) {
        const newMax = getClampedMax(value);
        onChange?.([valueMin, newMax]);
      }
    };

    const handleEnd = () => {
      setIsDraggingMin(false);
      setIsDraggingMax(false);
      // Llamar a onApply cuando el usuario termina de ajustar el rango
      if (type === "range") {
        onApply?.([valueMin, valueMax]);
      }
    };

    if (isDraggingMin || isDraggingMax) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingMin, isDraggingMax, valueMin, valueMax, min, max, onChange]);

  const handleMinInputChange = (val: number) => {
    const newMin = clampValue(val, min, valueMax);
    onChange?.([newMin, valueMax]);
  };

  const handleMaxInputChange = (val: number) => {
    const newMax = clampValue(val, valueMin, max);
    onChange?.([valueMin, newMax]);
  };

  return (
    <div className="relative bg-[#F5F7FA] rounded-2xl border border-gray-200 p-6 mb-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Title */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full font-semibold text-[#1A2B49] text-base mb-4 flex items-center justify-between hover:text-[#17243b] transition-colors"
      >
        {title}
        <span className={`text-[#1A2B49]/60 text-lg transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ⌄
        </span>
      </button>

      {/* Content - Collapsible */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        {/* CHECKBOX */}
        {type === "checkbox" &&
          options.map((opt, index) => (
            <label
              key={(opt as any).key || opt.value || index}
              className="flex items-center gap-2.5 text-sm text-[#6B7280] mb-3 cursor-pointer hover:text-[#17243b] transition-colors"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => {
                  const exists = selected.includes(opt.value);
                  const newValues = exists
                    ? selected.filter((v) => v !== opt.value)
                    : [...selected, opt.value];

                  onChange?.(newValues);
                }}
                className="h-4 w-4 rounded border-gray-300 cursor-pointer accent-[#17243b]"
              />
              {opt.label}
            </label>
          ))}

        {/* RADIO */}
        {type === "radio" &&
          options.map((opt, index) => (
            <label
              key={(opt as any).key || opt.value || index}
              className="flex items-center gap-2.5 text-sm text-[#3A4B66] mb-3 cursor-pointer hover:text-[#1A2B49] transition-colors "
            >
              <input
                type="radio"
                name={title}
                checked={selected.includes(opt.value)}
                onChange={() => onChange?.([opt.value])}
                className="h-4 w-4 border-gray-300 cursor-pointer accent-[#17243b]"
              />
              {opt.label}
            </label>
          )
          )}

          {/* RANGE */}
          {type === "range" && (
        <div className="mt-4">
          {/* Dual Range Slider */}
          <div className="relative mb-8 pt-6 px-4 pb-2">
            {/* Track container */}
            <div
              ref={trackRef}
              onClick={handleTrackClick}
              className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
            >
              {/* Active range */}
              <div
                className="absolute h-full bg-[#17243b] rounded-full transition-all duration-150"
                style={{
                  left: `${getPercentage(valueMin)}%`,
                  right: `${100 - getPercentage(valueMax)}%`,
                }}
              ></div>

              {/* Min thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-all duration-200"
                style={{ 
                  left: `${getPercentage(valueMin)}%`,
                  zIndex: isDraggingMin ? 30 : 25
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsDraggingMin(true);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setIsDraggingMin(true);
                }}
              >
                {/* Thumb visual */}
                <div className="w-4 h-4 bg-white border-2 border-[#17243b] rounded-full shadow-md hover:shadow-lg"></div>
                {/* Tooltip min */}
                {isDraggingMin && (
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none" style={{ zIndex: 70 }}>
                    ${valueMin.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Max thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-all duration-200"
                style={{ 
                  left: `${getPercentage(valueMax)}%`,
                  zIndex: isDraggingMax ? 30 : 25
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsDraggingMax(true);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setIsDraggingMax(true);
                }}
              >
                {/* Thumb visual */}
                <div className="w-4 h-4 bg-white border-2 border-[#17243b] rounded-full shadow-md hover:shadow-lg"></div>       
              </div>
              
            </div>
          </div>

          {/* Input boxes */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Mínimo</label>
              <input
                type="text"
                value={`$${valueMin.toLocaleString()}`}
                readOnly 
                className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none cursor-default"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Máximo</label>
              <input
                type="text"
                value={`$${valueMax.toLocaleString()}`}
                readOnly 
                className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none cursor-default"
              />
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};