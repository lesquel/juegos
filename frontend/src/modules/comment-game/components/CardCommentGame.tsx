import { Edit } from "lucide-react";
import { UserClientData } from "@modules/user/services/userClientData";
import type { CommentGame } from "../models/comment-game.model";
import { DeleteCommentGame } from "./DeleteCommentGame";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { useStore } from "zustand";
import { useEffect, useState } from "react";
import { InlineEditComment } from "./InlineEditComment";
import { CommentDisplay } from "./CommentDisplay";

export const CardCommentGame = ({
  commentGame,
}: {
  commentGame: CommentGame;
}) => {
  const { comment, created_at, review_id, user_id, rating } = commentGame;
  const [isUserComment, setIsUserComment] = useState(false);
  const [editing, setEditing] = useState(false);

  const { data: user } = UserClientData.getUser(user_id);
  const userName = user?.email || "Usuario Anónimo";
  const userInitial = userName.charAt(0).toUpperCase();
  const meUser = useStore(useAuthStore).user;

  useEffect(() => {
    setIsUserComment(user?.user_id === meUser?.user.user_id);
  }, [user, meUser]);

  const handleSaveComplete = () => {
    setEditing(false);
    // Aquí podrías refrescar los datos si es necesario
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  return (
    <div className="flex items-start sm:space-x-4 gap-5 p-5 bg-gray-800 bg-opacity-50 rounded-2xl border border-gray-700 space-y-4 sm:space-y-0">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
          {userInitial}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-lg font-bold text-white truncate">{userName}</h4>
          <div className="flex items-center space-x-2 self-end sm:self-center">
            {isUserComment && !editing && (
              <>
                <button
                  className="text-white hover:text-blue-400 transition"
                  onClick={() => setEditing(true)}
                  title="Editar comentario"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <DeleteCommentGame commentId={review_id} />
              </>
            )}
          </div>
        </div>

        {/* Mostrar estrellas o formulario de edición */}
        {editing ? (
          <InlineEditComment
            commentId={review_id}
            initialComment={comment}
            initialRating={rating}
            onSave={handleSaveComplete}
            onCancel={handleCancelEdit}
          />
        ) : (
          <CommentDisplay
            comment={comment}
            rating={rating}
            createdAt={created_at.toString()}
          />
        )}
      </div>
    </div>
  );
};
