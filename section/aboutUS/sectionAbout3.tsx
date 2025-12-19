import ButtonPromoHome1 from "@/component/button/buttonPromoHome1";
import { ArrowDownToLine } from "lucide-react";



export const SectionAbout3 = () => {
  return (
    <>
      <div className="flex flex-col md:gap-20  md:flex-row items-center justify-center w-full h-72  my-50 md:my-0">
        <div>
          <img
          data-animate="animate__flipInY"
            src="/images/mobile.svg"
            alt="Group"
            className="w-full  h-72 object-cover animate-on-scroll animate__slow  [animation-delay:0.6s] "
          />
        </div>

        <div className="mx-4 mt-20 md:mt-0 md:mx-0 md:w-140">
          <p className="text-gray-500 text-md">Al alcance de su mano</p>
          <h1 className="text-3xl font-bold">
            Descargue nuestra App{" "}
            <span className="text-[#F5A623]">Grupo Fadiar</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est a, mattis tellus.
          </p>
          <div className="mt-8">
            <ButtonPromoHome1 
            name="Descargar"
            color="#022854" 
            icon={<ArrowDownToLine  />}
            iconPosition="left"
            className = "inline-flex items-center sm:gap-2 rounded-xl px-6 sm:px-6 py-2 gap-1 sm:py-3 text-sm font-inter font-semibold text-white shadow-md transition hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            />
          </div>
        </div>
      </div>
    </>
  );
};
