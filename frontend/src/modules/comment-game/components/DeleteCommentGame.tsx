import React, { memo, useRef, useCallback, useMemo, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { CommentGameDataClient } from "../services/commentGameDataClient";

interface DeleteCommentGameProps {
  commentId: string;
}

export const DeleteCommentGame: React.FC<DeleteCommentGameProps> = memo(({ commentId }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { mutate, isPending } = CommentGameDataClient.deleteCommentGame(commentId);

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
      if (e.key === 'Escape' && !isPending && dialogRef.current?.open) {
        closeDialog();
      }
    };

    if (dialogRef.current?.open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDialog, isPending]);

  // Memoizar icono de eliminar
  const deleteIcon = useMemo(() => (
    <Trash2 className="w-5 h-5" aria-hidden="true" />
  ), []);

  // Memoizar icono de carga
  const loadingIcon = useMemo(() => (
    <svg 
      className="animate-spin w-4 h-4 text-white" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ), []);

  return (
    <>
      <button
        onClick={openDialog}
        disabled={isPending}
        className="text-white hover:text-red-500 focus:text-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded p-1"
        aria-label="Eliminar comentario"
        title="Eliminar comentario"
      >
        {deleteIcon}
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-lg p-0 max-w-sm w-full backdrop:bg-black/70 bg-transparent border-0"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-600 shadow-2xl">
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Warning Icon */}
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <svg 
                className="w-8 h-8 text-red-600" 
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
              className="text-lg font-semibold text-white text-center"
            >
              ¿Eliminar comentario?
            </h2>
            
            <p 
              id="delete-dialog-description" 
              className="text-gray-300 text-center text-sm"
            >
              Esta acción eliminará el comentario permanentemente y no se puede deshacer.
            </p>
            
            <div className="flex justify-center gap-3 w-full pt-2">
              <button
                onClick={closeDialog}
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
});

DeleteCommentGame.displayName = "DeleteCommentGame";
