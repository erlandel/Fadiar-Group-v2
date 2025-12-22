"use client";
import { MaterialIconThemeDependenciesUpdate } from "@/icons/icons";
import { server_url } from "@/lib/apiClient";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import useImgFileStore from "@/store/imgFileStore";

export default function Avatar() {
  const { auth } = useAuthStore();
  const { setPendingAvatar } = useImgFileStore();
  const [avatarSrc, setAvatarSrc] = useState(" "); // Default image
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await fetch(`${server_url}/getUserImageName`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_user: auth?.user.id }),
        });

        const data = await res.json();
        if (data?.image_name) {
          setAvatarSrc(`${server_url}/images/${data.image_name}`);
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    fetchAvatar();
  }, [auth?.user.id]);

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
