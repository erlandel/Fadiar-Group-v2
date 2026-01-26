"use client";
import { MaterialIconThemeDependenciesUpdate } from "@/icons/icons";
import { refreshToken } from "@/utils/refreshToken";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import useImgFileStore from "@/store/imgFileStore";
import { getUserImageNameUrl, server_url } from "@/urlApi/urlApi";

export default function Avatar() {
  const { auth, setAuth } = useAuthStore();
  const { pendingAvatar, setPendingAvatar } = useImgFileStore();
  const [avatarSrc, setAvatarSrc] = useState<string>("/images/avatar.webp");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wasPending = useRef(false);

  // Sincronizar con el store de auth cuando cambie la imagen o se hidrate
  useEffect(() => {
    // Si hay un avatar pendiente (seleccionado localmente), no lo sobrescribimos
    if (pendingAvatar) {
      wasPending.current = true;
      return;
    }

    if (auth?.user?.img) {
      setAvatarSrc(`${server_url}/${auth.user.img}`);
    } else {
      setAvatarSrc("/images/avatar.webp");
    }
  }, [auth?.user?.img, auth?.user?.id, pendingAvatar]);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!auth?.user?.id || pendingAvatar) return;

      // Solo realizamos la petición si no tenemos imagen o si acabamos de terminar una subida
      const shouldFetch = !auth?.user?.img || wasPending.current;
      if (!shouldFetch) return;

      let currentAccessToken = auth.access_token;
      if (!currentAccessToken) {
        const newAccessToken = await refreshToken(auth, setAuth);
        if (newAccessToken) {
          currentAccessToken = newAccessToken;
        } else {
          console.error("Failed to refresh token, cannot fetch avatar.");
          return;
        }
      }
      try {
        const res = await fetch(`${getUserImageNameUrl}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentAccessToken}`,
          },
          body: JSON.stringify({ id_user: auth.user.id }),
        });

        const data = await res.json();
        if (data?.img && !pendingAvatar) {
          const newSrc = `${server_url}/${data.img}`;
          setAvatarSrc(newSrc);

          // Actualizamos el store para persistir el nombre de la imagen y evitar futuras peticiones innecesarias
          if (auth && data.img !== auth.user.img) {
            setAuth({
              ...auth,
              user: {
                ...auth.user,
                img: data.img,
              },
            });
          }
        } else if (!pendingAvatar) {
          setAvatarSrc("/images/avatar.webp");
        }
        wasPending.current = false;
      } catch (error) {
        console.error("Error fetching avatar:", error);
        if (!pendingAvatar) {
          setAvatarSrc("/images/avatar.webp");
        }
      }
    };
    fetchAvatar();
  }, [auth?.user?.id, auth?.user?.img, pendingAvatar, setAuth]);

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
