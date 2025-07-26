import { useEffect, useState } from "react";
import { gamesRoutesConfig } from "@modules/games/config/games.routes.config";
import { categoryGameRoutesConfig } from "@modules/category-game/config/category-game.routes.config";
import { NavbarAuthLoginRegister } from "@modules/auth/components/NavbarAuthLoginRegister";
import { VirtualCurrency } from "@modules/user/components/VirtualCurrency";
import { Car, GamepadIcon, Menu, X } from "lucide-react";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    document.body.classList.toggle("overflow-hidden");
  };

  useEffect(() => {
    // Limpieza en caso de cerrar manualmente
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  return (
    <>
      <header
        id="header"
        data-astro-persist="navbar-header"
        className="sticky top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out bg-gray-900 bg-opacity-50 backdrop-blur-lg border-b border-gray-800"
      >
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <a
              href="/"
              className="text-2xl font-bold text-white hover:text-purple-400 transition-colors duration-300 flex items-center"
            >
              <GamepadIcon className="w-6 h-6" />
              GameForGood
            </a>
          </div>

          {/* Desktop Menu */}

          <div className="hidden md:flex items-center space-x-8">
            <VirtualCurrency />

            <a
              href="/"
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Inicio
            </a>
            <a
              href={gamesRoutesConfig.base}
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Juegos
            </a>
            <a
              href={categoryGameRoutesConfig.base}
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Categorías
            </a>
            <NavbarAuthLoginRegister />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-button"
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none z-50 cursor-pointer"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Slide-in Menu */}
      <div
        id="mobile-menu-backdrop"
        data-astro-persist="mobile-backdrop"
        className={`fixed inset-0 bg-black opacity-60 z-30 ${
          mobileMenuOpen ? "" : "hidden"
        }`}
        onClick={toggleMobileMenu}
      ></div>

      <div
        id="mobile-menu"
        data-astro-persist="mobile-menu-panel"
        className={`fixed top-0 right-0 h-full w-4/6 max-w-sm bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="p-8 flex flex-col space-y-6">
          <a href="/" className="text-gray-300 hover:text-white text-lg">
            Inicio
          </a>
          <a
            href={gamesRoutesConfig.base}
            className="text-gray-300 hover:text-white text-lg"
          >
            Juegos
          </a>
          <a
            href={categoryGameRoutesConfig.base}
            className="text-gray-300 hover:text-white text-lg"
          >
            Categorías
          </a>
          <div className=" flex justify-between items-start pt-6 border-t border-gray-700">
            <NavbarAuthLoginRegister />
            <VirtualCurrency />
          </div>
        </div>
      </div>
    </>
  );
};
