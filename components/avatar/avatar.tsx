"use client";
import { MaterialIconThemeDependenciesUpdate } from "@/icons/icons";
import { server_url } from "@/lib/apiClient";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import useImgFileStore from "@/store/imgFileStore";

export default function Avatar() {
  const { auth } = useAuthStore();
  const { pendingAvatar, setPendingAvatar } = useImgFileStore();
  const [avatarSrc, setAvatarSrc] = useState<string>("/images/avatar.webp");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar con el store de auth cuando cambie la imagen o se hidrate
  useEffect(() => {
    // Si hay un avatar pendiente (seleccionado localmente), no lo sobrescribimos
    if (pendingAvatar) return;

    if (auth?.user?.img) {
      setAvatarSrc(`${server_url}/${auth.user.img}`);
    } else {
      setAvatarSrc("/images/avatar.png");
    }
  }, [auth?.user?.img, auth?.user?.id, pendingAvatar]);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!auth?.user?.id || pendingAvatar) return;
      try {
        const res = await fetch(`${server_url}/getUserImageName`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_user: auth.user.id }),
        });

        const data = await res.json();
        console.log("data:", data);
        if (data?.img && !pendingAvatar) {
          const newSrc = `${server_url}/${data.img}`;
          setAvatarSrc(newSrc);
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    fetchAvatar();
  }, [auth?.user?.id, pendingAvatar]);

  const handleClick = () => {
    fileInputRef.current?.click(); // Abrir selector de archivos
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Guardar el archivo en el store para enviarlo luego
    setPendingAvatar(file);

    // Mostrar imagen localmente sin subir al servidor
    const localUrl = URL.createObjectURL(file);
    setAvatarSrc(localUrl);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h5 className="text-primary font-bold text-xl">Avatar</h5>
      <div className="relative mt-4">
        <img src={avatarSrc} alt="avatar" className="w-40 h-40 rounded-full" />
        <div
          onClick={handleClick}
          className="absolute bottom-0 right-0 bg-[#F5A51D] rounded-full p-2 cursor-pointer"
        >
          <MaterialIconThemeDependenciesUpdate />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
}
