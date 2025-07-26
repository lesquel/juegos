import React, { memo } from "react";

const WelcomeSection: React.FC = memo(() => {
  return (
    <section
      className="text-center max-w-3xl mx-auto"
      aria-labelledby="welcome-heading"
    >
      <h2
        id="welcome-heading"
        className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
      >
        Bienvenido a la Plataforma de Juegos con Propósito
      </h2>
      <p className="text-gray-300 md:text-lg leading-relaxed">
        Este proyecto, creado por estudiantes de 4º nivel de Ingeniería de
        Software de la ULEAM, tiene como fin donar todas las ganancias a
        fundaciones que luchan contra el cáncer infantil.
        <span className="text-teal-400 font-semibold"> ¡Tu juego ayuda!</span>
      </p>
    </section>
  );
});

WelcomeSection.displayName = "WelcomeSection";

export default WelcomeSection;
