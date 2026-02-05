import { FacebookIcon, InstagramIcon } from "@/icons/icons";
import Link from "next/link";

const ContactSocialNetworks = () => {
  return (
    <div>
      <div className="flex flex-col items-center gap-6 mb-4 mt-10">
        <div className="flex items-center gap-4 w-full max-w-210">
          <div className="h-1 bg-gray-200 grow"></div>
          <h3 className="font-semibold text-primary uppercase tracking-widest text-sm whitespace-nowrap">
            Siguenos en nuestras redes
          </h3>
          <div className="h-1 bg-gray-200 grow"></div>
        </div>

        <div className="flex gap-8">
          <Link
            href="https://www.facebook.com/share/1DmQHQBWvG/?mibextid=wwXIfr"
            target="_blank"
             className="w-15 h-15 flex items-center justify-center bg-primary rounded-full hover:scale-108 transition-all duration-300 shadow-lg group hover:shadow-accent/20"
          >
            <FacebookIcon className="w-10 h-10 text-accent group-hover:text-white transition-colors" />
          </Link>

          <Link
            href="https://www.instagram.com/grupo_fadiar?igsh=eTE5YTduNjN4NW1v&utm_source=qr"
            target="_blank"
            className="w-15 h-15 flex items-center justify-center bg-primary rounded-full hover:scale-108 transition-all duration-300 shadow-lg group hover:shadow-accent/20"
          >
            <InstagramIcon className="w-10 h-10 text-accent group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactSocialNetworks;
