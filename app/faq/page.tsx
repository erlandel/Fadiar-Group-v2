import Link from "next/link";
import Accordion from "@/components/accordion/accordion";
import { frequentlyAskedQuestions } from "@/data/frequentlyAskedQuestions";
import { SectionMobile } from "@/sections/sectionMobile";
import { BannerMobilePay } from "@/components/banner/bannerMobilePay";
import { BestSelling } from "@/sections/sectionsProducts/bestSelling";
import BannerUpcomingProducts from "@/components/banner/bannerUpcomingProducts";
import { LatestProducts } from "@/sections/sectionsProducts/latestProducts";

export default function Faq() {
  return (
    <div>
      <div className="px-4 md:px-25 2xl:px-28">
        <div className="mt-10">
          <p className="text-xs text-gray-400 mb-4">
            <Link href="/" className="text-gray-400 cursor-pointer">
              Inicio -{" "}
            </Link>
            <span className="text-primary font-semibold">
              Preguntas Frecuentes
            </span>
          </p>
          <h1 className="text-3xl text-primary font-bold mb-8">
            Preguntas Frecuentes
          </h1>
        </div>

        <section>
          <div className="flex flex-col lg:flex-row justify-center gap-5 w-full">
            <div className="lg:w-1/3 md:mt-22 flex flex-col">
              <h1 className="text-3xl font-bold w-full">
                <span className="block text-primary">Preguntas Frecuentes</span>
                <span className="text-[#F5A623]">de nuestros clientes</span>
              </h1>

              <div className="w-86 ">
           
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
          <BannerMobilePay />
        </div>

        <div className="hidden md:block">
          <BannerUpcomingProducts />
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
