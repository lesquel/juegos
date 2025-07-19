import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { CommentGameDataClient } from "../services/commentGameDataClient";

export const DeleteCommentGame = ({ commentId }: { commentId: string }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { mutate } = CommentGameDataClient.deleteCommentGame(commentId);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleDelete = () => {
    mutate();
    closeDialog();
  };

  return (
    <>
      <button
        onClick={openDialog}
        className="text-white hover:text-red-500 transition"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-lg p-6 max-w-sm w-full backdrop:bg-black/50 text-black"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-lg font-semibold mb-2">¿Estás seguro?</h2>
          <p className="mb-4">
            Esta acción eliminará el comentario y no se puede deshacer.
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={closeDialog}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
