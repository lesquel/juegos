import { Smile } from "lucide-react";
import React, { memo, useMemo } from "react";

const Header: React.FC = memo(() => {
  // Memoizar el icono
  const smileyIcon = useMemo(() => (
    <Smile className="h-8 w-8 text-white" />
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
