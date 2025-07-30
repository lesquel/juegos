import { useMe } from "../services/userClientData";
import { LoadingComponent } from "@components/LoadingComponent";
import { memo, useEffect, useMemo } from "react";
import { MiddlewareAstroProtectUser } from "@modules/auth/middleware/middlewareAstroProtectUser";

export const MeComponent = memo(() => {
  useEffect(() => {
    // Solo ejecutar en el cliente después del montaje
    MiddlewareAstroProtectUser.isLogged();
  }, []);
  return <UseMeComponent />;
});

MeComponent.displayName = "MeComponent";

const UseMeComponent = memo(() => {
  const { data, isLoading, error } = useMe();

  // Memoizar contenido del usuario
  const userContent = useMemo(() => {
    if (!data) return null;

    return (
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>
        
        <div className="relative space-y-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 p-1">
              <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {data.email.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mi Perfil
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                <label className="text-sm bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                  Email:
                </label>
              </div>
              <p className="text-white font-semibold text-lg break-all">{data.email}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <label className="text-sm bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-semibold">
                  Moneda Virtual:
                </label>
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                ${data.virtual_currency}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <label className="text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                  Fecha de registro:
                </label>
              </div>
              <p className="text-white font-semibold">
                {new Date(data.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }, [data]);

  if (isLoading) return <LoadingComponent />;
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="text-center bg-red-500/10 backdrop-blur-sm border border-red-500/30 p-12 rounded-3xl max-w-md shadow-2xl">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Error al cargar datos
          </h2>
          <p className="text-red-300">Error al cargar los datos del usuario</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {userContent}
      </div>
    </div>
  );
});

UseMeComponent.displayName = "UseMeComponent";
