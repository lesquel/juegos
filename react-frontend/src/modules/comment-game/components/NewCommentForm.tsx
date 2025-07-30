import React, { memo, useMemo, useCallback, useState } from "react";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { RatingInput } from "./RatingInput";
import { CommentGameDataClient, useCreateCommentGame } from "../services/commentGameDataClient";
import { Loader, MessageCircleCode, Send } from "lucide-react";

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
    const { mutate, error } = useCreateCommentGame(gameId, onSuccess);

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
          className="text-red-300 bg-red-500/10 backdrop-blur-sm border border-red-400/30 p-4 rounded-xl mb-6"
          role="alert"
        >
          <h4 className="font-semibold mb-2 text-red-400">Error al publicar comentario:</h4>
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
      () => <MessageCircleCode className="h-6 w-6 text-cyan-400" />,
      []
    );

    return (
      <section className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>
        
        <div className="relative">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                {commentIcon}
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Deja tu Comentario
              </h3>
            </div>
            <p className="text-gray-300 text-base">
              Comparte tu experiencia con este juego
            </p>
          </header>

        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <form onSubmit={onFormSubmit} className="w-full space-y-6">
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
                        className="block text-sm font-medium text-gray-300 mb-3"
                      >
                        Comentario
                      </label>
                      <textarea
                        id="comment-field"
                        rows={4}
                        value={field.state.value}
                        onChange={handleChange}
                        className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl shadow-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 transition-all duration-300 resize-none placeholder-gray-400"
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
                className="w-full py-4 px-6 cursor-pointer bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50"
                aria-label="Publicar comentario"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader />
                    Publicando Comentario...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Send className="w-5 h-5" />
                    Publicar Comentario
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
        </div>
      </section>
    );
  }
);

NewCommentForm.displayName = "NewCommentForm";
