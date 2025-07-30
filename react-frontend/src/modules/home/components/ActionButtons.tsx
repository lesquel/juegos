import React, { memo, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { homeRoutesConfig } from "../config/home.routes.config";
import { MiddlewareUser } from "@modules/auth/middleware/middlewareUser";
import { LogIn, NotebookPen } from "lucide-react";

const ActionButtons: React.FC = memo(() => {
  // Memoizar iconos
  const loginIcon = useMemo(
    () => (
      <LogIn className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
    ),
    []
  );

  const registerIcon = useMemo(() => <NotebookPen className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />, []);

  // Memoizar URLs
  const loginUrl = useMemo(() => homeRoutesConfig.children.login.url, []);
  const registerUrl = useMemo(() => homeRoutesConfig.children.register.url, []);

  // Si el usuario está logueado, no mostrar los botones
  if (MiddlewareUser.isLogged()) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 lg:gap-16 justify-center items-center w-full max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 py-8 sm:py-10 lg:py-12">
      <Link
        to={loginUrl}
        className="group relative w-full sm:w-auto flex-1 text-center bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold py-6 sm:py-7 lg:py-8 px-10 sm:px-12 lg:px-16 rounded-3xl shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 transition-all duration-500 ease-out transform hover:scale-105 flex items-center justify-center gap-4 sm:gap-5 lg:gap-6 overflow-hidden min-h-[60px] sm:min-h-[70px] lg:min-h-[80px]"
        aria-label="Ir a página de inicio de sesión"
      >
        {/* Efecto de brillo animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        <div className="relative z-10 flex items-center gap-4 sm:gap-5 lg:gap-6">
          {loginIcon}
          <span className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide">Iniciar Sesión</span>
        </div>
      </Link>
      <Link
        to={registerUrl}
        className="group relative w-full sm:w-auto flex-1 text-center bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-bold py-6 sm:py-7 lg:py-8 px-10 sm:px-12 lg:px-16 rounded-3xl shadow-2xl hover:shadow-purple-500/25 focus:outline-none focus:ring-4 focus:ring-purple-400/50 transition-all duration-500 ease-out transform hover:scale-105 flex items-center justify-center gap-4 sm:gap-5 lg:gap-6 overflow-hidden min-h-[60px] sm:min-h-[70px] lg:min-h-[80px]"
        aria-label="Ir a página de registro"
      >
        {/* Efecto de brillo animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        <div className="relative z-10 flex items-center gap-4 sm:gap-5 lg:gap-6">
          {registerIcon}
          <span className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide">Registrarse</span>
        </div>
      </Link>
    </div>
  );
});

ActionButtons.displayName = "ActionButtons";

export default ActionButtons;
