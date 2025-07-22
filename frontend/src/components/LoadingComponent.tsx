export const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center bg-gray-200 bg-opacity-75 h-screen">
      <div className="relative flex h-24 w-24">
        <div className="absolute inline-flex h-full w-full animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <div className="absolute inline-flex h-full w-full animate-spin rounded-full border-4 border-solid border-blue-500 border-l-transparent align-[-0.125em] opacity-75 motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      </div>
    </div>
  );
};
