import Link from "next/link";
import PaymentConfirmation from "@/components/paymentConfirmation/paymentConfirmation";
import { CheckoutStepper } from "@/components/ui/stepper";
import { SectionMobile } from "@/sections/sectionMobile";
import { BannerMobilePay } from "@/components/banner/bannerMobilePay";
import { BestSelling } from "@/sections/sectionsProducts/bestSelling";

export default function Cart3() {
  return (
    <>
      <div className="   lg:px-15 ">
        <div className="mx-4">
          <div className="mt-10 ">
            <p className="text-xs text-gray-400 mb-4">
              <Link href="/" className="text-gray-400 cursor-pointer">
                Inicio -{" "}
              </Link>
              <Link href="/cart1" className="text-gray-400 cursor-pointer">
                Carrito de Compras -{" "}
              </Link>
              <span className="text-primary font-semibold">Confirmación</span>
            </p>
            <h1 className="text-3xl text-primary font-bold ">Confirmación</h1>
          </div>

          <div className="flex justify-center items-center ">
            <div className=" w-160 ml-2  lg:ml-20">
              <CheckoutStepper currentStep={2} />
            </div>
          </div>
        </div>

        <div className="mt-15 mx-4 2xl:mx-0">
          <PaymentConfirmation />
        </div>

        <div className="sm:py-20  ">
          <SectionMobile />
        </div>
      </div>

      <div className="sm:hidden mt-60">
        <BannerMobilePay />
      </div>

      <div className="xl:hidden">
        <BestSelling />
      </div>
    </>
  );
}
