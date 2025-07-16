import { LoadingComponent } from "@components/LoadingComponent";
import { QueryProvider } from "@providers/QueryProvider";
import { TransferDataClient } from "../services/transferDataClient";
import { CardTransfer } from "./CardTransfer";

export const ListTransfer = () => {
  return (
    <QueryProvider>
      <UseListTransfer />
    </QueryProvider>
  );
};

const UseListTransfer = () => {
  const { data, isLoading, error } = TransferDataClient.getTransfers();

  if (isLoading) return <LoadingComponent />;
  if (error)
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );
  return (
    <div>
      <h1>Transfers</h1>
      <a href="/transfers/new">new transfer</a>
      {data?.results.map((transfer) => (
        <CardTransfer key={transfer.transfer_id} transfer={transfer} />
      ))}
    </div>
  );
};
