import CreditCards from "./creditCards";
import CheckoutPayment from "./checkoutPayment";

export default function PaymentMethods() {
  return (
    <div className="flex flex-col mx-4 justify-center items-center md:items-start md:flex-row sm:justify-around gap-4">
      <div className="w-full md:w-auto md:min-w-0 lg:w-auto flex justify-center">
        <CreditCards />
      </div>

      <div className="w-full mt-4 md:mt-0 md:w-auto md:min-w-0 lg:w-auto flex justify-center">      
        <CheckoutPayment />      
      </div>
    </div>
  );
}


