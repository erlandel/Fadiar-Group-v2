import { useState } from "react";
import { buyerDetailsSchema, BuyerDetailsFormData } from "../validations/buyerDetailsSchema";
import { z } from "zod";

const defaultFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneValue: "",
  phoneCountry: "+53",
  address: "",
  note: "",
};

export function useBuyerDetails() {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof BuyerDetailsFormData, string>>>({});

  // Function to handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    const fieldName = name as keyof BuyerDetailsFormData;
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };

  // Function to handle phone changes
  const handlePhoneChange = (phoneValue: string, countryCode: string) => {
    setFormData((prev) => ({
      ...prev,
      phoneValue,
      phoneCountry: countryCode,
    }));
    // Clear phone error when user types
    if (errors.phoneValue) {
      setErrors((prev) => ({ ...prev, phoneValue: undefined }));
    }
  };

  // Function to validate form
  const validateForm = () => {
    const result = buyerDetailsSchema.safeParse(formData);
    
    if (!result.success) {
      // Show errors
      const fieldErrors: Partial<Record<keyof BuyerDetailsFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof BuyerDetailsFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    
    return true;
  };

  // Function to clear errors
  const clearErrors = () => {
    setErrors({});
  };

  return {
    formData,
    errors,
    handleInputChange,
    handlePhoneChange,
    validateForm,
    clearErrors,
    setFormData,
  };
}
