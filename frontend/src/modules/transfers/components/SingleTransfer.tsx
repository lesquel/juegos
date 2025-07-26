import React, { memo, useMemo } from "react";
import { LoadingComponent } from "@components/LoadingComponent";
import { QueryProvider } from "@providers/QueryProvider";
import { TransferDataClient } from "../services/transferDataClient";

interface SingleTransferProps {
  id: string;
}

export const SingleTransfer: React.FC<SingleTransferProps> = memo(({ id }) => {
  return (
    <QueryProvider>
      <UseSingleTransfer id={id} />
    </QueryProvider>
  );
});

SingleTransfer.displayName = "SingleTransfer";

const UseSingleTransfer: React.FC<{ id: string }> = memo(({ id }) => {
  const { data, isLoading, error } = TransferDataClient.getTransferDetail(id);

  // Memoizar mensaje de error
  const errorMessage = useMemo(() => {
    if (!error) return null;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center bg-red-900 bg-opacity-50 p-6 rounded-lg border border-red-600 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error al cargar transferencia</h2>
          <p className="text-red-300">{error.message}</p>
          <a 
            href="/transfers" 
            className="mt-4 inline-block bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold py-2 px-4 rounded-lg hover:from-teal-600 hover:to-cyan-500 transition duration-300"
          >
            Volver a transferencias
          </a>
        </div>
      </div>
    );
  }, [error]);

  // Memoizar estado de transferencia con estilo
  const statusBadge = useMemo(() => {
    if (!data) return null;
    
    const statusClasses = {
      pending: "bg-yellow-500 text-yellow-900",
      completed: "bg-green-500 text-green-900", 
      rejected: "bg-red-500 text-red-900",
    };
    
    const defaultClass = "bg-gray-500 text-gray-900";
    const className = statusClasses[data.transfer_state as keyof typeof statusClasses] || defaultClass;
    
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${className}`}>
        {data.transfer_state.toUpperCase()}
      </span>
    );
  }, [data?.transfer_state]);

  // Memoizar fechas formateadas
  const formattedDates = useMemo(() => {
    if (!data) return null;
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return {
      created: formatDate(data.created_at),
      updated: formatDate(data.updated_at),
    };
  }, [data?.created_at, data?.updated_at]);

  // Memoizar icono de transferencia
  const transferIcon = useMemo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-teal-400"
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

  if (isLoading) return <LoadingComponent />;
  if (error) return errorMessage;
  if (!data) return null;

  return (
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <nav className="mb-4">
            <a 
              href="/transfers" 
              className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a transferencias
            </a>
          </nav>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {transferIcon}
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Transferencia #{data.transfer_id}
                </h1>
                <p className="text-gray-400">
                  Detalles de la transferencia
                </p>
              </div>
            </div>
            {statusBadge}
          </div>
        </header>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información Principal */}
          <section className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 border border-gray-700 backdrop-blur-lg">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Información de la Transferencia
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-900 bg-opacity-50 rounded-lg">
                <span className="text-gray-400">ID de Usuario:</span>
                <span className="text-white font-semibold">{data.user_id}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-900 bg-opacity-50 rounded-lg">
                <span className="text-gray-400">Monto:</span>
                <span className="text-2xl font-bold text-green-400">
                  ${data.transfer_amount}
                </span>
              </div>
              
              <div className="p-3 bg-gray-900 bg-opacity-50 rounded-lg">
                <h3 className="text-gray-400 mb-2">Descripción:</h3>
                <p className="text-white leading-relaxed">
                  {data.transfer_description || "Sin descripción"}
                </p>
              </div>
            </div>
          </section>

          {/* Comprobante */}
          <section className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 border border-gray-700 backdrop-blur-lg">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Comprobante
            </h2>
            
            {data.transfer_img ? (
              <div className="space-y-4">
                <img 
                  src={data.transfer_img} 
                  alt={`Comprobante de transferencia ${data.transfer_id}`}
                  className="w-full rounded-lg shadow-lg"
                  loading="lazy"
                />
                <a
                  href={data.transfer_img}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver imagen completa
                </a>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No hay comprobante disponible</p>
              </div>
            )}
          </section>
        </div>

        {/* Información de Fechas */}
        <section className="mt-8 bg-gray-800 bg-opacity-50 rounded-2xl p-6 border border-gray-700 backdrop-blur-lg">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Historial
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-900 bg-opacity-50 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-1">Fecha de Creación</h3>
              <time className="text-white font-semibold" dateTime={data.created_at}>
                {formattedDates?.created}
              </time>
            </div>
            
            <div className="p-4 bg-gray-900 bg-opacity-50 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-1">Última Actualización</h3>
              <time className="text-white font-semibold" dateTime={data.updated_at}>
                {formattedDates?.updated}
              </time>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
});

UseSingleTransfer.displayName = "UseSingleTransfer";
