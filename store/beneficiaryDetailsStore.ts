import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type BeneficiaryDetailsData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneValue: string;
  phoneCountry: string;
  identityCard: string;
  address: string;
  note: string;
};

export type BeneficiaryDetailsState = {
  beneficiaryDetails: BeneficiaryDetailsData;
  setBeneficiaryDetails: (data: BeneficiaryDetailsData) => void;
  clearBeneficiaryDetails: () => void;
};

const defaultBeneficiaryDetails: BeneficiaryDetailsData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneValue: "",
  phoneCountry: "+53",
  identityCard: "",
  address: "",
  note: "",
};

const BeneficiaryDetailsStore = create<BeneficiaryDetailsState>()(
  persist(
    (set) => ({
      beneficiaryDetails: defaultBeneficiaryDetails,
      setBeneficiaryDetails: (data) => set(() => ({ beneficiaryDetails: data })),
      clearBeneficiaryDetails: () => set(() => ({ beneficiaryDetails: defaultBeneficiaryDetails })),
    }),
    {
      name: "beneficiary-details-storage",
      storage: createJSONStorage(() => typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage)),
      version: 1,
      partialize: (state) => ({ beneficiaryDetails: state.beneficiaryDetails }),
    }
  )
);

export default BeneficiaryDetailsStore;
