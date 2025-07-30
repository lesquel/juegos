import React from "react";

const GamesHeader = () => (
  <div className="text-center mb-12 sm:mb-16 lg:mb-20 xl:mb-24 px-6 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 sm:mb-8 lg:mb-10 space-y-2 sm:space-y-3 lg:space-y-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 block">
          Explora Nuestros
        </span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 block">
          Juegos
        </span>
      </h1>
    </div>
    
    <p className="text-gray-300 text-base sm:text-lg lg:text-xl xl:text-2xl max-w-4xl mx-auto leading-relaxed px-6 sm:px-8 mb-6 sm:mb-8 lg:mb-10">
      Descubre una amplia selección de juegos emocionantes y divertidos para todos los gustos.
    </p>
    <div className="mb-8 sm:mb-10 lg:mb-12">
      <span className="text-cyan-400 font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl px-4 py-2 bg-cyan-500/10 rounded-2xl border border-cyan-400/30">
        🎮 ¡Cada partida ayuda a una causa benéfica! 💜
      </span>
    </div>
    
    {/* Decorative elements */}
    <div className="flex justify-center items-center gap-6 sm:gap-8 lg:gap-10">
      <div className="w-20 h-1.5 sm:w-24 sm:h-2 lg:w-28 lg:h-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
      <div className="w-20 h-1.5 sm:w-24 sm:h-2 lg:w-28 lg:h-2.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
    </div>
  </div>
);

export default GamesHeader;
