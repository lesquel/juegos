import React, { memo } from "react";

const WelcomeSection: React.FC = memo(() => {
  return (
    <section
      className="relative text-center mx-auto max-w-6xl"
      aria-labelledby="welcome-heading"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl"></div>
      
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-12 shadow-2xl">
        <h2
          id="welcome-heading"
          className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight"
        >
          <span className="text-white block mb-2">Bienvenido a la</span>
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
            Plataforma de Juegos
          </span>
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            con Propósito
          </span>
        </h2>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
            Este proyecto, creado por estudiantes de 4º nivel de{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              Ingeniería de Software de la ULEAM
            </span>{" "}
            , tiene como fin donar todas las ganancias a fundaciones que luchan contra el cáncer infantil.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-6">
          <span className="text-2xl md:text-3xl bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent font-bold block">
            🎮 ¡Tu juego ayuda! 💜
          </span>
        </div>
      </div>
    </section>
  );
});

WelcomeSection.displayName = "WelcomeSection";

export default WelcomeSection;
