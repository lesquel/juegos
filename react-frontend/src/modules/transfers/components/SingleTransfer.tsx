import React, { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { LoadingComponent } from "@components/LoadingComponent";
import { useTransferDetail } from "../services/transferDataClient";
import { ArrowRight, Clock, Image, Info, Landmark } from "lucide-react";

interface SingleTransferProps {
  id: string;
}

export const SingleTransfer: React.FC<SingleTransferProps> = memo(({ id }) => {
  return <UseSingleTransfer id={id} />;
});

SingleTransfer.displayName = "SingleTransfer";

const UseSingleTransfer: React.FC<{ id: string }> = memo(({ id }) => {
  const { data, isLoading, error } = useTransferDetail(id);

  // Memoizar mensaje de error
  const errorMessage = useMemo(() => {
    if (!error) return null;
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center bg-red-500/10 backdrop-blur-md border border-red-400/30 p-8 rounded-2xl max-w-md shadow-2xl">
          <h2 className="text-xl font-bold text-red-400 mb-4">
            Error al cargar transferencia
          </h2>
          <p className="text-red-300 mb-6">{error.message}</p>
          <Link
            to="/user/me"
            className="inline-block bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Volver a transferencias
          </Link>
        </div>
      </div>
    );
  }, [error]);

  // Memoizar estado de transferencia con estilo
  const statusBadge = useMemo(() => {
    if (!data) return null;

    const statusClasses = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
      completed: "bg-green-500/20 text-green-400 border-green-400/30",
      rejected: "bg-red-500/20 text-red-400 border-red-400/30",
    };

    const defaultClass = "bg-gray-500/20 text-gray-400 border-gray-400/30";
    const className =
      statusClasses[data.transfer_state as keyof typeof statusClasses] ||
      defaultClass;

    return (
      <span
        className={`px-6 py-3 rounded-xl text-sm font-bold border backdrop-blur-sm ${className}`}
      >
        {data.transfer_state.toUpperCase()}
      </span>
    );
  }, [data?.transfer_state]);

  // Memoizar fechas formateadas
  const formattedDates = useMemo(() => {
    if (!data) return null;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return {
      created: formatDate(data.created_at),
      updated: formatDate(data.updated_at),
    };
  }, [data?.created_at, data?.updated_at]);

  // Memoizar icono de transferencia
  const transferIcon = useMemo(
    () => <Landmark className="h-8 w-8 text-cyan-400" />,
    []
  );

  if (isLoading) return <LoadingComponent />;
  if (error) return errorMessage;
  if (!data) return null;

  return (
    <main className="relative">
      <div className="px-4 py-12 max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <nav className="mb-6">
            <Link
              to="/user/me"
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-3 transition-all duration-200"
            >
              <ArrowRight className="h-5 w-5" />
              Volver a transferencias
            </Link>
          </nav>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                {transferIcon}
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Transferencia #{data.transfer_id}
                </h1>
                <p className="text-gray-300 text-lg">Detalles de la transferencia</p>
              </div>
            </div>
            {statusBadge}
          </div>
        </header>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información Principal */}
          <section className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
            
            <div className="relative">
              <h2 className="text-xl font-bold text-gray-300 mb-8 flex items-center gap-3">
                <Info className="h-6 w-6 text-cyan-400" />
                Información de la Transferencia
              </h2>

              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <span className="text-gray-400 font-medium">ID de Usuario:</span>
                  <span className="text-white font-bold">{data.user_id}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <span className="text-gray-400 font-medium">Monto:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    ${data.transfer_amount}
                  </span>
                </div>

                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <h3 className="text-gray-400 font-medium mb-3">Descripción:</h3>
                  <p className="text-gray-200 leading-relaxed">
                    {data.transfer_description || "Sin descripción"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Comprobante */}
          <section className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-cyan-500/5 rounded-3xl"></div>
            
            <div className="relative">
              <h2 className="text-xl font-bold text-gray-300 mb-8 flex items-center gap-3">
                <Image className="h-6 w-6 text-cyan-400" />
                Comprobante
              </h2>

              {data.transfer_img ? (
                <div className="space-y-6">
                  <img
                    src={data.transfer_img}
                    alt={`Comprobante de transferencia ${data.transfer_id}`}
                    className="w-full rounded-2xl shadow-lg border border-white/20"
                    loading="lazy"
                  />
                  <Link
                    to={data.transfer_img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-all duration-200 font-medium"
                  >
                    <Image className="h-5 w-5" />
                    Ver imagen completa
                  </Link>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Image className="h-16 w-16 mx-auto mb-6 opacity-50" />
                  <p className="text-lg">No hay comprobante disponible</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Información de Fechas */}
        <section className="relative mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-cyan-500/5 to-purple-500/5 rounded-3xl"></div>
          
          <div className="relative">
            <h2 className="text-xl font-bold text-gray-300 mb-8 flex items-center gap-3">
              <Clock className="h-6 w-6 text-cyan-400" />
              Historial
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <h3 className="text-gray-400 font-medium text-sm mb-3">Fecha de Creación</h3>
                <time
                  className="text-white font-bold text-lg"
                  dateTime={data.created_at}
                >
                  {formattedDates?.created}
                </time>
              </div>

              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <h3 className="text-gray-400 font-medium text-sm mb-3">
                  Última Actualización
                </h3>
                <time
                  className="text-white font-bold text-lg"
                  dateTime={data.updated_at}
                >
                  {formattedDates?.updated}
                </time>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
});

UseSingleTransfer.displayName = "UseSingleTransfer";
