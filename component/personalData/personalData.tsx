"use client";
import { useState, useEffect } from "react";
import { InputField } from "../inputField/inputField";
import PhoneInput from "../phoneInput/phoneInput";
import useAuthStore from "../../store/authStore";
import useImgFileStore from "../../store/imgFileStore";
import { server_url } from "@/lib/apiClient";
import { refreshToken } from "../../utils/refreshToken";
import { personalDataSchema } from "../../validations/personalDataSchema";
import { addressSchema } from "../../validations/addressSchema";
import { updatePasswordSchema } from "../../validations/updatePassword";

export default function PersonalData() {
  const { auth, setAuth } = useAuthStore();
  const { pendingAvatar, clearPendingAvatar } = useImgFileStore();

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneCountry: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (auth?.person) {
      setFormData((prev) => ({
        ...prev,
        firstName: auth.person.name,
        lastName: `${auth.person.lastname1} ${auth.person.lastname2}`.trim(),
        email: auth.user.email,
        phone: auth.person.cellphone2 || "",
        phoneCountry: "",
        address: auth.person.address,
        password: "",
      }));
    }
  }, [auth]);

  // Function to handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (value: string, countryCode: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
      phoneCountry: countryCode,
    }));

    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleSavePersonalData = async () => {
    if (!auth) return;

    const result = personalDataSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const currentAccessToken = await refreshToken(auth, setAuth);

    // Split lastName into lastname1 and lastname2
    const nameParts = formData.lastName.trim().split(/\s+/);
    const lastname1 = nameParts[0] || "";
    const lastname2 = nameParts.slice(1).join(" ") || "";

    const cambios = [
      {
        operation: "update",
        table: "persons",
        attribute: "name",
        value: formData.firstName,
      },
      {
        operation: "update",
        table: "persons",
        attribute: "lastname1",
        value: lastname1,
      },
      {
        operation: "update",
        table: "persons",
        attribute: "lastname2",
        value: lastname2,
      },
      {
        operation: "update",
        table: "users",
        attribute: "email",
        value: formData.email,
      },
      {
        operation: "update",
        table: "persons",
        attribute: "cellphone2",
        value: formData.phone,
      },
    ];

    // Si hay una imagen pendiente, añadirla al array de cambios
    if (pendingAvatar) {
      cambios.push({
        operation: "update",
        table: "users",
        attribute: "img",
        value: pendingAvatar.name,
      });
    }

    console.log("Formato de cambios que se envía al backend:", JSON.stringify(cambios, null, 2));

    const data = new FormData();
    data.append("ci", auth.person.ci);
    data.append("id_user", auth.user.id.toString());
    data.append("current_password", formData.password || auth.user.password || "");
    data.append("changes", JSON.stringify(cambios));

    // Solo mandar la imagen si cambió (si hay un archivo en el store)
    if (pendingAvatar) {
      data.append("file", pendingAvatar);
    }

    // Para visualizar el contenido de FormData en la consola
    console.log("Contenido de FormData (Personal Data):", Object.fromEntries(data.entries()));

    try {
      const response = await fetch(`${server_url}/editUser`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentAccessToken}`,
        },
        body: data,
      });

      if (response.ok) {
        alert("Datos personales actualizados correctamente");
        
        // Si se subió una imagen, limpiar el store
        if (pendingAvatar) {
          clearPendingAvatar();
        }

        setAuth({
          ...auth,
          access_token: currentAccessToken || auth.access_token,
          person: {
            ...auth.person,
            name: formData.firstName,
            lastname1: lastname1,
            lastname2: lastname2,
            cellphone2: formData.phone,
          },
          user: {
            ...auth.user,
            email: formData.email,
          },
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "No se pudo actualizar los datos"}`);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un problema al conectar con el servidor");
    }
  };

  const handleSaveAddress = async () => {
    if (!auth) return;

    const result = addressSchema.safeParse({ address: formData.address });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      return;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.address;
      return newErrors;
    });

    const currentAccessToken = await refreshToken(auth, setAuth);

    const cambios = [
      {
        operation: "update",
        table: "persons",
        attribute: "address",
        value: formData.address,
      },
    ];

    const data = new FormData();
    data.append("ci", auth.person.ci);
    data.append("id_user", auth.user.id.toString());
    data.append("current_password", formData.password || auth.user.password || "");
    data.append("changes", JSON.stringify(cambios));

    try {
      // Para visualizar el contenido de FormData en la consola
      console.log("Contenido de FormData (Address):", Object.fromEntries(data.entries()));

      
      const response = await fetch(`${server_url}/editUser`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentAccessToken}`,
        },
        body: data,
      });

      console.log("response:", response);
      if (response.ok) {
        alert("Dirección actualizada correctamente");
        setAuth({
          ...auth,
          access_token: currentAccessToken || auth.access_token,
          person: {
            ...auth.person,
            address: formData.address,
          },
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "No se pudo actualizar la dirección"}`);
      }
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      alert("Hubo un problema al conectar con el servidor");
    }
  };

  const handleUpdatePassword = async () => {
    if (!auth) return;

    const result = updatePasswordSchema.safeParse({
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      return;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.password;
      delete newErrors.confirmPassword;
      return newErrors;
    });

    const currentAccessToken = await refreshToken(auth, setAuth);

    const cambios = [
      {
        operation: "update",
        table: "users",
        attribute: "password",
        value: formData.confirmPassword,
      },
    ];

    const data = new FormData();
    data.append("ci", auth.person.ci);
    data.append("id_user", auth.user.id.toString());
    data.append("current_password", formData.password || auth.user.password || "");
    data.append("changes", JSON.stringify(cambios));

    try {
        console.log("Contenido de FormData:", Object.fromEntries(data.entries()));
      const response = await fetch(`${server_url}/editUser`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentAccessToken}`,
        },
        body: data,
      });

      console.log("response:", response);
      if (response.ok) {
        alert("Contraseña actualizada correctamente");
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "No se pudo actualizar la contraseña"}`);
      }
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      alert("Hubo un problema al conectar con el servidor");
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center w-full">
          <div>
            <h5 className="text-primary font-bold text-xl">Datos personales</h5>
          </div>

          <div>
            <button
              onClick={handleSavePersonalData}
              className="text-[#D69F04] text-md font-bold cursor-pointer"
            >
              Guradar
            </button>
          </div>
        </div>

        <div className="mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName">Nombre</label>
              <InputField
                type="text"
                placeholder="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm">{errors.firstName}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName">Apellidos</label>
              <InputField
                type="text"
                placeholder="Apellidos"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm">{errors.lastName}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone">Teléfono</label>
              <PhoneInput
                phoneValue={formData.phone}
                countryCode={formData.phoneCountry}
                onChange={handlePhoneChange}
                placeholder="Teléfono"
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">{errors.phone}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email">Correo Electrónico</label>
              <InputField
                type="email"
                placeholder="Correo"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center w-full">
            <div>
              <h5 className="text-primary font-bold text-xl">Dirección</h5>
            </div>

          <div>
            <button
              onClick={handleSaveAddress}
              className="text-[#D69F04] text-md font-bold cursor-pointer"
            >
              Guradar
            </button>
          </div>
          </div>

          <div className="mt-3">
            <label htmlFor="address">Dirección</label>
            <textarea
              placeholder="Escriba su dirección"
              rows={5}
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full rounded-2xl px-4 py-3 bg-[#F5F7FA] text-gray-700 placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {errors.address && (
              <span className="text-red-500 text-sm">{errors.address}</span>
            )}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center w-full">
            <div>
              <h5 className="text-primary font-bold text-xl">Contraseña</h5>
            </div>

          <div>
            <button
              onClick={handleUpdatePassword}
              className="text-[#D69F04] text-md font-bold cursor-pointer"
            >
              Actualizar
            </button>
          </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Contraseña actual</label>
              <InputField
                type="password"
                placeholder="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword">Nueva contraseña</label>
              <InputField
                type="password"
                placeholder="Nueva contraseña"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
