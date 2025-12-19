import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  LocationIcon,
  PhoneIcon,
  EmailIcon,
} from "@/icons/icons";

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-4  p-10 w-full">
      <div className="flex flex-col md:flex-row  md:items-center justify-start md:justify-around gpp-4 w-full">
        <div>
          <div>
            <img src="/images/logoWhite.svg" alt="logo" className="w-40 h-20" />
          </div>
          <div className="mt-25 hidden md:block">
            <p>© 2025 Fadiar. Todos los derechos reservados.</p>
          </div>
        </div>

        <div className="space-y-6 mt-4 md:mt-0">
          <h4 className="text-2xl ">Enlaces</h4>

          <Link
            href="/terrazas"
            className="text-gray-300 hover:text-accent transition-colors block"
          >
            Terrazas y Condiciones
          </Link>

          <Link
            href="/privacidad"
            className="text-gray-300 hover:text-accent transition-colors"
          >
            Política de Privacidad
          </Link>

          <div className="flex gap-4 mt-8 md:mt-12">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <FacebookIcon width={32} height={32} />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <InstagramIcon width={32} height={32} />
            </Link>
            <Link
              href="https://tiktok.com"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <TikTokIcon width={32} height={32} />
            </Link>
            <Link
              href="https://wa.me/5363513228"
              target="_blank"
              className="hover:scale-110 transition-transform"
            >
              <WhatsAppIcon width={32} height={32} />
            </Link>
          </div>
        </div>

        <div className="space-y-4 mt-12 md:mt-0">
          <h4 className="text-2xl mb-6">Contáctenos</h4>

          <div className="flex items-start gap-3">
            <LocationIcon
              width={24}
              height={24}
              className="text-accent shrink-0 mt-1"
            />
            <div>
              <p className="text-gray-300">
                Calle 29F entre 114 y 114A, Edificio 11413,
              </p>
              <p className="text-gray-300">
                Ciudad Libertad, Marianao, La Habana, Cuba
              </p>
              <p className="text-accent mt-1">Almacén 9A (ENAME)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PhoneIcon width={24} height={24} className="text-accent" />
            <a
              href="tel:+5363513228"
              className="text-gray-300 hover:text-accent transition-colors"
            >
              +53 63513228
            </a>
          </div>

          <div className="flex items-center gap-3">
            <EmailIcon width={24} height={24} className="text-accent" />
            <a
              href="mailto:comercial@fadiar.com"
              className="text-gray-300 hover:text-accent transition-colors"
            >
              comercial@fadiar.com
            </a>
          </div>
         
        </div>
         <div className=" mt-14 md:mt-25 text-sm md:hidden">
            <p>© 2025 Fadiar. Todos los derechos reservados.</p>
          </div>
      </div>
        
    </footer>
  );
}
