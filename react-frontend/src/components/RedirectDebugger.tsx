import React, { useEffect, useState } from 'react';

interface RedirectDebuggerProps {
  children: React.ReactNode;
}

export const RedirectDebugger: React.FC<RedirectDebuggerProps> = ({ children }) => {
  const [redirectAttempts, setRedirectAttempts] = useState<string[]>([]);

  useEffect(() => {
    // Interceptar intentos de redirect
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      console.log('🔄 History.pushState called:', args);
      setRedirectAttempts(prev => [...prev, `pushState: ${args[2]}`]);
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function(...args) {
      console.log('🔄 History.replaceState called:', args);
      setRedirectAttempts(prev => [...prev, `replaceState: ${args[2]}`]);
      return originalReplaceState.apply(this, args);
    };

    // Interceptar cambios de location
    const originalAssign = window.location.assign;
    const originalReplace = window.location.replace;

    window.location.assign = function(url) {
      console.log('🔄 Location.assign called:', url);
      setRedirectAttempts(prev => [...prev, `assign: ${url}`]);
      return originalAssign.call(this, url);
    };

    window.location.replace = function(url) {
      console.log('🔄 Location.replace called:', url);
      setRedirectAttempts(prev => [...prev, `replace: ${url}`]);
      return originalReplace.call(this, url);
    };

    // Cleanup
    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.location.assign = originalAssign;
      window.location.replace = originalReplace;
    };
  }, []);

  return (
    <>
      {children}
      {redirectAttempts.length > 0 && (
        <div className="fixed top-4 left-4 bg-yellow-900 text-yellow-200 p-4 rounded-lg shadow-lg z-50 max-w-md">
          <h3 className="font-bold mb-2">🔄 Redirect Attempts Detected:</h3>
          {redirectAttempts.map((attempt, index) => (
            <div key={index} className="text-xs mb-1">{attempt}</div>
          ))}
          <button 
            onClick={() => setRedirectAttempts([])}
            className="mt-2 bg-yellow-600 text-white px-2 py-1 text-xs rounded"
          >
            Clear
          </button>
        </div>
      )}
    </>
  );
};
