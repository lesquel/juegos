import { CommentGameDataClient } from "../services/commentGameDataClient";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";

interface NewCommentFormProps {
  gameId: string;
  hasMounted: boolean;
  setHasMounted: (hasMounted: boolean) => void;
}
export const NewCommentForm = ({ gameId, hasMounted, setHasMounted }: NewCommentFormProps) => {
  const { mutate, error } = CommentGameDataClient.createCommentGame(gameId, hasMounted, setHasMounted);

  const form = useForm({
    defaultValues: {
      comment: "",
    },
    validators: {
      onSubmit: z.object({
        comment: z.string().min(1, "El comentario es requerido."),
      }),
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 border border-gray-700">
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
            <form.Field
              name="comment"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Comentario
                  </label>
                  <textarea
                    rows={3}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-400 text-sm mt-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            />

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              Publicar Comentario
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
