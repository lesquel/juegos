import React from "react";

const GamesHeader = () => (
  <div className="text-center mb-12">
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <h1 className="relative text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
          Explora Nuestros
        </span>
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          Juegos
        </span>
      </h1>
    </div>
    
    <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
      Descubre una amplia selección de juegos emocionantes y divertidos para todos los gustos.
    </p>
    <div className="mt-4">
      <span className="text-cyan-400 font-semibold text-lg">
        🎮 ¡Cada partida ayuda a una causa benéfica! 💜
      </span>
    </div>
    
    {/* Decorative elements */}
    <div className="flex justify-center items-center gap-4 mt-8">
      <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
      <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
    </div>
  </div>
);

export default GamesHeader;
