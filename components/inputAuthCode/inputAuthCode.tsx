import { useEffect, useMemo, useRef, useState } from "react";

interface InputAuthCodeProps {
  length?: number;
  value?: string;
  onChange?: (code: string) => void;
  disabled?: boolean;
  className?: string;
  digitsOnly?: boolean;
}

export default function InputAuthCode({
  length = 6,
  value,
  onChange,
  disabled = false,
  className = "",
  digitsOnly = false,
}: InputAuthCodeProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length }, () => "")
  );

  const isControlled = useMemo(() => typeof value === "string", [value]);

  useEffect(() => {
    if (isControlled) {
      const next = (value ?? "").slice(0, length).split("");
      setDigits((prev) => {
        const filled = Array.from({ length }, (_, i) => next[i] ?? "");
        const same =
          filled.length === prev.length &&
          filled.every((d, i) => d === prev[i]);
        return same ? prev : filled;
      });
    }
  }, [value, length, isControlled]);

  useEffect(() => {
    onChange?.(digits.join(""));
  }, [digits, onChange]);

  const focusIndex = (idx: number) => {
    const el = inputsRef.current[idx];
    el?.focus();
    el?.select();
  };

  const setDigitAt = (idx: number, char: string) => {
    const cleaned = digitsOnly ? char.replace(/[^0-9]/g, "") : char.replace(/[^a-zA-Z0-9]/g, "");
    const nextChar = cleaned.slice(0, 1);
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = nextChar;
      return next;
    });
  };

  const handleChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = e.target.value;
    setDigitAt(idx, val);
    if (val.trim().length > 0 && idx < length - 1) focusIndex(idx + 1);
  };

  const handleKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const key = e.key;
    if (key === "Backspace") {
      if (digits[idx]) {
        setDigitAt(idx, "");
      } else if (idx > 0) {
        focusIndex(idx - 1);
        setDigitAt(idx - 1, "");
      }
      e.preventDefault();
      return;
    }
    if (key === "ArrowLeft" && idx > 0) {
      focusIndex(idx - 1);
      e.preventDefault();
      return;
    }
    if (key === "ArrowRight" && idx < length - 1) {
      focusIndex(idx + 1);
      e.preventDefault();
      return;
    }
    // Allow any alphanumeric char; do not block other keys
  };

  const handlePaste = (idx: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const textRaw = e.clipboardData.getData("text");
    const text = (digitsOnly ? textRaw.replace(/[^0-9]/g, "") : textRaw.replace(/[^a-zA-Z0-9]/g, ""));
    if (!text) return;
    e.preventDefault();
    const chars = text.slice(0, length - idx).split("");
    setDigits((prev) => {
      const next = [...prev];
      chars.forEach((c, i) => {
        const pos = idx + i;
        if (pos < length) next[pos] = c;
      });
      return next;
    });
    const lastPos = Math.min(idx + chars.length, length - 1);
    focusIndex(lastPos);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type={digitsOnly ? "tel" : "text"}
            maxLength={1}
            value={digits[i]}
            onChange={handleChange(i)}
            onKeyDown={handleKeyDown(i)}
            onPaste={handlePaste(i)}
            disabled={disabled}
            autoCapitalize="off"
            className="w-10 h-10 sm:w-12 sm:h-12  text-center text-xl sm:text-2xl border-3 border-[#d1d5db] rounded-lg focus:outline-none focus:ring-[1.3px] focus:ring-[#bdbdbd] focus:shadow-[0_0_0_4px_rgba(0,0,0,0.15)] placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            aria-label={`Dígito ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
