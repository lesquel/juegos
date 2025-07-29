
export const CardGameSkeleton = () => {
  return (
    <div className="relative block rounded-2xl overflow-hidden bg-gray-800 shadow-lg h-96">
      {/* Imagen placeholder */}
      <div className="w-full h-64 bg-gray-700"></div>

      {/* Contenido del card */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 bg-gradient-to-t from-gray-800/95 via-gray-800/60 to-transparent">
        {/* Título del juego */}
        <div className="h-6 bg-gray-600 rounded w-3/4 mb-2"></div>
        {/* Descripción */}
        <div className="h-4 bg-gray-600 rounded w-full mb-4"></div>

        {/* Footer con capacidad y botón */}
        <div className="flex items-center justify-between">
          <div>
            {/* Label capacidad */}
            <div className="h-3 w-20 bg-gray-600 rounded mb-1"></div>
            {/* Valor capacidad */}
            <div className="h-5 w-16 bg-gray-500 rounded"></div>
          </div>
          {/* Botón */}
          <div className="h-10 w-28 rounded-lg bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
};
