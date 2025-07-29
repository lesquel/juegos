import { useEffect, memo, useCallback } from "react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const Modal = memo(({ children, isOpen, onClose, className = "" }: ModalProps) => {
  const handleEsc = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Soporte para teclado en backdrop (Enter y Space)
  const handleBackdropKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEsc]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop mejorado con blur y gradiente */}
      <button
        type="button"
        className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/90 to-gray-900/80 backdrop-filter backdrop-blur-md border-0 p-0 cursor-pointer"
        onClick={onClose}
        onKeyDown={handleBackdropKeyDown}
        aria-label="Cerrar modal"
      />

      {/* Modal content container - centrado manualmente */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`relative bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl backdrop-filter backdrop-blur-sm text-white pointer-events-auto ${className}`}
          style={{ margin: 0 }}
        >
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = "Modal";
