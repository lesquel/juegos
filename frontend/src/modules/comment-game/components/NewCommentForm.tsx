import { RatingInput } from "./RatingInput";
import { CommentGameDataClient } from "../services/commentGameDataClient";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";

interface NewCommentFormProps {
  gameId: string;
}

export const NewCommentForm = ({ gameId }: NewCommentFormProps) => {
  const { mutate, error } = CommentGameDataClient.createCommentGame(gameId);

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
    },
  });

  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 border border-gray-700 mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">Deja tu Comentario</h3>
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();

            }}
            className="w-full"
          >
            {error && (
              <p className="text-red-500 bg-red-100 p-2 rounded-md">
                {error.errors.join(", ")}
              </p>
            )}

            {/* Campo de Comentario */}
            <form.Field name="comment">
              {(field) => (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Comentario
                  </label>
                  <textarea
                    rows={3}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 p-2 block w-full border border-gray-600 bg-gray-900 text-white rounded-md shadow-sm focus:ring focus:ring-indigo-400"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-400 text-sm mt-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Campo de Rating */}
            <form.Field name="rating">
              {(field) => {
                const errors = (field.state.meta.errors || []).filter(Boolean).map(String);
                return (
                  <RatingInput
                    value={field.state.value}
                    onChange={field.handleChange}
                    error={errors}
                  />
                );
              }}
            </form.Field>

            <button
              type="submit"
              className="w-full py-2 px-4 cursor-pointer bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              Publicar Comentario
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
