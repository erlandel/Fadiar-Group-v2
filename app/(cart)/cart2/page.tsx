import PaymentMethods from "@/components/paymentMethods/paymentMethods";
import { CheckoutStepper } from "@/components/ui/stepper";
import { SectionAbout3 } from "@/section/aboutUS/sectionAbout3";
import { SectionAbout4 } from "@/section/aboutUS/sectionAbout4";
import { BestSelling } from "@/section/bestSelling/bestSelling";

export default function Cart2() {
  return (
    <div>
      <div className="xl:px-40 ">
        <div className="mx-4">
          <div className="mt-10 ">
            <p className="text-xs text-gray-400 mb-4">
              <span className="text-gray-400">
                Home - Carrito de Compras -{" "}
              </span>
              <span className="text-primary font-semibold">Formas de Pago</span>
            </p>
            <h1 className="text-3xl text-primary font-bold ">Formas de Pago</h1>
          </div>

          <div className="flex justify-center items-center ">
            <div className=" w-160 ml-2  lg:ml-20">
              <CheckoutStepper currentStep={1} />
            </div>
          </div>
        </div>

        <div className="mt-20 ">
          <PaymentMethods />
        </div>

        <div className="sm:py-20  mt-70 sm:mt-20">
          <SectionAbout3 />
        </div>
      </div>
      <div className="sm:hidden mt-60">
        <SectionAbout4 />
      </div>

      <div className="xl:hidden">
        <BestSelling />
      </div>
    </div>
  );
}
