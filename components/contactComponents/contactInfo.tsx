"use client";

import { MapPin, Mail, Building2 } from "lucide-react";
import { WhatsAppIcon } from "@/icons/icons";

export function ContactInfo() {
  return (
    <div className="h-full flex flex-col md:flex-row md:justify-around gap-4 items-center">
      <div className="w-full max-w-105 ">
        {/* Dirección */}
        <div className="w-full flex items-center justify-between gap-4 p-4 border border-gray-200  rounded-2xl h-40 sm:h-30 hover:border-accent transition-all hover:scale-101 duration-300 ease-in-out shadow-md ">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary rounded-lg shrink-0">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-1">Dirección</h3>
              <p className="text-gray-600 leading-relaxed">
                Calle 29F entre 114 y 114A, Edificio 11413,             
                Ciudad Libertad, Marianao, La Habana, Cuba
              </p>
            </div>
          </div>
        </div>

        {/* Almacén */}
        <div className="w-full  mt-4 flex items-center justify-between gap-4 p-4 border border-gray-200  rounded-2xl  h-40 sm:h-30 hover:border-accent transition-all hover:scale-101 duration-300 ease-in-out shadow-md ">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary rounded-lg shrink-0">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-1">Almacén</h3>
              <p className="text-gray-600">9A (ENAME)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-105 ">
            {/* WhatsApp */}
        <a 
          href="https://wa.me/5363513228"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-2xl h-40 sm:h-30 hover:border-accent transition-all hover:scale-101 duration-300 ease-in-out shadow-md group"
        >      
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary rounded-lg shrink-0">
              <WhatsAppIcon width={20} height={20} className="text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-1">WhatsApp</h3>
              <p className="text-gray-600 group-hover:text-accent transition-colors">
                +53 63513228
              </p>
            </div>
          </div>
        </a>

        {/* Email */}
        <a 
          href="mailto:atencionalcliente@grupofadiar.com"
          className="w-full max-w-105 mt-4 flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-2xl h-40 sm:h-30 hover:border-accent transition-all hover:scale-101 duration-300 ease-in-out shadow-md group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary rounded-lg shrink-0">
              <Mail className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-1">Email</h3>
              <p className="text-gray-600 group-hover:text-accent transition-colors break-all">
                atencionalcliente@grupofadiar.com
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
