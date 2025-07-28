import { memo } from "react";

export const LoadingComponent = memo(() => {
  return (
    <div className="fixed top-0 left-0 right-0 inset-x-0 bottom-0  flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 opacity-65 pointer-events-none">
      <div className="relative flex h-24 w-24">
        <div className="absolute inline-flex h-full w-full animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <div className="absolute inline-flex h-full w-full animate-spin rounded-full border-4 border-solid border-blue-500 border-l-transparent align-[-0.125em] opacity-75 motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      </div>
    </div>
  );
});

LoadingComponent.displayName = "LoadingComponent";
