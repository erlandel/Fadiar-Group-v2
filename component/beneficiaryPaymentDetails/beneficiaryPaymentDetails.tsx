import BeneficiaryDetails from "./beneficiaryDetails";
import DeliveryMethod from "./deliveryMethod";
import ShippingMethod from "./shippingMethod";
import { BeneficiaryDetailsProvider } from "../../contexts/BeneficiaryDetailsContext";

export default function BeneficiaryPaymentDetails() {
  return (
    <BeneficiaryDetailsProvider>
      <div className="flex flex-col lg:flex-row space-x-4 mx-4 lg:mx-0 space-y-8 lg:space-y-0">
        <div className="w-full lg:w-1/4">
          <BeneficiaryDetails />
        </div>

       <div className="w-full lg:w-2/4">
            <DeliveryMethod/>
        </div>

        <div className="w-full lg:w-1/4">
            <ShippingMethod/>
        </div>
      </div>
    </BeneficiaryDetailsProvider>
  );
}
