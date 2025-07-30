import React, { memo } from "react";

const WelcomeSection: React.FC = memo(() => {
  return (
    <section
      className="text-center mx-auto max-w-4xl"
      aria-labelledby="welcome-heading"
    >
      <h2
        id="welcome-heading"
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
      >
        Bienvenido a la Plataforma de{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
          Juegos con Propósito
        </span>
      </h2>
      <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Este proyecto, creado por estudiantes de 4º nivel de Ingeniería de
        Software de la ULEAM, tiene como fin donar todas las ganancias a
        fundaciones que luchan contra el cáncer infantil.{" "}
        <span className="text-cyan-400 font-semibold block mt-2 text-xl">
          🎮 ¡Tu juego ayuda! 💜
        </span>
      </p>
    </section>
  );
});

WelcomeSection.displayName = "WelcomeSection";

export default WelcomeSection;
