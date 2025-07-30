import { Smile } from "lucide-react";
import React, { memo, useMemo } from "react";

const Header: React.FC = memo(() => {
  // Memoizar el icono
  const smileyIcon = useMemo(() => (
    <Smile className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
  ), []);

  return (
    <header className="flex items-center gap-3 sm:gap-4 text-white">
      {/* Logo icon */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
        {smileyIcon}
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-300">
            GameForGood
          </span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-400">Plataforma de minijuegos benéfica</p>
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
