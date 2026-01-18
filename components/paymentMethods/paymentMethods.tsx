import CreditCards from "./creditCards";
import CheckoutPayment from "./checkoutPayment";

export default function PaymentMethods() {
  return (
    <div className="flex flex-col mx-4 justify-center items-center md:items-start md:flex-row sm:justify-around gap-2">
      <div className="md:w-full lg:w-auto ">
        <CreditCards />
      </div>

      <div className="w-full lg:w-auto flex justify-center">      
        <CheckoutPayment />      
      </div>
    </div>
  );
}


