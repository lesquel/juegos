import type { Account as AccountModel } from "@models/globalInfo";
import { useCallback, useState } from "react";

export const Account = ({ account }: { account: AccountModel }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error);
    }
  }, []);
  return (
    <div
      key={account.account_id}
      className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 space-y-4 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl"></div>
      
      <div className="relative">
        <div className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {account.account_name}
        </div>
        <div className="text-sm text-gray-300 space-y-2 mt-3">
          <div>
            <strong className="text-cyan-400">Número:</strong> {account.account_number}
          </div>
          <div>
            <strong className="text-cyan-400">Titular:</strong> {account.account_owner_name}
          </div>
          <div>
            <strong className="text-cyan-400">Tipo:</strong> {account.account_type}
          </div>
          {account.account_description && (
            <div>
              <strong className="text-cyan-400">Descripción:</strong> {account.account_description}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => copyToClipboard(account.account_number)}
            disabled={isCopied}
            className={`font-medium py-3 px-6 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] ${
              isCopied 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white focus:ring-green-400/50' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600 focus:ring-gray-400/50'
            }`}
          >
            {isCopied ? '¡Copiado!' : 'Copiar a portapapeles'}
          </button>
          
          {isCopied && (
            <div className="text-sm text-green-400 font-medium animate-pulse flex items-center gap-2">
              <span className="text-green-400">✓</span>{" "}
              Número de cuenta copiado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
