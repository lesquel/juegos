import { Star, StarOff } from "lucide-react";
import { UserClientData } from "@modules/user/services/userClientData";
import type { CommentGame } from "../models/comment-game.model";
import { DeleteCommentGame } from "./DeleteCommentGame";
import { useAuthStore } from "@modules/auth/store/auth.store";
import { useStore } from "zustand";
import { useEffect, useState } from "react";
import { EditCommentGame } from "./EditCommentForm";

export const CardCommentGame = ({
  commentGame,
}: {
  commentGame: CommentGame;
}) => {
  const { comment, created_at, review_id, user_id, rating } = commentGame;
  const [isUserComment, setIsUserComment] = useState(false);

  const { data: user } = UserClientData.getUser(user_id);
  const userName = user?.email || "Usuario Anónimo";
  const userInitial = userName.charAt(0).toUpperCase();
  const meUser = useStore(useAuthStore).user;

  useEffect(() => {
    setIsUserComment(user?.user_id === meUser?.user.user_id);
  }, [user]);

  return (
    <div className="flex items-start space-x-4 p-5 bg-gray-800 bg-opacity-50 rounded-2xl border border-gray-700">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
          {userInitial}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-white">{userName}</h4>
          <span className="text-xs text-gray-400">
            {new Date(created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Mostrar estrellas */}
        <div className="flex items-center mt-1 mb-1">
          {[1, 2, 3, 4, 5].map((i) => {
            const isActive = i <= rating;
            const StarIcon = isActive ? Star : StarOff;
            return (
              <StarIcon
                key={i}
                className="w-5 h-5 mr-1 text-yellow-400"
                fill={isActive ? "currentColor" : "none"}
              />
            );
          })}
        </div>

        <p className="text-gray-300">{comment}</p>
      </div>
      {isUserComment && <DeleteCommentGame commentId={review_id} />}
      {isUserComment && <EditCommentGame commentId={review_id} />}
    </div>
  );
};
