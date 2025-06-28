import { QueryProvider } from "@providers/QueryProvider";
import { TransferPaymentDataClient } from "../services/transferPaymentDataClient";
import { LoadingComponent } from "@components/LoadingComponent";
import { MyCardTransferPaymentComponent } from "./MyCardTransferPaymentComponent";

export const MyTransferPaymentComponent = () => {
  return (
    <QueryProvider>
      <UseMyTransferPaymentComponent />
    </QueryProvider>
  );
};

const UseMyTransferPaymentComponent = () => {
  const { data, isLoading, error } =
    TransferPaymentDataClient.getMyTransferPayments();
  if (isLoading) return <LoadingComponent />;
  if (error) return <div>Error</div>;
  return (
    <div>
      <h1>My Transfer Payments</h1>
      {data?.results.map((transferPayment) => (
        <MyCardTransferPaymentComponent transferPayment={transferPayment} />
      ))}
    </div>
  );
};
