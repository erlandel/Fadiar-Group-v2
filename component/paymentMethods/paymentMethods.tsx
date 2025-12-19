import CreditCards from "./creditCards";
import BuyerDetails from "./buyerDetails";
import CheckoutPayment from "./checkoutPayment";
import { BuyerDetailsProvider } from "../../contexts/BuyerDetailsContext";

export default function PaymentMethods() {
  return (
    <BuyerDetailsProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:flex xl:gap-3 mx-4">
        <div className="order-1">
          <CreditCards />
        </div>

        <div className="order-2 lg:order-3 xl:order-2 lg:col-span-2 xl:col-span-1">
          <BuyerDetails />
        </div>

        <div className="order-3 lg:order-2 xl:order-3">
          <CheckoutPayment />
        </div>
      </div>
    </BuyerDetailsProvider>
  );
}
