import CreditCards from "./creditCards";
import BuyerDetails from "./buyerDetails";
import CheckoutPayment from "./checkoutPayment";
import { BuyerDetailsProvider } from "../../contexts/BuyerDetailsContext";

export default function PaymentMethods() {
  return (
    <BuyerDetailsProvider>
     <div className="flex flex-col lg:grid lg:grid-cols-2 xl:flex xl:flex-row xl:justify-center items-start gap-10 lg:gap-6 xl:gap-4 mx-4">
  <div className="w-full lg:col-span-2 xl:col-span-1 xl:w-auto">
    <CreditCards />
  </div>

  <div className="w-full lg:col-span-1 xl:w-auto">
    <BuyerDetails />
  </div>

  <div className="w-full lg:col-span-1 xl:w-auto">
    <CheckoutPayment />
  </div>
</div>

    </BuyerDetailsProvider>
  );
}
