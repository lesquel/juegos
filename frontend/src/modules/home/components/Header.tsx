// src/components/Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      {/* Placeholder para el SVG del dado (negro con dado blanco) */}
      <div className="bg-black text-white p-2 rounded-md text-3xl font-bold flex justify-center items-center">
        🎲
      </div>
      <div className="flex flex-col">
        <h1 className="text-3xl font-extrabold text-gray-900">MiniBet</h1>
        <p className="text-base text-gray-600">Plataforma de minijuegos</p>
      </div>
    </div>
  );
};

export default Header;