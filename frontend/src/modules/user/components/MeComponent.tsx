import { QueryProvider } from "@providers/QueryProvider";
import { UserClientData } from "../services/userClientData";
import { LoadingComponent } from "@components/LoadingComponent";

export const MeComponent = () => {
  return (
    <QueryProvider>
      <UseMeComponent />
    </QueryProvider>
  );
};

const UseMeComponent = () => {
  const { data, isLoading, error } = UserClientData.getmMe();
  if (isLoading) return <LoadingComponent />;
  if (error) return <div>Error</div>;
  return (
    <div>
      <h1>Me</h1>
      <p>{data?.email}</p>
      <p>{data?.virtual_currency}</p>
      <p>{data?.created_at}</p>
    </div>
  );
};
