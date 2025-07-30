import React, { memo, useState, useCallback, useMemo } from "react";
import { Star, StarOff } from "lucide-react";
import { useEditCommentGame } from "../services/commentGameDataClient";
import { LoadingComponent } from "@/components/LoadingComponent";

interface InlineEditCommentProps {
  commentId: string;
  initialComment: string;
  initialRating: number;
  onCancel: () => void;
  onSave: () => void;
}

export const InlineEditComment: React.FC<InlineEditCommentProps> = memo(
  ({ commentId, initialComment, initialRating, onCancel, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [editComment, setEditComment] = useState(initialComment);
    const [editRating, setEditRating] = useState(initialRating);

    const { mutate, isPending, error } = useEditCommentGame(commentId);

    // Memoizar handler de guardado
    const handleSave = useCallback(() => {
      mutate(
        { comment: editComment, rating: editRating },
        {
          onSuccess: () => {
            setIsLoading(false);
            onSave();
          },
        }
      );
    }, [mutate, editComment, editRating, onSave]);

    // Memoizar handler de cancelación
    const handleCancel = useCallback(() => {
      setEditComment(initialComment);
      setEditRating(initialRating);
      onCancel();
    }, [initialComment, initialRating, onCancel]);

    // Memoizar cambio de comentario
    const handleCommentChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditComment(e.target.value);
      },
      []
    );

    // Memoizar estrellas de rating
    const ratingStars = useMemo(() => {
      return Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isSelected = editRating >= starValue;
        const StarIcon = isSelected ? Star : StarOff;

        return (
          <button
            type="button"
            key={starValue}
            onClick={() => setEditRating(starValue)}
            className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
              isSelected 
                ? "text-yellow-400 bg-yellow-400/20" 
                : "text-gray-500 hover:text-yellow-400 hover:bg-white/10"
            }`}
            disabled={isPending}
            aria-label={`Calificar con ${starValue} estrella${starValue !== 1 ? "s" : ""}`}
          >
            <StarIcon
              className="w-6 h-6"
              fill={isSelected ? "currentColor" : "none"}
              aria-hidden="true"
            />
          </button>
        );
      });
    }, [editRating, isPending]);

    // Memoizar mensaje de error
    const errorMessage = useMemo(() => {
      if (!error) return null;

      return (
        <div
          className="mb-4 p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 text-red-400 rounded-xl"
          role="alert"
        >
          <strong>Error:</strong>{" "}
          {error.errors?.join(", ") || "No se pudo actualizar el comentario"}
        </div>
      );
    }, [error]);

    // Memoizar estado del botón guardar
    const saveButtonProps = useMemo(
      () => ({
        disabled: isPending || !editComment.trim(),
        className: `px-6 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`,
      }),
      [isPending, editComment]
    );

    return (
      <div className="mt-6 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl space-y-6">
        {isLoading && <LoadingComponent />}
        {errorMessage}

        {/* Rating Section */}
        <fieldset className="space-y-3">
          <legend className="block text-sm font-medium text-gray-300">
            Tu calificación
          </legend>
          <div
            className="flex space-x-2"
            role="radiogroup"
            aria-label="Calificación del comentario"
          >
            {ratingStars}
          </div>
          <div className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Calificación actual: {editRating}/5
          </div>
        </fieldset>

        {/* Comment Section */}
        <div className="space-y-3">
          <label
            htmlFor={`edit-comment-${commentId}`}
            className="block text-sm font-medium text-gray-300"
          >
            Comentario
          </label>
          <textarea
            id={`edit-comment-${commentId}`}
            rows={3}
            value={editComment}
            onChange={handleCommentChange}
            className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl shadow-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 transition-all duration-300 resize-vertical placeholder-gray-400"
            disabled={isPending}
            placeholder="Escribe tu comentario aquí..."
            aria-describedby={`edit-comment-help-${commentId}`}
          />
          <div
            id={`edit-comment-help-${commentId}`}
            className="text-xs text-gray-400"
          >
            Mínimo 1 caracter requerido
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button onClick={handleSave} {...saveButtonProps}>
            {isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={isPending}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }
);

InlineEditComment.displayName = "InlineEditComment";
