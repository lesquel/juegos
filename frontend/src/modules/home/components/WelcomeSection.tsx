// src/components/WelcomeSection.tsx
import React from "react";

const WelcomeSection: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Bienvenido/a a MiniBet
      </h2>
      <p className="text-base text-gray-600">
        Proyecto generado por los estudiantes de Software de 4to nivel de la ULEAM, con el proposito benefico de todo lo generado con la aplicacion, sera donado a fundaciones en contra del cancer infantil.
      </p>
    </div>
  );
};

export default WelcomeSection;