import React, { memo, useMemo } from "react";

const Header: React.FC = memo(() => {
  // Memoizar el icono SVG
  const smileyIcon = useMemo(() => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-8 w-8 text-white" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  ), []);

  return (
    <header className="flex items-center gap-4 text-white">
      {/* Logo icon */}
      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
        {smileyIcon}
      </div>
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-300">
            GameForGood
          </span>
        </h1>
        <p className="text-gray-400 text-lg">Plataforma de minijuegos benéfica</p>
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
