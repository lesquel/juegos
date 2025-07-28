import { Edit } from "lucide-react";
import { useUser } from "@modules/user/services/userClientData";
import type { CommentGame } from "../models/comment-game.model";
import { DeleteCommentGame } from "./DeleteCommentGame";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { useStore } from "zustand";
import { useEffect, useState, memo, useMemo, useCallback } from "react";
import { InlineEditComment } from "./InlineEditComment";
import { CommentDisplay } from "./CommentDisplay";

interface CardCommentGameProps {
  commentGame: CommentGame;
}

export const CardCommentGame = memo(({ commentGame }: CardCommentGameProps) => {
  const { comment, created_at, review_id, user_id, rating } = commentGame;
  const [isUserComment, setIsUserComment] = useState(false);
  const [editing, setEditing] = useState(false);

  const { data: user } = useUser(user_id);
  const meUser = useStore(useAuthStore).user;

  console.log("user", user);

  // Memoizar información del usuario
  const userInfo = useMemo(() => {
    const userName = user?.email || "Usuario Anónimo";
    const userInitial = userName.charAt(0).toUpperCase();
    return { userName, userInitial };
  }, [user?.email]);

  // Memoizar callbacks
  const handleSaveComplete = useCallback(() => {
    setEditing(false);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditing(false);
  }, []);

  const handleEditClick = useCallback(() => {
    setEditing(true);
  }, []);

  // Memoizar iconos
  const editIcon = useMemo(() => <Edit className="w-5 h-5" />, []);

  // Memoizar el avatar del usuario
  const userAvatar = useMemo(
    () => (
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
        {userInfo.userInitial}
      </div>
    ),
    [userInfo.userInitial]
  );

  // Memoizar los botones de acción
  const actionButtons = useMemo(() => {
    if (!isUserComment || editing) return null;

    return (
      <>
        <button
          className="text-white hover:text-blue-400 transition-colors p-1 rounded"
          onClick={handleEditClick}
          title="Editar comentario"
          aria-label="Editar comentario"
        >
          {editIcon}
        </button>
        <DeleteCommentGame commentId={review_id} />
      </>
    );
  }, [isUserComment, editing, handleEditClick, editIcon, review_id]);

  useEffect(() => {
    setIsUserComment(user?.user_id === meUser?.user.user_id);
  }, [user?.user_id, meUser?.user.user_id]);

  return (
    <div className="flex items-start sm:space-x-4 gap-5 p-5 bg-gray-800 bg-opacity-50 rounded-2xl border border-gray-700 space-y-4 sm:space-y-0 hover:bg-opacity-70 transition-all duration-200">
      <div className="flex-shrink-0">{userAvatar}</div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-lg font-bold text-white truncate">
            {userInfo.userName}
          </h4>
          <div className="flex items-center space-x-2 self-end sm:self-center">
            {actionButtons}
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
});

CardCommentGame.displayName = "CardCommentGame";
