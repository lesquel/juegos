import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Star, StarOff, Pencil } from "lucide-react";
import { CommentGameDataClient } from "../services/commentGameDataClient";
import { useRef } from "react";

export const EditCommentGame = ({ commentId }: { commentId: string }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { mutate, error } = CommentGameDataClient.editCommentGame(commentId);

  const form = useForm({
    defaultValues: {
      comment: "",
      rating: 0,
    },
    validators: {
      onSubmit: z.object({
        comment: z.string().min(1, "El comentario es requerido."),
        rating: z.number().min(1, "Debes seleccionar al menos 1 estrella."),
      }),
    },
    onSubmit: async ({ value }) => {
      mutate(value);
      closeDialog();
    },
  });

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      {/* Botón para abrir el diálogo */}
      <button
        onClick={openDialog}
        className="text-white hover:text-blue-400 transition"
      >
        <Pencil className="w-5 h-5" />
      </button>

      {/* Diálogo de edición */}
      <dialog
        ref={dialogRef}
        className="rounded-lg p-6 max-w-lg w-full backdrop:bg-black/50 text-black"
      >
        <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
          Editar Comentario
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className="w-full"
        >
          {error && (
            <p className="text-red-500 bg-red-100 p-2 rounded-md mb-2">
              {error.errors.join(", ")}
            </p>
          )}

          {/* Comentario */}
          <form.Field
            name="comment"
            children={(field) => (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Comentario
                </label>
                <textarea
                  rows={3}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="mt-1 block w-full border border-gray-400 bg-white text-black rounded-md shadow-sm focus:ring focus:ring-indigo-400"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          />

          {/* Rating */}
          <form.Field
            name="rating"
            children={(field) => (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tu calificación
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isSelected = field.state.value >= star;
                    const StarIcon = isSelected ? Star : StarOff;

                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => field.handleChange(star)}
                        className="text-yellow-400 hover:scale-110 transition"
                      >
                        <StarIcon
                          className="w-6 h-6"
                          fill={isSelected ? "currentColor" : "none"}
                        />
                      </button>
                    );
                  })}
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          />

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeDialog}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-black"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};
