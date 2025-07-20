import React from "react";

const WelcomeSection: React.FC = () => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Bienvenido a la Plataforma de Juegos con Propósito
      </h2>
      <p className="text-gray-300 md:text-lg">
        Este proyecto, creado por estudiantes de 4º nivel de Ingeniería de Software de la ULEAM, tiene como fin donar todas las ganancias a fundaciones que luchan contra el cáncer infantil. ¡Tu juego ayuda!
      </p>
    </div>
  );
};

export default WelcomeSection;
