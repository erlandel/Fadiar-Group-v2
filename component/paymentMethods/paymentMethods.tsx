import CreditCards from "./creditCards";
import BuyerDetails from "./buyerDetails";
import CheckoutPayment from "./checkoutPayment";
import { BuyerDetailsProvider } from "../../contexts/BuyerDetailsContext";

export default function PaymentMethods() {
  return (
    <BuyerDetailsProvider>
     <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center xl:flex xl:gap-3 mx-4 space-y-10 lg:space-y-0">
  <div className="order-1 lg:col-span-2 xl:col-span-1">
    <CreditCards />
  </div>

  <div className="order-2 lg:col-span-1 lg:mt-10 xl:mt-0">
    <BuyerDetails />
  </div>

  <div className="order-3 lg:col-span-1  lg:mt-10 lg:ml-2 xl:ml-0 xl:mt-0">
    <CheckoutPayment />
  </div>
</div>

    </BuyerDetailsProvider>
  );
}
