import CreditCards from "./creditCards";
import CheckoutPayment from "./checkoutPayment";
import { BuyerDetailsProvider } from "../../contexts/BuyerDetailsContext";

export default function PaymentMethods() {
  return (
    <BuyerDetailsProvider>
      <div className="flex flex-col mx-4  justify-center items-center md:items-start md:flex-row sm:justify-around  gap-2">
        <div >
          <CreditCards />
        </div>

        <div>
          <CheckoutPayment />
        </div>
      </div>
    </BuyerDetailsProvider>
  );
}


        {/* 
  <div className="w-full lg:col-span-1 xl:w-auto">
    <BuyerDetails />
  </div> */}