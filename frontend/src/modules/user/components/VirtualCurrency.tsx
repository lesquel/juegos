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

  if (isLoading) {
    return <div className="text-gray-400">Cargando moneda virtual...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Ocurrió un error al obtener tu saldo.
      </div>
    );
  }

  return (
    <span className="text-green-500 font-bold">
      $: {data?.virtual_currency ?? 0}
    </span>
  );
};
