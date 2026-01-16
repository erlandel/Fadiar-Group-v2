"use client";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { InputField } from "../inputField/inputField";
import PhoneInput from "../phoneInput/phoneInput";
import useAuthStore from "../../store/authStore";
import useImgFileStore from "../../store/imgFileStore";
import { server_url } from "@/lib/apiClient";
import { refreshToken } from "../../utils/refreshToken";
import { personalDataSchema } from "../../validations/personalDataSchema";
import { addressSchema } from "../../validations/addressSchema";
import { updatePasswordSchema } from "../../validations/updatePassword";
import SuccesMessage from "@/messages/succesMessage";
import ErrorMessage from "@/messages/errorMessage";
import WarningMenssage from "@/messages/warningMenssage";
import { Loader } from "lucide-react";

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
        address: auth.person.address,
        password: "",
      }));
    }
  }, [auth]);

  const personalDataMutation = useMutation({
    mutationFn: async (payload: {
      cambios: {
        operation: string;
        table: string;
        attribute: string;
        value: string;
      }[];
      currentPassword: string;
      file: File | null;
      firstName: string;
      lastname1: string;
      lastname2: string;
      phone: string;
    }) => {
      if (!auth) {
        throw new Error("No hay sesión activa");
      }

      const currentAccessToken = await refreshToken(auth, setAuth);

      const data = new FormData();
      data.append("ci", auth.person.id.toString());
      data.append("id_user", auth.user.id.toString());
      data.append("current_password", payload.currentPassword);
      data.append("changes", JSON.stringify(payload.cambios));

      if (payload.file) {
        data.append("file", payload.file);
      }

      console.log(
        "Contenido de FormData (Personal Data):",
        Object.fromEntries(data.entries())
      );

      const response = await fetch(`${server_url}/editUser`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentAccessToken}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "No se pudo actualizar los datos"
        );
      }

      return {
        currentAccessToken,
      };
    },
    onSuccess: (result, variables) => {
      if (!auth) {
        return;
      }

      SuccesMessage("Datos personales actualizados correctamente");

      if (variables.file) {
        clearPendingAvatar();
      }

      setAuth({
        ...auth,
        access_token: result.currentAccessToken || auth.access_token,
        person: {
          ...auth.person,
          name: variables.firstName,
          lastname1: variables.lastname1,
          lastname2: variables.lastname2,
          cellphone2: variables.phone,
        },
        user: {
          ...auth.user,
        },
      });
    },
    onError: (error: any) => {
      const message = error?.message || "No se pudo actualizar los datos";
      ErrorMessage(`Error: ${message}`);
    },
  });

  const addressMutation = useMutation({
    mutationFn: async (payload: {
      address: string;
      currentPassword: string;
    }) => {
      if (!auth) {
        throw new Error("No hay sesión activa");
      }

      const currentAccessToken = await refreshToken(auth, setAuth);

      const cambios = [
        {
          operation: "UPDATE",
          table: "persons",
          attribute: "address",
          value: payload.address,
        },
      ];

      const data = new FormData();
      data.append("ci", auth.person.id.toString());
      data.append("id_user", auth.user.id.toString());
      data.append("current_password", payload.currentPassword);
      data.append("changes", JSON.stringify(cambios));

      console.log(
        "Contenido de FormData (Address):",
        Object.fromEntries(data.entries())
      );

      const response = await fetch(`${server_url}/editUser`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentAccessToken}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "No se pudo actualizar la dirección"
        );
      }

      return {
        currentAccessToken,
        address: payload.address,
      };
    },
    onSuccess: (result) => {
      if (!auth) {
        return;
      }

      SuccesMessage("Dirección actualizada correctamente");

      setAuth({
        ...auth,
        access_token: result.currentAccessToken || auth.access_token,
        person: {
          ...auth.person,
          address: result.address,
        },
      });
    },
    onError: (error: any) => {
      const message =
        error?.message || "No se pudo actualizar la dirección";
      ErrorMessage(`Error: ${message}`);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async (payload: {
      currentPassword: string;
      newPassword: string;
    }) => {
      if (!auth) {
        throw new Error("No hay sesión activa");
      }

      const currentAccessToken = await refreshToken(auth, setAuth);

      const cambios = [
        {
          operation: "UPDATE",
          table: "users",
          attribute: "password",
          value: payload.newPassword,
        },
      ];

      const data = new FormData();
      data.append("ci", auth.person.id.toString());
      data.append("id_user", auth.user.id.toString());
      data.append("current_password", payload.currentPassword);
      data.append("changes", JSON.stringify(cambios));

      console.log(
        "Contenido de FormData (Password):",
        Object.fromEntries(data.entries())
      );

      const response = await fetch(`${server_url}/editUser`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentAccessToken}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "No se pudo actualizar la contraseña"
        );
      }

      return {
        currentAccessToken,
      };
    },
    onSuccess: () => {
      SuccesMessage("Contraseña actualizada correctamente");
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    },
    onError: (error: any) => {
      const message =
        error?.message || "No se pudo actualizar la contraseña";
      ErrorMessage(`Error: ${message}`);
    },
  });

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

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));

    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleSavePersonalData = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

    // Split lastName into lastname1 and lastname2
    const nameParts = formData.lastName.trim().split(/\s+/);
    const lastname1 = nameParts[0] || "";
    const lastname2 = nameParts.slice(1).join(" ") || "";

    const cambios = [];

    if (formData.firstName !== auth.person.name) {
      cambios.push({
        operation: "UPDATE",
        table: "persons",
        attribute: "name",
        value: formData.firstName,
      });
    }

    if (lastname1 !== auth.person.lastname1) {
      cambios.push({
        operation: "UPDATE",
        table: "persons",
        attribute: "lastname1",
        value: lastname1,
      });
    }

    if (lastname2 !== (auth.person.lastname2 || "")) {
      cambios.push({
        operation: "UPDATE",
        table: "persons",
        attribute: "lastname2",
        value: lastname2,
      });
    }



    if (formData.phone !== (auth.person.cellphone2 || "")) {
      cambios.push({
        operation: "UPDATE",
        table: "persons",
        attribute: "cellphone2",
        value: formData.phone,
      });
    }

    // Si hay una imagen pendiente, añadirla al array de cambios
    if (pendingAvatar) {
      cambios.push({
        operation: "update",
        table: "users",
        attribute: "img",
        value: pendingAvatar.name,
      });
    }

    if (cambios.length === 0) {
      WarningMenssage("No se detectaron cambios para actualizar");
      return;
    }

    personalDataMutation.mutate({
      cambios,
      currentPassword: formData.password || auth.user.password || "",
      file: pendingAvatar || null,
      firstName: formData.firstName,
      lastname1,
      lastname2,
      phone: formData.phone,
    });
  };

  const handleSaveAddress = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

    const currentAddress = (formData.address || "").trim();
    const originalAddress = (auth.person.address || "").trim();

    if (currentAddress === originalAddress) {
      WarningMenssage("No se detectaron cambios en la dirección");
      return;
    }

    addressMutation.mutate({
      address: currentAddress,
      currentPassword: formData.password || auth.user.password || "",
    });
  };

  const handleUpdatePassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

    if (formData.confirmPassword === formData.password) {
      ErrorMessage("La nueva contraseña no puede ser igual a la actual");
      return;
    }

    passwordMutation.mutate({
      currentPassword: formData.password || auth.user.password || "",
      newPassword: formData.confirmPassword,
    });
  };

  return (
    <>
      <div className="w-full">
        <form onSubmit={handleSavePersonalData}>
          <div className="flex justify-between items-center w-full">
            <div>
              <h5 className="text-primary font-bold text-xl">Datos personales</h5>
            </div>

            <div>
              <button
                type="submit"
                className="text-[#D69F04] text-md font-bold cursor-pointer disabled:opacity-100 disabled:cursor-pointer"
                disabled={personalDataMutation.isPending}
              >
                {personalDataMutation.isPending ? (
                  <span className="inline-flex items-center justify-center ">
                    <Loader className="h-5 w-5 animate-spin " strokeWidth={3}/>
                    Guardar
                  </span>
                ) : (
                  "Guardar"
                )}
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
                  autoComplete="given-name"
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
                  autoComplete="family-name"
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
                  value={formData.phone}
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
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  readOnly
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email}</span>
                )}
              </div>
            </div>
          </div>
        </form>

        <form onSubmit={handleSaveAddress} className="mt-10">
          <div className="flex justify-between items-center w-full">
            <div>
              <h5 className="text-primary font-bold text-xl">Dirección</h5>
            </div>

            <div>
              <button
                type="submit"
                className="text-[#D69F04] text-md font-bold cursor-pointer disabled:opacity-100 disabled:cursor-pointer"
                disabled={addressMutation.isPending}
              >
                {addressMutation.isPending ? (
                  <span className="inline-flex items-center justify-center ">
                    <Loader className="h-5 w-5 animate-spin" strokeWidth={3} />
                    Guardar
                  </span>
                ) : (
                  "Guardar"
                )}
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
        </form>

        <form onSubmit={handleUpdatePassword} className="mt-10">
          <div className="flex justify-between items-center w-full">
            <div>
              <h5 className="text-primary font-bold text-xl">Contraseña</h5>
            </div>

            <div>
              <button
                type="submit"
                className="text-[#D69F04] text-md font-bold cursor-pointer disabled:opacity-100 disabled:cursor-pointer"
                disabled={passwordMutation.isPending}
              >
                {passwordMutation.isPending ? (
                  <span className="inline-flex items-center justify-center ">
                    <Loader className="h-5 w-5 animate-spin" strokeWidth={3} />
                    Actualizar
                  </span>
                ) : (
                  "Actualizar"
                )}
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
                autoComplete="current-password"
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
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
