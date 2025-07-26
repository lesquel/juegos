import { QueryProvider } from "@providers/QueryProvider";
import { UserClientData } from "../services/userClientData";
import { useAuthStore } from "@modules/auth/store/auth.store";

export const VirtualCurrency = () => {
  const userStore = useAuthStore();
  const { user } = userStore;
  if (!user) {
    return null;
  }
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
      <div className="text-red-500">Ocurrió un error al obtener tu saldo.</div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <p className="text-gray-300 font-bold">Saldo:</p>
      <span className="text-green-500 font-bold">
        $: {data?.virtual_currency ?? 0}
      </span>
    </div>
  );
};
