import React, { memo } from "react";

const WelcomeSection: React.FC = memo(() => {
  return (
    <section
      className="relative text-center mx-auto max-w-6xl px-4 sm:px-6"
      aria-labelledby="welcome-heading"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl"></div>

      <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl">
        <h2
          id="welcome-heading"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 leading-tight"
        >
          <span className="text-white block mb-1 sm:mb-2">Bienvenido a la</span>
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
            Plataforma de Juegos
          </span>
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            con Propósito
          </span>
        </h2>

        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
            Este proyecto, creado por estudiantes de{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              la ULEAM
            </span>{" "}
            , tiene como fin promober la eduación y conocimiento de desarrollo
            de juegos y software.
          </p>
        </div>

        <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-4 sm:p-6">
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent font-bold block">
            🎮 ¡Tu juego ayuda! 💜
          </span>
        </div>
      </div>
    </section>
  );
});

WelcomeSection.displayName = "WelcomeSection";

export default WelcomeSection;
