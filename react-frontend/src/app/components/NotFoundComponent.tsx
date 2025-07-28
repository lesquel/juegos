import { memo } from "react";

export const NotFoundComponent = memo(() => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-gradient bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-3xl font-bold">Página no encontrada</h2>
        <p className="text-gray-400 max-w-md">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </p>
        <a
          href="/"
          className="inline-block bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform duration-300"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
});

NotFoundComponent.displayName = "NotFoundComponent";
