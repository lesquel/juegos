import { Star, StarOff } from "lucide-react";

interface CommentDisplayProps {
  comment: string;
  rating: number;
  createdAt: string;
}

export const CommentDisplay = ({ comment, rating, createdAt }: CommentDisplayProps) => {
  return (
    <>
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
      <p className="text-gray-300 mb-2 break-words">{comment}</p>
      <div className="flex justify-end">
        <span className="text-xs text-gray-400">
          {new Date(createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </>
  );
};
