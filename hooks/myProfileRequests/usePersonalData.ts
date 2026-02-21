import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../../store/authStore";
import useImgFileStore from "../../store/imgFileStore";
import { refreshToken } from "../../utils/refreshToken";
import { personalDataSchema } from "../../validations/personalDataSchema";
import { addressSchema } from "../../validations/addressSchema";
import { updatePasswordSchema } from "../../validations/updatePassword";
import SuccesMessage from "@/messages/succesMessage";
import ErrorMessage from "@/messages/errorMessage";
import WarningMenssage from "@/messages/warningMenssage";
import { editUserUrl, server_url } from "@/urlApi/urlApi";

export const usePersonalData = () => {
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

  const performUpdate = async ({
    changes,
    currentPassword,
    file = null,
    errorMessage = "No se pudo actualizar los datos",
  }: {
    changes: {
      operation: string;
      table: string;
      attribute: string;
      value: string;
    }[];
    currentPassword: string;
    file?: File | null;
    errorMessage?: string;
  }) => {
    if (!auth) {
      throw new Error("No hay sesión activa");
    }

    const currentAccessToken = await refreshToken(auth, setAuth);

    const data = new FormData();
    data.append("ci", auth.person.id);
    data.append("id_user", auth.user.id);
    data.append("current_password", currentPassword);
    data.append("changes", JSON.stringify(changes));

    if (file) {
      data.append("file", file);
    }

 

    const response = await fetch(`${editUserUrl}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorMessage);
    }

    return { currentAccessToken };
  };

  useEffect(() => {
    if (auth?.person) {
      setFormData((prev) => ({
        ...prev,
        firstName: auth.person.name,
        lastName: `${auth.person.lastname1} ${auth.person.lastname2}`.trim(),
        email: auth.user.email,
        phone: auth.person.cellphone1 || "",
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
      return performUpdate({
        changes: payload.cambios,
        currentPassword: payload.currentPassword,
        file: payload.file,
        errorMessage: "No se pudo actualizar los datos",
      });
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
          cellphone1: variables.phone,
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
      const cambios = [
        {
          operation: "UPDATE",
          table: "persons",
          attribute: "address",
          value: payload.address,
        },
      ];

      const result = await performUpdate({
        changes: cambios,
        currentPassword: payload.currentPassword,
        errorMessage: "No se pudo actualizar la dirección",
      });

      return {
        ...result,
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
      const cambios = [
        {
          operation: "UPDATE",
          table: "users",
          attribute: "password",
          value: payload.newPassword,
        },
      ];

      return performUpdate({
        changes: cambios,
        currentPassword: payload.currentPassword,
        errorMessage: "No se pudo actualizar la contraseña",
      });
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

    if (formData.phone !== (auth.person.cellphone1 || "")) {
      cambios.push({
        operation: "UPDATE",
        table: "persons",
        attribute: "cellphone1",
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

  return {
    formData,
    errors,
    handleInputChange,
    handlePhoneChange,
    handleSavePersonalData,
    handleSaveAddress,
    handleUpdatePassword,
    isPersonalDataPending: personalDataMutation.isPending,
    isAddressPending: addressMutation.isPending,
    isPasswordPending: passwordMutation.isPending,
  };
};
