import Accordion from "@/component/accordion/accordion";
import { faqData } from "@/data/faqData";
import { SectionAbout3 } from "@/section/aboutUS/sectionAbout3";
import { SectionAbout4 } from "@/section/aboutUS/sectionAbout4";
import SectionPromoHome2 from "@/section/home/sectionPromoHome2";
import { SectionMasRecientes } from "@/section/masRecientes";

export default function Faq() {
  return (
    <div>
      <div className="px-4 md:px-25 2xl:px-28">
        
        <div className="mt-10">
          <p className="text-xs text-gray-400 mb-4">
            <span className="text-gray-400">Home - </span>
            <span className="text-primary font-semibold">FAQ</span>
          </p>
          <h1 className="text-3xl text-primary font-bold mb-8">FAQ</h1>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-5 w-full">
          <div className="lg:w-1/3 md:mt-22 flex flex-col">
            <h1 className="text-3xl font-bold w-full">
              <span className="block text-primary">Preguntas Frecuentes</span>
              <span className="text-[#F5A623]">de nuestros clientes</span>
            </h1>

            <div className="w-86 ">
              <p className="mt-2 ">
                Lorem ipsum Sit amet consectetur. At tristique est adipiscing
                pellentesque vel sit id at
              </p>
            </div>
          </div>

          <div className="mt-4 lg:w-2/3">
            <Accordion items={faqData} />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <SectionAbout3 />
      </div>

      <div className="mt-15">
       
        <div className="block md:hidden">
          <SectionAbout4 />
        </div>

       
        <div className="hidden md:block">
          <SectionPromoHome2 />
        </div>
        <div className="mt-10">
        <SectionMasRecientes />
      </div>
      </div>
    </div>
  );
}
