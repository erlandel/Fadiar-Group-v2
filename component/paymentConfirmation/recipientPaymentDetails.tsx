"use client";

import BeneficiaryDetailsStore from "@/store/beneficiaryDetailsStore";
import MatterCart1Store from "@/store/matterCart1Store";
import { useRouter } from "next/navigation";

export default function RecipientPaymentDetails() {
    const router = useRouter();
    const beneficiaryDetails = BeneficiaryDetailsStore((state) => state.beneficiaryDetails);
    const delivery = MatterCart1Store((state) => state.formData.delivery);

    return(
           <div className="  2xl:w-80" style={{ wordWrap: 'break-word' }}>
        <div>
        <h5 className="text-primary font-bold text-xl ml-4 pb-1">
          DATOS DE ENTREGA
        </h5>
        <div className="w-full  border-b-2 border-gray"></div>
      </div>

      <div className="space-y-3 mt-4 ">

        <div className="ml-4">
          <p className="text-[gray] ">
            Método de entrega:{" "}
            <span className="text-primary wrap-break-word">{delivery ? "Domicilio" : "Recogida en tienda"}</span>
          </p>
        </div>

        <div className="w-full bg-[#F5F7FA] ">
          <p className="ml-4 text-primary">Datos de beneficiario</p>
        </div>

        <div className="ml-4">
          <p className="text-[gray] ">
            Nombre:{" "}
            <span className="text-primary wrap-break-word">{beneficiaryDetails.firstName}</span>
          </p>
        </div>

           <div className="ml-4">
          <p className="text-[gray] ">
            Apellidos:{" "}
            <span className="text-primary wrap-break-word">{beneficiaryDetails.lastName}</span>
          </p>
        </div>
        
           <div className="ml-4">
          <p className="text-[gray] ">
            Teléfono:{" "}
            <span className="text-primary wrap-break-word">{beneficiaryDetails.phoneCountry} {beneficiaryDetails.phoneValue}</span>
          </p>
        </div>

           <div className="ml-4">
          <p className="text-[gray] ">
            Correo electrónico: {" "}
            <span className="text-primary wrap-break-word">{beneficiaryDetails.email}</span>
          </p>

        </div>
          <div className="w-full bg-[#F5F7FA] ">
          <p className="ml-4 text-primary">Dirección de entrega</p>
        </div>

           <div className="ml-4">
          <p className="text-[gray] ">
            Dirección: {" "}
            <span className="text-primary wrap-break-word">{beneficiaryDetails.address}</span>
          </p>
        </div> 

            <div className="w-full  border-b-2 border-gray"></div>
           
            <div className="ml-4">
            <p className="text-accent cursor-pointer" onClick={() => router.push('/cart3')}>Editar datos de entrega</p>
            </div>

      </div>
        </div>
    );
}