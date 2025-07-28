import { Landmark } from "lucide-react";
import React, { memo, useMemo } from "react";

export const LinkMyTransfer: React.FC = memo(() => {
  // Memoizar icono de transferencia
  const transferIcon = useMemo(
    () => <Landmark className="h-5 w-5 text-teal-400" />,
    []
  );

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
