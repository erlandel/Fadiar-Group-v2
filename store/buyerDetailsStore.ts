import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type BuyerDetailsData = {
  paymentMethod: string;
};

export type BuyerDetailsState = {
  buyerDetails: BuyerDetailsData;
  setPaymentMethod: (method: string) => void;
  clearBuyerDetails: () => void;
};

const defaultBuyerDetails: BuyerDetailsData = {
  paymentMethod: "Tarjeta de Crédito/Débito",
};

const BuyerDetailsStore = create<BuyerDetailsState>()(
  persist(
    (set) => ({
      buyerDetails: defaultBuyerDetails,
      setPaymentMethod: (method) =>
        set((state) => ({
          buyerDetails: { ...state.buyerDetails, paymentMethod: method },
        })),
      clearBuyerDetails: () => set(() => ({ buyerDetails: defaultBuyerDetails })),
    }),
    {
      name: "buyer-details-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage)
      ),
      version: 1,
      partialize: (state) => ({ buyerDetails: state.buyerDetails }),
    }
  )
);

export default BuyerDetailsStore;
