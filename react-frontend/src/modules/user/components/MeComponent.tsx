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
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 sm:p-16 lg:p-20 xl:p-24 shadow-2xl w-full max-w-6xl mx-auto">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>
        
        <div className="relative space-y-12 sm:space-y-16 lg:space-y-20 xl:space-y-24">
          <div className="text-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 sm:mb-10 lg:mb-12 xl:mb-14 p-2">
              <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
                  {data.email.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mi Perfil
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 sm:p-10 lg:p-12 xl:p-14">
              <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-cyan-400 rounded-full"></div>
                <label className="text-base sm:text-lg lg:text-xl xl:text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                  Email:
                </label>
              </div>
              <p className="text-white font-semibold text-lg sm:text-xl lg:text-2xl xl:text-3xl break-all leading-relaxed">{data.email}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-400/30 rounded-2xl p-8 sm:p-10 lg:p-12 xl:p-14">
              <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-400 rounded-full"></div>
                <label className="text-base sm:text-lg lg:text-xl xl:text-2xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-semibold">
                  Moneda Virtual:
                </label>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                ${data.virtual_currency}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 sm:p-10 lg:p-12 xl:p-14 lg:col-span-1">
              <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-purple-400 rounded-full"></div>
                <label className="text-base sm:text-lg lg:text-xl xl:text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                  Fecha de registro:
                </label>
              </div>
              <p className="text-white font-semibold text-lg sm:text-xl lg:text-2xl xl:text-3xl leading-relaxed">
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
      <div className="flex items-center justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-24 sm:py-28 lg:py-32 xl:py-40">
        <div className="text-center bg-red-500/10 backdrop-blur-sm border border-red-500/30 p-16 sm:p-20 lg:p-24 xl:p-28 rounded-3xl max-w-2xl shadow-2xl">
          <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 xl:w-48 xl:h-48 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-10 sm:mb-12 lg:mb-14 xl:mb-16">
            <svg className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-8 sm:mb-10 lg:mb-12 xl:mb-14">
            Error al cargar datos
          </h2>
          <p className="text-red-300 text-lg sm:text-xl lg:text-2xl xl:text-3xl leading-relaxed">Error al cargar los datos del usuario</p>
        </div>
      </div>
    );

  return (
    <div className="w-full flex justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-12 sm:py-16 lg:py-20 xl:py-28">
      <div className="w-full">
        {userContent}
      </div>
    </div>
  );
});

UseMeComponent.displayName = "UseMeComponent";
