import React, { memo, useMemo, useCallback, useState } from "react";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { RatingInput } from "./RatingInput";
import { CommentGameDataClient } from "../services/commentGameDataClient";
import { Loader, MessageCircleCode, Send } from "lucide-react";
import { LoadingComponent } from "@components/LoadingComponent";

interface NewCommentFormProps {
  gameId: string;
}

interface CommentFormValues {
  comment: string;
  rating: number;
}

export const NewCommentForm: React.FC<NewCommentFormProps> = memo(
  ({ gameId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const onSuccess = () => {
      setIsLoading(false);
    };
    const { mutate, error } = CommentGameDataClient.createCommentGame(
      gameId,
      onSuccess
    );

    // Memoizar validadores
    const validators = useMemo(
      () => ({
        onSubmit: z.object({
          comment: z.string().min(1, "El comentario es requerido."),
          rating: z.number().min(1, "Debes seleccionar al menos 1 estrella."),
        }),
      }),
      []
    );

    // Memoizar valores por defecto
    const defaultValues = useMemo(
      (): CommentFormValues => ({
        comment: "",
        rating: 0,
      }),
      []
    );

    // Memoizar función de submit
    const handleSubmit = useCallback(
      async ({ value }: { value: CommentFormValues }) => {
        setIsLoading(true);
        mutate(value);
        form.reset();
      },
      [mutate]
    );

    const form = useForm({
      defaultValues,
      validators,
      onSubmit: handleSubmit,
    });

    // Memoizar mensaje de error
    const errorMessage = useMemo(() => {
      if (!error) return null;
      return (
        <div
          className="text-red-400 bg-red-900 bg-opacity-50 p-3 rounded-lg mb-4 border border-red-600"
          role="alert"
        >
          <h4 className="font-semibold mb-1">Error al publicar comentario:</h4>
          <p>{error.errors.join(", ")}</p>
        </div>
      );
    }, [error]);

    // Memoizar función de envío del formulario
    const onFormSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        void form.handleSubmit();
      },
      [form]
    );

    // Memoizar icono de comentario
    const commentIcon = useMemo(
      () => <MessageCircleCode className="h-6 w-6 text-teal-400" />,
      []
    );

    return (
      <section className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 border border-gray-700 mx-auto backdrop-blur-lg">
        <header className="mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            {commentIcon}
            Deja tu Comentario
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Comparte tu experiencia con este juego
          </p>
        </header>

        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <form onSubmit={onFormSubmit} className="w-full space-y-4">
              {errorMessage}

              {/* Campo de Comentario */}
              <form.Field name="comment">
                {(field) => {
                  // NO usar hooks aquí - mover la lógica directamente
                  const fieldErrors =
                    field.state.meta.errors.length > 0
                      ? field.state.meta.errors
                          .map((error) => error?.message)
                          .join(", ")
                      : null;

                  const handleChange = (
                    e: React.ChangeEvent<HTMLTextAreaElement>
                  ) => {
                    field.handleChange(e.target.value);
                  };

                  return (
                    <div>
                      <label
                        htmlFor="comment-field"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Comentario
                      </label>
                      <textarea
                        id="comment-field"
                        rows={4}
                        value={field.state.value}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-600 bg-gray-900 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
                        placeholder="Escribe tu comentario sobre este juego..."
                        aria-describedby={
                          fieldErrors ? "comment-error" : undefined
                        }
                      />
                      {fieldErrors && (
                        <p
                          id="comment-error"
                          className="text-red-400 text-sm mt-2"
                          role="alert"
                        >
                          {fieldErrors}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>

              {/* Campo de Rating */}
              <form.Field name="rating">
                {(field) => {
                  const errors =
                    field.state.meta.errors.length > 0
                      ? field.state.meta.errors
                          .map((error) => error?.message)
                          .join(", ")
                      : "";

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
                disabled={isLoading}
                type="submit"
                className="w-full py-3 px-6 cursor-pointer bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-semibold rounded-lg shadow-lg hover:from-teal-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 ease-in-out transform hover:scale-105"
                aria-label="Publicar comentario"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader />
                    Publicando Comentario...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Publicar Comentario
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }
);

NewCommentForm.displayName = "NewCommentForm";
