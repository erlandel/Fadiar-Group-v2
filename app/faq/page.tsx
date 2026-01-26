import Accordion from "@/components/accordion/accordion";
import { frequentlyAskedQuestions } from "@/data/frequentlyAskedQuestions";
import { homeDeliveryPolicy } from "@/data/homeDeliveryPolicy";
import { warrantyPolicy } from "@/data/warrantyPolicy";
import { SectionMobile } from "@/sections/sectionMobile";
import { BannerMoney } from "@/components/banner/bannerMoney";
import { BestSelling } from "@/sections/sectionsProducts/bestSelling";
import BannerEngine from "@/components/banner/bannerEngine";
import { LatestProducts } from "@/sections/sectionsProducts/latestProducts";

export default function Faq() {
  return (
    <div>
      <div className="px-4 md:px-25 2xl:px-28">
        <div className="mt-10">
          <p className="text-xs text-gray-400 mb-4">
            <span className="text-gray-400">Inicio  - </span>
            <span className="text-primary font-semibold">Preguntas Frecuentes</span>
          </p>
          <h1 className="text-3xl text-primary font-bold mb-8">Preguntas Frecuentes</h1>
        </div>

        <section>
          <div className="flex flex-col lg:flex-row justify-center gap-5 w-full">
            <div className="lg:w-1/3 md:mt-22 flex flex-col">
              <h1 className="text-3xl font-bold w-full">
                <span className="block text-primary">Preguntas Frecuentes</span>
                <span className="text-[#F5A623]">de nuestros clientes</span>
              </h1>

              <div className="w-86 ">
                {/* <p className="mt-2 ">
                  Lorem ipsum Sit amet consectetur. At tristique est adipiscing
                  pellentesque vel sit id at
                </p> */}
              </div>
            </div>

            <div className="mt-4 lg:w-2/3">
              <Accordion items={frequentlyAskedQuestions} />
            </div>
          </div>
        </section>       



   

      </div>

      <div className="mt-10">
        <SectionMobile />
      </div>


         <div className="mt-15">
          
        <div className="block md:hidden">
          <BannerMoney />
        </div>

           <div className="hidden md:block">
        <BannerEngine/>
      </div>


        <div className="hidden xl:block mt-10">
          <LatestProducts />
        </div>

        <div className="xl:hidden">
          <BestSelling />
        </div>
      </div>
    </div>
  );
}
