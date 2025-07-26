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
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2"
    >
      <div className="font-semibold text-gray-800">{account.account_name}</div>
      <div className="text-sm text-gray-600">
        <div>
          <strong>Número:</strong> {account.account_number}
        </div>
        <div>
          <strong>Titular:</strong> {account.account_owner_name}
        </div>
        <div>
          <strong>Tipo:</strong> {account.account_type}
        </div>
        {account.account_description && (
          <div>
            <strong>Descripción:</strong> {account.account_description}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => copyToClipboard(account.account_number)}
          disabled={isCopied}
          className={`font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isCopied 
              ? 'bg-green-600 text-white focus:ring-green-500' 
              : 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500'
          }`}
        >
          {isCopied ? '¡Copiado!' : 'Copiar a portapapeles'}
        </button>
        
        {isCopied && (
          <div className="text-sm text-green-600 font-medium animate-pulse">
            ✓ Número de cuenta copiado
          </div>
        )}
      </div>
    </div>
  );
};
