"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { beneficiaryDetailsSchema } from "../validations/beneficiaryDetailsSchema";
import { deliveryMethodSchema } from "../validations/deliveryMethodSchema";
import BeneficiaryDetailsStore from "../store/beneficiaryDetailsStore";

export type BeneficiaryDetailsFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneValue: string;
  phoneCountry: string;
  identityCard: string;
  address: string;
  note: string;
};

export type BeneficiaryDetailsErrors = {
  [key: string]: string;
};

interface BeneficiaryDetailsContextType {
  formData: BeneficiaryDetailsFormData;
  errors: BeneficiaryDetailsErrors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhoneChange: (phoneValue: string, phoneCountry: string) => void;
  validateAllForms: () => boolean;
  clearErrors: () => void;
  setFormData: (data: BeneficiaryDetailsFormData) => void;
}

const BeneficiaryDetailsContext = createContext<BeneficiaryDetailsContextType | undefined>(undefined);

export const useBeneficiaryDetailsContext = () => {
  const context = useContext(BeneficiaryDetailsContext);
  if (context === undefined) {
    throw new Error("useBeneficiaryDetailsContext must be used within a BeneficiaryDetailsProvider");
  }
  return context;
};

interface BeneficiaryDetailsProviderProps {
  children: ReactNode;
}

export const BeneficiaryDetailsProvider: React.FC<BeneficiaryDetailsProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<BeneficiaryDetailsFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneValue: "",
    phoneCountry: "+53",
    identityCard: "",
    address: "",
    note: "",
  });

  const [errors, setErrors] = useState<BeneficiaryDetailsErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePhoneChange = (phoneValue: string, phoneCountry: string) => {
    setFormData((prev) => ({
      ...prev,
      phoneValue,
      phoneCountry,
    }));
    
    // Limpiar error del teléfono cuando el usuario empieza a escribir
    if (errors.phoneValue) {
      setErrors((prev) => ({
        ...prev,
        phoneValue: "",
      }));
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const validateAllForms = () => {
    clearErrors();
    
    // Validar datos del beneficiario
    const beneficiaryResult = beneficiaryDetailsSchema.safeParse(formData);
    if (!beneficiaryResult.success) {
      const newErrors: BeneficiaryDetailsErrors = {};
      beneficiaryResult.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          newErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    // Validar dirección y nota
    const deliveryData = {
      address: formData.address,
      note: formData.note,
    };
    const deliveryResult = deliveryMethodSchema.safeParse(deliveryData);
    if (!deliveryResult.success) {
      const newErrors: BeneficiaryDetailsErrors = {};
      deliveryResult.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          newErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    // Si todo es válido, guardar en store
    BeneficiaryDetailsStore.getState().setBeneficiaryDetails(formData);
    console.log("Validación exitosa. Todos los datos están correctos.");
    console.log("Datos guardados:", formData);
    
    // Aquí podrías agregar la navegación cuando esté lista
    // router.push('/cart4');
    
    return true;
  };

  return (
    <BeneficiaryDetailsContext.Provider
      value={{
        formData,
        errors,
        handleInputChange,
        handlePhoneChange,
        validateAllForms,
        clearErrors,
        setFormData,
      }}
    >
      {children}
    </BeneficiaryDetailsContext.Provider>
  );
};
