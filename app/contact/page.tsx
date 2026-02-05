import { ContactInfo } from "@/components/contactComponents/contactInfo";
import { ContactMap } from "@/components/contactComponents/contactMap";
import ContactSocialNetworks from "@/components/contactComponents/contactSocialNetworks";

const Contact = () => {
  return (
    <>
      <div className="min-h-screen ">
        <div className="px-4 lg:px-25 2xl:px-28 mb-20">
          <div className="mt-10">
            <p className="text-xs text-gray-400 mb-4">
              <span className="text-gray-400">Inicio - </span>
              <span className="text-primary font-semibold">
                Información de Contacto
              </span>
            </p>
            <h1 className="text-3xl text-primary font-bold mb-8">
              Información de Contacto
            </h1>
          </div>

          <div className="w-full">
            <ContactInfo />
          </div>

          <div>
              <ContactSocialNetworks/>
          </div>

          <div className="mt-10">
            <ContactMap />
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
