import { QueryProvider } from "@providers/QueryProvider";
import { UserClientData } from "../services/userClientData";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { memo, useMemo } from "react";

export const VirtualCurrency = memo(() => {
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
});

VirtualCurrency.displayName = "VirtualCurrency";

const UseVirtualCurrency = memo(() => {
  const { data, isLoading, error } = UserClientData.getMyVirtualCurrency();

  // Memoizar el contenido del saldo
  const currencyContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <div className="animate-pulse flex items-center gap-2">
            <div className="h-4 w-12 bg-gray-600 rounded"></div>
            <div className="h-4 w-8 bg-gray-600 rounded"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 text-sm">
          Error al cargar saldo
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <p className="text-gray-300 font-bold">Saldo:</p>
        <span className="text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded text-sm">
          $: {data?.virtual_currency ?? 0}
        </span>
      </div>
    );
  }, [data?.virtual_currency, isLoading, error]);

  return currencyContent;
});

UseVirtualCurrency.displayName = "UseVirtualCurrency";
