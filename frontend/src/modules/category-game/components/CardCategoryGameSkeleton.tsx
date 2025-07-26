export const CardCategoryGameSkeleton = () => {
  return (
    <div className="relative block rounded-2xl overflow-hidden animate-pulse bg-gray-800 shadow-lg h-96">
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      <div className="absolute inset-0 rounded-2xl border-2 border-transparent z-20"></div>

      <div className="w-full h-64 bg-gray-700"></div>

      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-black/70 to-transparent">
        <div className="h-6 bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-full mb-4"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="h-3 w-20 bg-gray-600 rounded mb-1"></div>
            <div className="h-5 w-16 bg-gray-500 rounded"></div>
          </div>
          <div className="h-10 w-28 rounded-lg bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
};
