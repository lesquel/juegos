import { QueryProvider } from "@providers/QueryProvider";
import { UserClientData } from "../services/userClientData";

export const VirtualCurrency = () => {
  return (
    <QueryProvider>
      <UseVirtualCurrency />
    </QueryProvider>
  );
};

const UseVirtualCurrency = () => {
  const { data, isLoading, error } = UserClientData.getMyVirtualCurrency();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return <div>{data?.virtual_currency}</div>;
};
