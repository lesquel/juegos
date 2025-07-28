import React from 'react';
import { useAuthStore } from '../store/auth.store';
import { CookiesSection } from '../utils/cookiesSection';

export const AuthDebugger: React.FC = () => {
  const { user, isLogged, syncWithCookies } = useAuthStore();
  const cookieUser = CookiesSection.get();

  const handleSync = () => {
    syncWithCookies();
  };

  const handleClearAll = () => {
    useAuthStore.getState().clearUser();
    localStorage.clear();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Store User:</strong> {user ? '✅ Logged' : '❌ Not logged'}
        </div>
        
        <div>
          <strong>Store isLogged():</strong> {isLogged() ? '✅ True' : '❌ False'}
        </div>
        
        <div>
          <strong>Cookie User:</strong> {cookieUser ? '✅ Exists' : '❌ None'}
        </div>
        
        <div>
          <strong>LocalStorage:</strong>
          <pre className="text-xs bg-gray-700 p-1 mt-1 rounded">
            {localStorage.getItem('auth-storage') || 'None'}
          </pre>
        </div>
        
        <div className="space-x-2 pt-2">
          <button 
            onClick={handleSync}
            className="bg-blue-500 px-2 py-1 text-xs rounded"
          >
            Sync
          </button>
          <button 
            onClick={handleClearAll}
            className="bg-red-500 px-2 py-1 text-xs rounded"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};
