import React, { memo, useMemo } from "react";

export const LinkMyTransfer: React.FC = memo(() => {
  // Memoizar icono de transferencia
  const transferIcon = useMemo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    </svg>
  ), []);

  return (
    <nav>
      <a 
        href="/transfers/my"
        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-gray-800"
        aria-label="Ver mis transferencias"
      >
        {transferIcon}
        <span>Mis Transferencias</span>
      </a>
    </nav>
  );
});

LinkMyTransfer.displayName = "LinkMyTransfer";
