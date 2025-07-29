import { useEffect, useState, memo, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { gamesRoutesConfig } from "@modules/games/config/games.routes.config";
import { categoryGameRoutesConfig } from "@modules/category-game/config/category-game.routes.config";
import { NavbarAuthLoginRegister } from "@modules/auth/components/NavbarAuthLoginRegister";
import { VirtualCurrency } from "@modules/user/components/VirtualCurrency";
import { GamepadIcon, Menu, X } from "lucide-react";
import { GlobalClientData } from "@/services/globalClientData";

const navLinks = [
  { label: "Inicio", path: "/" },
  { label: "Juegos", path: gamesRoutesConfig.base },
  { label: "Categorías", path: categoryGameRoutesConfig.base },
];

export const Navbar = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [appName, setAppName] = useState("GameForGoodd");

  const getCurrentPath = useCallback(() => {
    return typeof window !== "undefined" ? window.location.pathname : "";
  }, []);

  const isActivePage = useCallback(
    (path: string) => {
      const clean = (p: string) => p.replace(/\/$/, "") || "/";
      const current = clean(currentPath);
      const target = clean(path);
      return target === "/" ? current === "/" : current.startsWith(target);
    },
    [currentPath]
  );

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => {
      const newState = !prev;
      document.body.classList.toggle("overflow-hidden", newState);
      return newState;
    });
  }, []);

  useEffect(() => {
    const updatePath = () => setCurrentPath(getCurrentPath());
    updatePath();

    window.addEventListener("popstate", updatePath);

    const observer = new MutationObserver(() => {
      if (location.href !== window.location.href) updatePath();
    });

    observer.observe(document, { childList: true, subtree: true });

    const interval = setInterval(updatePath, 1000);

    return () => {
      setMobileMenuOpen(false);
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("popstate", updatePath);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [getCurrentPath]);

  useEffect(() => {
    GlobalClientData.getGlobalInfo()
      .then((globalInfo) => setAppName(globalInfo.site_name))
      .catch((err) => console.error("Error fetching global info:", err));
  }, []);

  const renderNavLink = (path: string, label: string, isMobile = false) => {
    const active = isActivePage(path);
    const baseClasses = isMobile ? "text-lg" : "";
    const textClass = active
      ? "text-purple-400 font-bold scale-105 drop-shadow-lg"
      : "text-gray-300 hover:text-white";
    const underline = (
      <span className={`absolute -bottom-${isMobile ? "1" : "2"} left-0 w-${isMobile ? "12" : "full"} h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50`} />
    );

    return (
      <Link key={path} to={path} className={`relative transition-all duration-300 ${baseClasses} ${textClass}`}>
        {label}
        {active && underline}
      </Link>
    );
  };

  return (
    <>
      <header className="sticky top-0 left-0 w-full z-50 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 transition-all duration-300 ease-in-out">
        <nav className="flex h-16 items-center justify-between w-full px-6">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-white transition-colors hover:text-purple-400"
            >
              <GamepadIcon className="h-6 w-6" />
              <span>{appName}</span>
            </Link>
          </div>

          <div className="flex md:gap-4">
            <div className="hidden items-center gap-8 md:flex">
              <VirtualCurrency />
              {navLinks.map(({ path, label }) => renderNavLink(path, label))}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex">
                <NavbarAuthLoginRegister />
              </div>

              <div className="flex items-center md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="text-white focus:outline-none z-50 cursor-pointer"
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <button
        className={`fixed inset-0 bg-black opacity-60 z-30 ${mobileMenuOpen ? "" : "hidden"}`}
        onClick={toggleMobileMenu}
        aria-label="Cerrar menú móvil"
      />

      <div
        className={`fixed top-16 right-0 h-full w-4/6 max-w-sm bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"} md:hidden`}
      >
        <div className="p-6 flex flex-col space-y-6">
          {navLinks.map(({ path, label }) => renderNavLink(path, label, true))}

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
