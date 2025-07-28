import { useEffect, useState, memo, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { gamesRoutesConfig } from "@modules/games/config/games.routes.config";
import { categoryGameRoutesConfig } from "@modules/category-game/config/category-game.routes.config";
import { NavbarAuthLoginRegister } from "@modules/auth/components/NavbarAuthLoginRegister";
import { VirtualCurrency } from "@modules/user/components/VirtualCurrency";
import { GamepadIcon, Menu, X } from "lucide-react";

export const Navbar = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  // Función para obtener la página actual
  const getCurrentPath = useCallback(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      console.log("Current path:", path); // Debug temporal
      return path;
    }
    return "";
  }, []);

  // Función para verificar si un enlace está activo
  const isActivePage = useCallback(
    (path: string) => {
      // Normalizar las rutas removiendo barras al final
      const normalizedCurrentPath = currentPath.replace(/\/$/, "") || "/";
      const normalizedPath = path.replace(/\/$/, "") || "/";

      console.log("Checking:", normalizedPath, "vs", normalizedCurrentPath); // Debug temporal

      // Para la página de inicio
      if (normalizedPath === "/" && normalizedCurrentPath === "/") return true;

      // Para otras páginas, verificar si la ruta actual comienza con la ruta del enlace
      if (
        normalizedPath !== "/" &&
        normalizedCurrentPath.startsWith(normalizedPath)
      )
        return true;

      return false;
    },
    [currentPath]
  );

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => {
      const newState = !prev;
      if (newState) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
      return newState;
    });
  }, []);

  useEffect(() => {
    // Función para actualizar la ruta actual
    const updateCurrentPath = () => {
      setCurrentPath(getCurrentPath());
    };

    // Obtener la ruta inicial
    updateCurrentPath();

    // Escuchar cambios de navegación
    window.addEventListener("popstate", updateCurrentPath);

    // Escuchar cambios en la URL (para SPAs)
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        updateCurrentPath();
      }
    });

    observer.observe(document, { subtree: true, childList: true });

    // Polling fallback para asegurar actualización
    const interval = setInterval(updateCurrentPath, 1000);

    // Limpieza
    return () => {
      document.body.classList.remove("overflow-hidden");
      setMobileMenuOpen(false);
      window.removeEventListener("popstate", updateCurrentPath);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [getCurrentPath]);

  return (
    <>
      <header
        id="header"
        data-astro-persist="navbar-header"
        className="fixed top-0 left-0 w-full z-50 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 transition-all duration-300 ease-in-out"
      >
        <nav className="flex h-16 items-center justify-between w-full px-6">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-white transition-colors hover:text-purple-400"
            >
              <GamepadIcon className="h-6 w-6" />
              <span>GameForGood</span>
            </Link>
          </div>

          <div className="flex">
            {/* Desktop Menu */}
            <div className="hidden items-center gap-8 md:flex">
              <div className="hidden md:flex">
                <VirtualCurrency />
              </div>
              <Link
                to="/"
                className={`relative transition-all duration-300 ${
                  isActivePage("/")
                    ? "text-purple-400 font-bold scale-105 drop-shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Inicio
                {isActivePage("/") && (
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></span>
                )}
              </Link>
              <Link
                to={gamesRoutesConfig.base}
                className={`relative transition-all duration-300 ${
                  isActivePage(gamesRoutesConfig.base)
                    ? "text-purple-400 font-bold scale-105 drop-shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Juegos
                {isActivePage(gamesRoutesConfig.base) && (
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></span>
                )}
              </Link>
              <Link
                to={categoryGameRoutesConfig.base}
                className={`relative transition-all duration-300 ${
                  isActivePage(categoryGameRoutesConfig.base)
                    ? "text-purple-400 font-bold scale-105 drop-shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Categorías
                {isActivePage(categoryGameRoutesConfig.base) && (
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></span>
                )}
              </Link>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex">
                <NavbarAuthLoginRegister />
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center md:hidden">
                <button
                  id="mobile-menu-button"
                  onClick={toggleMobileMenu}
                  className="text-white focus:outline-none z-50 cursor-pointer"
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Slide-in Menu */}
      <button
        id="mobile-menu-backdrop"
        data-astro-persist="mobile-backdrop"
        className={`fixed inset-0 bg-black opacity-60 z-30 ${
          mobileMenuOpen ? "" : "hidden"
        }`}
        onClick={toggleMobileMenu}
        aria-label="Cerrar menú móvil"
        type="button"
      ></button>

      <div
        id="mobile-menu"
        data-astro-persist="mobile-menu-panel"
        className={`fixed top-16 right-0 h-full w-4/6 max-w-sm bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="p-6 flex flex-col space-y-6">
          <Link
            to="/"
            className={`relative text-lg transition-all duration-300 ${
              isActivePage("/")
                ? "text-purple-400 font-bold scale-105 drop-shadow-lg"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Inicio
            {isActivePage("/") && (
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></span>
            )}
          </Link>
          <Link
            to={gamesRoutesConfig.base}
            className={`relative text-lg transition-all duration-300 ${
              isActivePage(gamesRoutesConfig.base)
                ? "text-purple-400 font-bold scale-105 drop-shadow-lg"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Juegos
            {isActivePage(gamesRoutesConfig.base) && (
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></span>
            )}
          </Link>
          <Link
            to={categoryGameRoutesConfig.base}
            className={`relative text-lg transition-all duration-300 ${
              isActivePage(categoryGameRoutesConfig.base)
                ? "text-purple-400 font-bold scale-105 drop-shadow-lg"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Categorías
            {isActivePage(categoryGameRoutesConfig.base) && (
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></span>
            )}
          </Link>
          <div className="flex flex-col justify-between items-start pt-6 border-t border-gray-700">
            <NavbarAuthLoginRegister />
            <VirtualCurrency />
          </div>
        </div>
      </div>
    </>
  );
});

Navbar.displayName = "Navbar";
