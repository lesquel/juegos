import { LoadingComponent } from "@components/LoadingComponent";
import { QueryProvider } from "@providers/QueryProvider";
import { TransferDataClient } from "../services/transferDataClient";

export const SingleTransfer = ({ id }: { id: string }) => {
  return (
    <QueryProvider>
      <UseSingleTransfer id={id} />
    </QueryProvider>
  );
};

const UseSingleTransfer = ({ id }: { id: string }) => {
  const { data, isLoading, error } = TransferDataClient.getTransferDetail(id);

  if (isLoading) return <LoadingComponent />;
  if (error)
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );
  return (
    <div>
      <h1>{data?.transfer_id}</h1>
      <h1>{data?.user_id}</h1>
      <img src={data?.transfer_img} alt="transfer_img" />
      <h1>{data?.transfer_amount}</h1>
      <h1>{data?.transfer_state}</h1>
      <h1>{data?.transfer_description}</h1>
      <h1>{data?.created_at}</h1>
      <h1>{data?.updated_at}</h1>
    </div>
  );
};
