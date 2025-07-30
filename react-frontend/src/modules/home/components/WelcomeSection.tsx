import React, { memo } from "react";

const WelcomeSection: React.FC = memo(() => {
  return (
    <section
      className="relative text-center mx-auto max-w-7xl px-8 sm:px-12 lg:px-16 xl:px-20 py-8 sm:py-12 lg:py-16"
      aria-labelledby="welcome-heading"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl"></div>

      <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-10 sm:p-14 md:p-16 lg:p-20 xl:p-24 shadow-2xl space-y-12 sm:space-y-16 lg:space-y-20">
        <h2
          id="welcome-heading"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight space-y-3 sm:space-y-4 lg:space-y-6"
        >
          <span className="text-white block mb-3 sm:mb-4 lg:mb-6">Bienvenido a la</span>
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block mb-2 sm:mb-3 lg:mb-4">
            Plataforma de Juegos
          </span>
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent block">
            con Propósito
          </span>
        </h2>

        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 sm:p-10 md:p-12 lg:p-16 xl:p-20 shadow-lg">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-200 leading-relaxed max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2 sm:space-y-3">
            Este proyecto, creado por estudiantes de{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              la ULEAM
            </span>{" "}
            , tiene como fin promober la eduación y conocimiento de desarrollo
            de juegos y software.
          </p>
        </div>

        <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8 sm:p-10 lg:p-12 xl:p-16 shadow-lg">
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent font-bold block px-4 sm:px-6 py-2 sm:py-3">
            🎮 ¡Tu juego ayuda! 💜
          </span>
        </div>
      </div>
    </section>
  );
});

WelcomeSection.displayName = "WelcomeSection";

export default WelcomeSection;
