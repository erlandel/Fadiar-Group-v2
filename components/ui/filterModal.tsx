import React, { useRef, useEffect, useState, useId, useCallback } from "react";
import { ChevronDown } from "lucide-react";

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
  onApply?: (value: any) => void;
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
  const [isOpen, setIsOpen] = useState(true);
  const [localMin, setLocalMin] = useState(valueMin);
  const [localMax, setLocalMax] = useState(valueMax);
  const [inputMin, setInputMin] = useState(valueMin.toString());
  const [inputMax, setInputMax] = useState(valueMax.toString());
  const radioGroupId = useId();

  // Sync local state with props
  useEffect(() => {
    setLocalMin(valueMin);
    setLocalMax(valueMax);
    setInputMin(valueMin.toString());
    setInputMax(valueMax.toString());
  }, [valueMin, valueMax]);

  const getPercentage = (value: number) => {
    if (max === min) return 0;
    const pct = ((value - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  const clampValue = (value: number, minVal: number, maxVal: number) => {
    return Math.max(minVal, Math.min(maxVal, value));
  };

  const getClampedMin = useCallback((value: number) => {
    const minGap = Math.max(1, Math.floor((max - min) * 0.01));
    return Math.max(min, Math.min(value, localMax - minGap));
  }, [min, max, localMax]);

  const getClampedMax = useCallback((value: number) => {
    const minGap = Math.max(1, Math.floor((max - min) * 0.01));
    return Math.min(max, Math.max(value, localMin + minGap));
  }, [min, max, localMin]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || isDraggingMin || isDraggingMax) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const value = Math.round((percentage / 100) * (max - min) + min);
    
    const distToMin = Math.abs(value - localMin);
    const distToMax = Math.abs(value - localMax);
    
    if (distToMin < distToMax) {
      const newMin = getClampedMin(value);
      setLocalMin(newMin);
      setInputMin(newMin.toString());
      onChange?.([newMin, localMax]);
    } else {
      const newMax = getClampedMax(value);
      setLocalMax(newMax);
      setInputMax(newMax.toString());
      onChange?.([localMin, newMax]);
    }
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!trackRef.current || (!isDraggingMin && !isDraggingMax)) return;
      
      const rect = trackRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const percentage = (x / rect.width) * 100;
      const rawValue = (percentage / 100) * (max - min) + min;
      const value = Math.round(rawValue);
      
      if (isDraggingMin) {
        const newMin = getClampedMin(value);
        setLocalMin(newMin);
        setInputMin(newMin.toString());
        onChange?.([newMin, localMax]);
      } else if (isDraggingMax) {
        const newMax = getClampedMax(value);
        setLocalMax(newMax);
        setInputMax(newMax.toString());
        onChange?.([localMin, newMax]);
      }
    };

    const handleEnd = () => {
      setIsDraggingMin(false);
      setIsDraggingMax(false);
    };

    if (isDraggingMin || isDraggingMax) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: true });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingMin, isDraggingMax, localMin, localMax, min, max, onChange, getClampedMin, getClampedMax]);

  const handleInputMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setInputMin(rawValue);
  };

  const handleInputMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setInputMax(rawValue);
  };

  const handleInputMinBlur = () => {
    let numValue = parseInt(inputMin) || min;
    numValue = clampValue(numValue, min, localMax);
    setLocalMin(numValue);
    setInputMin(numValue.toString());
    onChange?.([numValue, localMax]);
  };

  const handleInputMaxBlur = () => {
    let numValue = parseInt(inputMax) || max;
    numValue = clampValue(numValue, localMin, max);
    setLocalMax(numValue);
    setInputMax(numValue.toString());
    onChange?.([localMin, numValue]);
  };

  const handleInputMinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputMinBlur();
    }
  };

  const handleInputMaxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputMaxBlur();
    }
  };

  const handleApply = () => {
    onApply?.([localMin, localMax]);
  };

  return (
    <div className="relative font-bold bg-[#F5F7FA] rounded-2xl border border-gray-200 pl-6 pt-6 pb-6 pr-2 mb-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Title */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full font-semibold text-[#1A2B49] text-base mb-4 flex items-center justify-between hover:text-[#17243b] transition-colors pr-4"
      >
        {title}
        <span className={`text-[#1A2B49]/60 cursor-pointer transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5" />
        </span>
      </button>

      {/* Content - Collapsible */}
      <div className={`transition-all duration-300 ease-in-out custom-scrollbar ${
        isOpen
          ? 'max-h-[450px] opacity-100 overflow-y-auto'
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        {/* CHECKBOX */}
        {type === "checkbox" &&
          options.map((opt, index) => {
            const isSelected = selected.includes(opt.value);
            return (
              <label
                key={(opt as any).key || opt.value || index}
                className={`flex items-center gap-2.5 text-sm mb-3 cursor-pointer transition-colors whitespace-nowrap
  ${
                  isSelected 
                    ? 'text-[#1A2B49] font-semibold' 
                    : 'text-[#6B7280] hover:text-[#1A2B49]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
                    const exists = selected.includes(opt.value);
                    const newValues = exists
                      ? selected.filter((v) => v !== opt.value)
                      : [...selected, opt.value];

                    onChange?.(newValues);
                  }}
                  className="min-h-4 min-w-4 rounded border-gray-300 cursor-pointer accent-[#17243b]"
                />
                {opt.label}
              </label>
            );
          })}

        {/* RADIO */}
        {type === "radio" &&
          options.map((opt, index) => {
            const isSelected = selected.includes(opt.value);
            return (
              <label
                key={(opt as any).key || opt.value || index}
                className={`flex items-center gap-2.5 text-sm mb-3 cursor-pointer transition-colors ${
                  isSelected 
                    ? 'text-[#1A2B49] font-semibold' 
                    : 'text-[#6B7280] hover:text-[#1A2B49]'
                }`}
              >
                <input
                  type="radio"
                  name={radioGroupId}
                  checked={isSelected}
                  onClick={() => {
                    const newSelected = isSelected ? [] : [opt.value];
                    onChange?.(newSelected);
                  }}
                  onChange={() => {}}
                  className="h-4 w-4 border-gray-300 cursor-pointer accent-[#17243b]"
                />
                {opt.label}
              </label>
            );
          })}

        {/* RANGE */}
        {type === "range" && (
          <div className="mt-4 overflow-x-hidden">
            {/* Dual Range Slider */}
            <div className="relative mb-8 pt-8 px-4 pb-2 pr-8">
              {/* Track container */}
              <div
                ref={trackRef}
                onClick={handleTrackClick}
                className="relative h-2 bg-gray-200 rounded-full cursor-pointer mr-2"
              >
                {/* Active range */}
                <div
                  className="absolute h-full bg-[#17243b] rounded-full"
                  style={{
                    left: `${getPercentage(localMin)}%`,
                    right: `${100 - getPercentage(localMax)}%`,
                  }}
                ></div>

                {/* Min thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform duration-150"
                  style={{ 
                    left: `${getPercentage(localMin)}%`,
                    zIndex: isDraggingMin ? 30 : 25,
                    touchAction: 'none'
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
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
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50 shadow-lg">
                      ${localMin.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Max thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform duration-150"
                  style={{ 
                    left: `${getPercentage(localMax)}%`,
                    zIndex: isDraggingMax ? 30 : 25,
                    touchAction: 'none'
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
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
                  {/* Tooltip max */}
                  {isDraggingMax && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50 shadow-lg">
                      ${localMax.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input boxes */}
            <div className="flex items-center gap-3 mt-4 pr-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1 font-medium">Mínimo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={inputMin}
                    onChange={handleInputMinChange}
                    onBlur={handleInputMinBlur}
                    onKeyDown={handleInputMinKeyDown}
                    className="w-full border border-gray-300 bg-white rounded-lg pl-6 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#17243b]/20 focus:border-[#17243b] transition-all"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1 font-medium">Máximo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={inputMax}
                    onChange={handleInputMaxChange}
                    onBlur={handleInputMaxBlur}
                    onKeyDown={handleInputMaxKeyDown}
                    className="w-full border border-gray-300 bg-white rounded-lg pl-6 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#17243b]/20 focus:border-[#17243b] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Botón Aplicar */}
            <div className="mt-4 pr-4">
              <button
                onClick={handleApply}
                className="w-full bg-[#17243b] text-white font-medium py-2.5 px-4 rounded-lg hover:bg-[#1A2B49] active:scale-[0.98] transition-all duration-150 shadow-sm hover:shadow cursor-pointer"
              >
                Aplicar Filtro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};