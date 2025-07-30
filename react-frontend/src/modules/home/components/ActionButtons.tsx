import React, { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { homeRoutesConfig } from "../config/home.routes.config";
import { MiddlewareUser } from "@modules/auth/middleware/middlewareUser";
import { LogIn, NotebookPen } from "lucide-react";

const ActionButtons: React.FC = memo(() => {
  // Memoizar iconos
  const loginIcon = useMemo(
    () => (
      <LogIn className="h-5 w-5" />
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
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-md mx-auto">
      <Link
        to={loginUrl}
        className="w-full sm:w-auto flex-1 text-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3"
        aria-label="Ir a página de inicio de sesión"
      >
        {loginIcon}
        <span className="text-lg">Iniciar Sesión</span>
      </Link>
      <Link
        to={registerUrl}
        className="w-full sm:w-auto flex-1 text-center bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3"
        aria-label="Ir a página de registro"
      >
        {registerIcon}
        <span className="text-lg">Registrarse</span>
      </Link>
    </div>
  );
});

ActionButtons.displayName = "ActionButtons";

export default ActionButtons;
