"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string; // Fecha objetivo en ISO format
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const end = new Date(targetDate).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="text-white py-2 flex flex-col  md:items-center md:w-80 2xl:w-full ">

      {/* Contador */}
      <div className="flex gap-2 ">
        <Box value={timeLeft.days} label="días" />
        <Box value={timeLeft.hours} label="horas" />
        <Box value={timeLeft.minutes} label="minutos" />
        <Box value={timeLeft.seconds} label="segundos" />
      </div>
    </div>
  );
}

function Box({ value, label }: { value: string; label: string }) {
  return (
    <div
       data-animate="animate__zoomIn"
    className="bg-[#001730] px-0  sm:px-2  py-2 rounded-lg text-center min-w-19 sm:min-w-20 2xl:min-w-25 h-18 flex flex-col justify-center gap-1 2xl:gap-2 animate-on-scroll [animation-delay:0.5s]">
      <p className="text-xl font-bold leading-tight">{value}</p>
      <span className="text-[#D69F04] text-sm ">{label}</span>
    </div>
  );
}
