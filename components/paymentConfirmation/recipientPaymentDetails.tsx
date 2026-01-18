"use client";

import MatterCart1Store from "@/store/matterCart1Store";
import { useRouter } from "next/navigation";

export default function RecipientPaymentDetails() {
    const router = useRouter();
    const { formData } = MatterCart1Store();

    return(
        <div className="w-full  max-w-120  wrap-break-word">
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
            <span className="text-primary wrap-break-word">{formData.delivery ? "Domicilio" : "Recogida en tienda"}</span>
          </p>
        </div>

        <div className="w-full bg-[#F5F7FA] ">
          <p className="ml-4 text-primary">Datos de beneficiario</p>
        </div>

        <div className="ml-4">
          <p className="text-[gray] ">
            Nombre:{" "}
            <span className="text-primary wrap-break-word">{formData.firstName}</span>
          </p>
        </div>

        <div className="ml-4">
          <p className="text-[gray] ">
            Apellidos:{" "}
            <span className="text-primary wrap-break-word">{`${formData.lastName1} ${formData.lastName2}`.trim()}</span>
          </p>
        </div>

        <div className="ml-4">
          <p className="text-[gray] ">
            Carnet de Identidad:{" "}
            <span className="text-primary wrap-break-word">{formData.identityCard}</span>
          </p>
        </div>
        
        <div className="ml-4">
          <p className="text-[gray] ">
            Teléfono:{" "}
            <span className="text-primary wrap-break-word">{formData.phone}</span>
          </p>
        </div>

        <div className="w-full bg-[#F5F7FA] ">
          <p className="ml-4 text-primary">Dirección de entrega</p>
        </div>

        <div className="ml-4">
          <p className="text-[gray] ">
            Provincia: {" "}
            <span className="text-primary wrap-break-word">{formData.province}</span>
          </p>
        </div>

        <div className="ml-4">
          <p className="text-[gray] ">
            Municipio: {" "}
            <span className="text-primary wrap-break-word">{formData.municipality}</span>
          </p>
        </div>

        {formData.delivery && (
          <div className="ml-4">
            <p className="text-[gray] ">
              Dirección: 
              <span className="text-primary wrap-break-word">{formData.address}</span>
            </p>
          </div>
        )}

        {formData.note && (
          <div className="ml-4">
            <p className="text-[gray] ">
              Nota: {" "}
              <span className="text-primary wrap-break-word">{formData.note}</span>
            </p>
          </div>
        )}

        <div className="w-full  border-b-2 border-gray"></div>
       
        <div className="ml-4">
        <p className="text-accent cursor-pointer" onClick={() => router.push('/cart1')}>Editar datos de entrega</p>
        </div>

      </div>
        </div>
    );
}
