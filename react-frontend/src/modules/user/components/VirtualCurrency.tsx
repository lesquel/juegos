import { useMyVirtualCurrency, UserClientData } from "../services/userClientData";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { memo, useMemo } from "react";

export const VirtualCurrency = memo(() => {
  const userStore = useAuthStore();
  const { user } = userStore;

  if (!user) {
    return null;
  }

  return <UseVirtualCurrency />;
});

VirtualCurrency.displayName = "VirtualCurrency";

const UseVirtualCurrency = memo(() => {
  const { data, isLoading, error } = useMyVirtualCurrency();

  // Memoizar el contenido del saldo
  const currencyContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2">
          <div className="animate-pulse flex items-center gap-3">
            <div className="h-4 w-16 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded shimmer"></div>
            <div className="h-4 w-12 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded shimmer"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl px-4 py-2">
          <div className="text-red-300 text-sm font-medium">Error al cargar saldo</div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 hover:bg-white/15 transition-colors duration-300">
        <p className="bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent font-semibold">
          Saldo:
        </p>
        <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold bg-green-500/10 border border-green-400/30 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
          $: {data?.virtual_currency ?? 0}
        </span>
      </div>
    );
  }, [data?.virtual_currency, isLoading, error]);

  return currencyContent;
});

UseVirtualCurrency.displayName = "UseVirtualCurrency";
