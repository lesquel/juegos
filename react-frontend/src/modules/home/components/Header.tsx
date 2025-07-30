import { Smile } from "lucide-react";
import React, { memo, useMemo } from "react";

const Header: React.FC = memo(() => {
  // Memoizar el icono
  const smileyIcon = useMemo(() => (
    <Smile className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 text-white" />
  ), []);

  return (
    <header className="flex items-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16 text-white px-6 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10">
      {/* Logo icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-300 flex-shrink-0">
        {smileyIcon}
      </div>
      <div className="space-y-2 sm:space-y-3 lg:space-y-4 text-left flex-grow">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-300 block">
            GameForGood
          </span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 leading-relaxed font-medium tracking-wide">
          Plataforma de minijuegos
        </p>
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
