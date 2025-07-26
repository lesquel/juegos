import { Star, StarOff } from "lucide-react";
import { useState } from "react";
import { CommentGameDataClient } from "../services/commentGameDataClient";

interface InlineEditCommentProps {
  commentId: string;
  initialComment: string;
  initialRating: number;
  onCancel: () => void;
  onSave: () => void;
}

export const InlineEditComment = ({
  commentId,
  initialComment,
  initialRating,
  onCancel,
  onSave,
}: InlineEditCommentProps) => {
  const [editComment, setEditComment] = useState(initialComment);
  const [editRating, setEditRating] = useState(initialRating);

  const { mutate, isPending, error } = CommentGameDataClient.editCommentGame(commentId);

  const handleSave = () => {
    mutate(
      { comment: editComment, rating: editRating },
      {
        onSuccess: () => {
          onSave();
        },
      }
    );
  };

  const handleCancel = () => {
    setEditComment(initialComment);
    setEditRating(initialRating);
    onCancel();
  };

  return (
    <div className="mt-4">
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error.errors?.join(", ") || "No se pudo actualizar el comentario"}
        </div>
      )}

      {/* Rating en modo edición */}
      <div className="mb-4">
        <label htmlFor={`edit-rating-${commentId}`} className="block text-sm font-medium text-gray-300 mb-1">
          Tu calificación
        </label>
        <div className="flex space-x-1" id={`edit-rating-${commentId}`}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isSelected = editRating >= star;
            const StarIcon = isSelected ? Star : StarOff;
            return (
              <button
                type="button"
                key={star}
                onClick={() => setEditRating(star)}
                className="text-yellow-400 hover:scale-110 transition"
                disabled={isPending}
              >
                <StarIcon
                  className="w-6 h-6"
                  fill={isSelected ? "currentColor" : "none"}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Comentario en modo edición */}
      <div className="mb-4">
        <label htmlFor={`edit-comment-${commentId}`} className="block text-sm font-medium text-gray-300 mb-1">
          Comentario
        </label>
        <textarea
          id={`edit-comment-${commentId}`}
          rows={3}
          value={editComment}
          onChange={(e) => setEditComment(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-600 bg-gray-900 text-white rounded-md shadow-sm focus:ring focus:ring-indigo-400"
          disabled={isPending}
        />
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isPending || !editComment.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Guardando..." : "Guardar"}
        </button>
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
