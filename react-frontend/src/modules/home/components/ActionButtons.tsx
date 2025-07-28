import React, { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { homeRoutesConfig } from "../config/home.routes.config";
import { MiddlewareUser } from "@modules/auth/middleware/middlewareUser";
import { LogIn, NotebookPen } from "lucide-react";

const ActionButtons: React.FC = memo(() => {
  // Memoizar iconos
  const loginIcon = useMemo(
    () => (
      <LogIn className="h-5 w-5 text-gray-300 hover:text-white transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-gray-800" />
    ),
    []
  );

  const registerIcon = useMemo(() => <NotebookPen className="h-5 w-5" />, []);

  // Memoizar URLs
  const loginUrl = useMemo(() => homeRoutesConfig.children.login.url, []);
  const registerUrl = useMemo(() => homeRoutesConfig.children.register.url, []);

  // Si el usuario está logueado, no mostrar los botones
  if (MiddlewareUser.isLogged()) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg mx-auto">
      <Link
        to={loginUrl}
        className="w-full sm:w-auto flex-1 text-center bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
        aria-label="Ir a página de inicio de sesión"
      >
        {loginIcon}
        <span>Iniciar Sesión</span>
      </Link>
      <Link
        to={registerUrl}
        className="w-full sm:w-auto flex-1 text-center bg-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
        aria-label="Ir a página de registro"
      >
        {registerIcon}
        <span>Registrarse</span>
      </Link>
    </div>
  );
});

ActionButtons.displayName = "ActionButtons";

export default ActionButtons;
