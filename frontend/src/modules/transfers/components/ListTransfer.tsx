import React, { memo, useMemo } from "react";
import { LoadingComponent } from "@components/LoadingComponent";
import { QueryProvider } from "@providers/QueryProvider";
import { TransferDataClient } from "../services/transferDataClient";
import { CardTransfer } from "./CardTransfer";

export const ListTransfer: React.FC = memo(() => {
  return (
    <QueryProvider>
      <UseListTransfer />
    </QueryProvider>
  );
});

ListTransfer.displayName = "ListTransfer";

const UseListTransfer: React.FC = memo(() => {
  const { data, isLoading, error } = TransferDataClient.getTransfers();

  // Memoizar mensaje de error
  const errorMessage = useMemo(() => {
    if (!error) return null;
    return (
      <div 
        className="text-center text-red-400 bg-red-900 bg-opacity-20 p-4 rounded-lg border border-red-600"
        role="alert"
      >
        <h3 className="font-semibold mb-2">Error al cargar transferencias</h3>
        <p>{error.message}</p>
      </div>
    );
  }, [error]);

  // Memoizar icono de transferencia
  const transferIcon = useMemo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    </svg>
  ), []);

  // Memoizar botón de nueva transferencia
  const newTransferButton = useMemo(() => (
    <a
      href="/transfers/new"
      className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-teal-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 ease-in-out transform hover:scale-105"
      aria-label="Crear nueva transferencia"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      Nueva Transferencia
    </a>
  ), []);

  // Memoizar lista de transferencias
  const transfersList = useMemo(() => {
    if (!data?.results?.length) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            {transferIcon}
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No hay transferencias
          </h3>
          <p className="text-gray-400 mb-6">
            Aún no tienes ninguna transferencia registrada.
          </p>
          {newTransferButton}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.results.map((transfer) => (
          <CardTransfer key={transfer.transfer_id} transfer={transfer} />
        ))}
      </div>
    );
  }, [data?.results, transferIcon, newTransferButton]);

  if (isLoading) return <LoadingComponent />;
  if (error) return errorMessage;

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            {transferIcon}
            Mis Transferencias
          </h1>
          <p className="text-gray-400">
            Gestiona y revisa el historial de tus transferencias
          </p>
        </div>
        {newTransferButton}
      </header>

      <section>
        {transfersList}
      </section>
    </main>
  );
});

UseListTransfer.displayName = "UseListTransfer";
