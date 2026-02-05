"use client";
import { useState } from "react";
import { Users, ShoppingBag, Package } from "lucide-react";
import { useAbout } from "@/hooks/aboutRequests/useAbout";

export const BannerWorkersFadiar = () => {
  const { data: statistics = [] } = useAbout();
  const [activeTouches, setActiveTouches] = useState<Record<number, boolean>>({});

  const handleTouch = (index: number) => {
    setActiveTouches((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setActiveTouches((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
    }, 1000);
  };

  const icons = [Users, ShoppingBag, Package];

  return (
    <>
      <div className="relative w-full h-60 sm:h-110 text-white">
        <img
          src="/images/groupFadiar.webp"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-[50%_30%]"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 w-full h-full flex items-end px-4 sm:px-20">
          <div className="w-full gap-8 sm:gap-0 flex items-end justify-around px-6 sm:px-0 mb-2">
            {statistics.map((item, index) => (
              <div
                key={index}
                onClick={() => handleTouch(index)}
                className="sm:w-52 flex flex-col items-center justify-end md:justify-center text-right sm:text-center gap-4 sm:gap-3 group perspective-[1000px] "
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 sm:w-16 sm:h-16 shrink-0 rounded-full border-2 border-[#f7c948] shadow-lg sm:mb-2 transition-all duration-0 ease-in-out group-hover:duration-1000 group-hover:transform-[rotateY(360deg)_scale(1.0)] ${
                    activeTouches[index]
                      ? "duration-1000 transform-[rotateY(360deg)_scale(1.0)]"
                      : ""
                  }`}
                >
                  {(() => {
                    const Icon = icons[index % icons.length];
                    return <Icon className="w-4 h-4 sm:w-7 sm:h-7 text-[#f7c948]" />;
                  })()}
                </div>

                <div className="flex flex-col items-center">
                  <h4 className="text-md sm:text-4xl font-bold text-[#f7c948] leading-none">
                    {Number(item.text).toLocaleString("de-DE")}
                  </h4>
                  <p className="text-xs sm:text-lg text-white text-center">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
