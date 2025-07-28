import React, { memo, useMemo } from "react";
import { Star, StarOff } from "lucide-react";

interface CommentDisplayProps {
  comment: string;
  rating: number;
  createdAt: string;
}

export const CommentDisplay: React.FC<CommentDisplayProps> = memo(({ comment, rating, createdAt }) => {
  // Memoizar las estrellas de rating para evitar recreaciones
  const starsDisplay = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const starIndex = i + 1;
      const isActive = starIndex <= rating;
      const StarIcon = isActive ? Star : StarOff;
      
      return (
        <StarIcon
          key={starIndex}
          className="w-5 h-5 mr-1 text-yellow-400 transition-colors duration-200"
          fill={isActive ? "currentColor" : "none"}
          aria-hidden="true"
        />
      );
    });
  }, [rating]);

  // Memoizar fecha formateada
  const formattedDate = useMemo(() => {
    return new Date(createdAt).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [createdAt]);

  return (
    <article className="space-y-3">
      {/* Rating Stars */}
      <div 
        className="flex items-center"
        aria-label={`Calificación: ${rating} de 5 estrellas`}
      >
        {starsDisplay}
        <span className="ml-2 text-sm text-gray-400">
          ({rating}/5)
        </span>
      </div>

      {/* Comment Text */}
      <p className="text-gray-300 break-words leading-relaxed">
        {comment}
      </p>

      {/* Date */}
      <footer className="flex justify-end">
        <time 
          className="text-xs text-gray-400"
          dateTime={createdAt}
        >
          {formattedDate}
        </time>
      </footer>
    </article>
  );
});

CommentDisplay.displayName = "CommentDisplay";
