import React, { memo, useState, useCallback, useMemo } from "react";
import { Star, StarOff } from "lucide-react";
import { CommentGameDataClient, useEditCommentGame } from "../services/commentGameDataClient";

interface InlineEditCommentProps {
  commentId: string;
  initialComment: string;
  initialRating: number;
  onCancel: () => void;
  onSave: () => void;
}

export const InlineEditComment: React.FC<InlineEditCommentProps> = memo(({
  commentId,
  initialComment,
  initialRating,
  onCancel,
  onSave,
}) => {
  const [editComment, setEditComment] = useState(initialComment);
  const [editRating, setEditRating] = useState(initialRating);

  const { mutate, isPending, error } = useEditCommentGame(commentId); 

  // Memoizar handler de guardado
  const handleSave = useCallback(() => {
    mutate(
      { comment: editComment, rating: editRating },
      {
        onSuccess: () => {
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
  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditComment(e.target.value);
  }, []);

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
          className="text-yellow-400 hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded"
          disabled={isPending}
          aria-label={`Calificar con ${starValue} estrella${starValue !== 1 ? 's' : ''}`}
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
        className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-600 text-red-300 rounded-lg"
        role="alert"
      >
        <strong>Error:</strong> {error.errors?.join(", ") || "No se pudo actualizar el comentario"}
      </div>
    );
  }, [error]);

  // Memoizar estado del botón guardar
  const saveButtonProps = useMemo(() => ({
    disabled: isPending || !editComment.trim(),
    className: `px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
  }), [isPending, editComment]);

  return (
    <div className="mt-4 space-y-4">
      {errorMessage}

      {/* Rating Section */}
      <fieldset className="space-y-2">
        <legend className="block text-sm font-medium text-gray-300">
          Tu calificación
        </legend>
        <div
          className="flex space-x-1"
          role="radiogroup"
          aria-label="Calificación del comentario"
        >
          {ratingStars}
        </div>
        <div className="text-xs text-gray-400">
          Calificación actual: {editRating}/5
        </div>
      </fieldset>

      {/* Comment Section */}
      <div className="space-y-2">
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
          className="w-full p-3 border border-gray-600 bg-gray-900 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-vertical"
          disabled={isPending}
          placeholder="Escribe tu comentario aquí..."
          aria-describedby={`edit-comment-help-${commentId}`}
        />
        <div id={`edit-comment-help-${commentId}`} className="text-xs text-gray-400">
          Mínimo 1 caracter requerido
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          {...saveButtonProps}
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
});

InlineEditComment.displayName = "InlineEditComment";
