import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type BuyerDetailsData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneValue: string;
  phoneCountry: string;
  address: string;
  note: string;
  paymentMethod: string;
};

export type BuyerDetailsState = {
  buyerDetails: BuyerDetailsData;
  setBuyerDetails: (data: BuyerDetailsData) => void;
  clearBuyerDetails: () => void;
  setPaymentMethod: (method: string) => void;
};

const defaultBuyerDetails: BuyerDetailsData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneValue: "",
  phoneCountry: "+53",
  address: "",
  note: "",
  paymentMethod: "Tarjetas de crédito o débito", // Por defecto
};

const BuyerDetailsStore = create<BuyerDetailsState>()(
  persist(
    (set) => ({
      buyerDetails: defaultBuyerDetails,
      setBuyerDetails: (data) => set(() => ({ buyerDetails: data })),
      clearBuyerDetails: () => set(() => ({ buyerDetails: defaultBuyerDetails })),
      setPaymentMethod: (method) => set((state) => ({ 
        buyerDetails: { ...state.buyerDetails, paymentMethod: method }
      })),
    }),
    {
      name: "buyer-details-storage",
      storage: createJSONStorage(() => typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage)),
      version: 1,
      partialize: (state) => ({ buyerDetails: state.buyerDetails }),
    }
  )
);

export default BuyerDetailsStore;
