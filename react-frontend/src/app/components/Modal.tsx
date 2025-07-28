import { useEffect, useRef, memo, useCallback } from "react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const Modal = memo(({ children, isOpen, onClose, className = "" }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleEsc = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Click en backdrop
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
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
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEsc]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`bg-gray-800 rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}
    >
      {/* Backdrop como button para manejar click y teclado */}
      <button
        type="button"
        className="fixed inset-0 bg-black bg-opacity-50 z-40 border-0 p-0 cursor-pointer"
        onClick={handleBackdropClick}
        onKeyDown={handleBackdropKeyDown}
        aria-label="Cerrar modal"
      />

      <div className="relative z-50">
        {children}
      </div>
    </dialog>
  );
});

Modal.displayName = "Modal";
