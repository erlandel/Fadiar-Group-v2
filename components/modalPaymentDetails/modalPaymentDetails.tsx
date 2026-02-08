"use client";

import CreditCards from "../paymentMethods/creditCards";

type ModalPaymentDetailsProps = {
  show: boolean;
  onClose: () => void;
};

export default function ModalPaymentDetails({
  show,
  onClose,
}: ModalPaymentDetailsProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl p-6 max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="w-full flex justify-center">
          <CreditCards />
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={onClose}
             className="bg-[#022954] text-white h-11 px-6 font-semibold rounded-xl hover:bg-[#034078] hover:shadow-lg hover:scale-103 transition cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
