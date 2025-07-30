import React, { memo, useRef, useCallback, useMemo, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useDeleteCommentGame } from "../services/commentGameDataClient";

interface DeleteCommentGameProps {
  commentId: string;
}

export const DeleteCommentGame: React.FC<DeleteCommentGameProps> = memo(
  ({ commentId }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { mutate, isPending } = useDeleteCommentGame(commentId);

    // Memoizar handler para abrir modal
    const openDialog = useCallback(() => {
      dialogRef.current?.showModal();
    }, []);

    // Memoizar handler para cerrar modal
    const closeDialog = useCallback(() => {
      dialogRef.current?.close();
    }, []);

    // Memoizar handler de eliminación
    const handleDelete = useCallback(() => {
      mutate(undefined, {
        onSuccess: () => {
          closeDialog();
        },
      });
    }, [mutate, closeDialog]);

    // Efecto para manejar la tecla Escape de manera global
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !isPending && dialogRef.current?.open) {
          closeDialog();
        }
      };

      if (dialogRef.current?.open) {
        document.addEventListener("keydown", handleKeyDown);
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [closeDialog, isPending]);

    // Memoizar icono de eliminar
    const deleteIcon = useMemo(
      () => <Trash2 className="w-5 h-5" aria-hidden="true" />,
      []
    );

    // Memoizar icono de carga
    const loadingIcon = useMemo(
      () => (
        <svg
          className="animate-spin w-4 h-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ),
      []
    );

    return (
      <>
        <button
          onClick={openDialog}
          disabled={isPending}
          className="text-gray-300 hover:text-red-400 focus:text-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400/50 rounded-xl p-2 hover:bg-red-500/10"
          aria-label="Eliminar comentario"
          title="Eliminar comentario"
        >
          {deleteIcon}
        </button>

        <dialog
          ref={dialogRef}
          className="rounded-2xl p-0 max-w-sm w-full backdrop:bg-black/70 bg-transparent border-0"
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-red-400/5 to-red-600/10 rounded-2xl"></div>
            
            <div className="relative flex flex-col items-center justify-center gap-4">
              {/* Warning Icon */}
              <div className="w-16 h-16 rounded-full bg-red-500/20 backdrop-blur-sm flex items-center justify-center mb-2 border border-red-400/30">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h2
                id="delete-dialog-title"
                className="text-lg font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent text-center"
              >
                ¿Eliminar comentario?
              </h2>

              <p
                id="delete-dialog-description"
                className="text-gray-300 text-center text-sm"
              >
                Esta acción eliminará el comentario permanentemente y no se
                puede deshacer.
              </p>

              <div className="flex justify-center gap-3 w-full pt-2">
                <button
                  onClick={closeDialog}
                  disabled={isPending}
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                  {isPending ? (
                    <>
                      {loadingIcon}
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </dialog>
      </>
    );
  }
);

DeleteCommentGame.displayName = "DeleteCommentGame";
