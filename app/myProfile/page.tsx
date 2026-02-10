"use client";
import Avatar from "@/components/avatar/avatar";
import PersonalData from "@/components/personalData/personalData";
import { SectionMobile } from "@/sections/sectionMobile";
import { BannerMobilePay } from "@/components/banner/bannerMobilePay";
import { BestSelling } from "@/sections/sectionsProducts/bestSelling";
import useAuthStore from "@/store/authStore";

export default function MyProfile() {
  const { auth } = useAuthStore();
  const userName = auth?.person.name || "";
  return (
    <>
      <div className="mx-4  xl:mx-85">
        <div className="mt-10 ">
          <div>
            <h1 className="text-3xl text-primary font-bold ">Mi Perfil</h1>
            <p className="text-[#777777] font-semibold">
              Hola {userName}, aquí puedes gestionar y configurar tu cuenta
            </p>
          </div>

          <div className="mt-10 flex flex-col lg:flex-row w-full space-x-10">
            <div className="w-auto py-6 md:py-0 ">
              <Avatar />
            </div>

            <div className="flex-1 mt-6 md:mt-0">
              <PersonalData />
            </div>
          </div>
        </div>
      </div>

      <div className="sm:py-20  mt-60 sm:mt-10">
        <SectionMobile />
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
