export const CardMatchSkeleton = () => {
  return (
    <article className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg overflow-hidden animate-pulse h-full flex flex-col backdrop-blur-lg">
      {/* Header */}
      <header className="p-6 md:p-8 flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div className="px-4 py-2 text-sm font-bold rounded-full inline-flex items-center gap-2 bg-gray-600 text-gray-300">
            <div className="h-4 w-4 bg-gray-500 rounded-full" />
            <div className="h-4 w-24 bg-gray-500 rounded" />
          </div>
          <div className="text-right">
            <div className="h-4 w-20 bg-gray-600 mb-2 rounded" />
            <div className="h-8 w-24 bg-purple-500 rounded" />
          </div>
        </div>

        {/* Jugadores */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-6 bg-teal-500 rounded-full" />
            <div className="h-5 w-40 bg-gray-600 rounded" />
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-24 bg-gray-700 rounded-full" />
            ))}
          </div>
        </section>

        {/* Ganador */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-6 bg-yellow-500 rounded-full" />
            <div className="h-5 w-28 bg-gray-600 rounded" />
          </div>
          <div className="h-10 w-32 bg-gray-700 rounded-full" />
        </div>
      </header>

      {/* Join Section */}
      <div className="border-t border-gray-700 p-6 bg-gray-900 bg-opacity-50">
        <div className="h-10 w-full bg-gray-700 rounded-lg" />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 px-6 py-3 text-xs text-gray-500 border-t border-gray-800">
        <div className="flex flex-wrap items-center gap-4">
          <div className="h-3 w-24 bg-gray-700 rounded" />
          <div className="h-3 w-32 bg-gray-700 rounded" />
        </div>
      </footer>
    </article>
  );
};
