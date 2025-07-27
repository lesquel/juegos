import { QueryProvider } from "@providers/QueryProvider";
import { UserClientData } from "../services/userClientData";
import { LoadingComponent } from "@components/LoadingComponent";
import { memo, useEffect, useMemo } from "react";
import { MiddlewareAstroProtectUser } from "@modules/auth/middleware/middlewareAstroProtectUser";

export const MeComponent = memo(() => {
  useEffect(() => {
    // Solo ejecutar en el cliente después del montaje
    MiddlewareAstroProtectUser.isLogged();
  }, []);
  return (
    <QueryProvider>
      <UseMeComponent />
    </QueryProvider>
  );
});

MeComponent.displayName = "MeComponent";

const UseMeComponent = memo(() => {
  const { data, isLoading, error } = UserClientData.getmMe();

  // Memoizar contenido del usuario
  const userContent = useMemo(() => {
    if (!data) return null;

    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="text-sm text-gray-400">
                Email:
              </label>
              <p className="text-white font-semibold">{data.email}</p>
            </div>
            <div>
              <label
                htmlFor="VirtualCurrency"
                className="text-sm text-gray-400"
              >
                Moneda Virtual:
              </label>
              <p className="text-teal-400 font-bold">{data.virtual_currency}</p>
            </div>
            <div>
              <label htmlFor="created_at" className="text-sm text-gray-400">
                Fecha de registro:
              </label>
              <p className="text-white">
                {new Date(data.created_at).toLocaleDateString()}
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
      <div className="text-center text-red-400 p-8">
        Error al cargar los datos del usuario
      </div>
    );

  return <div className="container mx-auto px-4 py-8">{userContent}</div>;
});

UseMeComponent.displayName = "UseMeComponent";
