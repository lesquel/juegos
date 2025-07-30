import React, { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { LoadingComponent } from "@components/LoadingComponent";
import { useTransfers } from "../services/transferDataClient";
import { CardTransfer } from "./CardTransfer";
import { Landmark, Plus } from "lucide-react";

export const ListTransfer: React.FC = memo(() => {
  return (
      <UseListTransfer />
  );
});

ListTransfer.displayName = "ListTransfer";

const UseListTransfer: React.FC = memo(() => {
  const { data, isLoading, error } = useTransfers();

  // Memoizar mensaje de error
  const errorMessage = useMemo(() => {
    if (!error) return null;
    return (
      <div
        className="text-center text-red-400 bg-red-500/10 backdrop-blur-md border border-red-400/30 p-6 rounded-2xl max-w-md mx-auto"
        role="alert"
      >
        <h3 className="font-bold mb-3">Error al cargar transferencias</h3>
        <p>{error.message}</p>
      </div>
    );
  }, [error]);

  // Memoizar icono de transferencia
  const transferIcon = useMemo(
    () => <Landmark className="h-7 w-7 text-cyan-400" />,
    []
  );

  // Memoizar botón de nueva transferencia
  const newTransferButton = useMemo(
    () => (
      <Link
        to="/transfers/new"
        className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 transform hover:scale-[1.02]"
        aria-label="Crear nueva transferencia"
      >
        <Plus className="h-5 w-5" />
        Nueva Transferencia
      </Link>
    ),
    []
  );

  // Memoizar lista de transferencias
  const transfersList = useMemo(() => {
    if (!data?.results?.length) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            {transferIcon}
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            No hay transferencias
          </h3>
          <p className="text-gray-300 mb-8 text-lg">
            Aún no tienes ninguna transferencia registrada.
          </p>
          {newTransferButton}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {data.results.map((transfer) => (
          <CardTransfer key={transfer.transfer_id} transfer={transfer} />
        ))}
      </div>
    );
  }, [data?.results, transferIcon, newTransferButton]);

  if (isLoading) return <LoadingComponent />;
  if (error) return errorMessage;

  return (
    <section className="relative w-full">
      <div className="w-full">
        <header className="flex flex-col items-center justify-center md:flex-row md:justify-between md:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                {transferIcon}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Mis Transferencias
              </h1>
            </div>
            <p className="text-gray-300 text-center md:text-left text-base sm:text-lg">
              Gestiona y revisa el historial de tus transferencias
            </p>
          </div>
          {newTransferButton}
        </header>

        <div>{transfersList}</div>
      </div>
    </section>
  );
});

UseListTransfer.displayName = "UseListTransfer";
