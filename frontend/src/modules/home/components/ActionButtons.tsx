import React from "react";
import { homeRoutesConfig } from "../config/home.routes.config";

const ActionButtons: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full max-w-md">
      <a className="bg-gray-900 text-white py-4 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-3 min-w-44 w-[70%] hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        href={homeRoutesConfig.children.login.url}
      >
        {/* Placeholder para SVG de llave */}
        <span role="img" aria-label="llave" className="text-2xl">
          🔑
        </span>
        INICIAR SESIÓN
      </a>
      <a className="bg-gray-900 text-white py-4 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-3 min-w-44 w-[70%] hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        href={homeRoutesConfig.children.register.url}
      >
        {/* Placeholder para SVG de lápiz */}
        <span role="img" aria-label="lápiz" className="text-2xl">
          📝
        </span>
        REGISTRARME
      </a>
    </div>
  );
};

export default ActionButtons;