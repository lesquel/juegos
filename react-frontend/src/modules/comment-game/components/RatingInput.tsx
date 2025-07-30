import React, { memo, useMemo } from "react";
import { Star, StarOff } from "lucide-react";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export const RatingInput: React.FC<RatingInputProps> = memo(
  ({ value, onChange, error }) => {
    const stars = useMemo(() => [1, 2, 3, 4, 5], []);

    const errorMessage = useMemo(() => {
      if (!error || error.length === 0) return null;
      return (
        <p className="text-red-400 text-sm mt-2" role="alert" id="rating-error">
          {error}
        </p>
      );
    }, [error]);

    const ratingText = useMemo(() => {
      const descriptions = {
        0: "Sin calificación",
        1: "Muy malo",
        2: "Malo", 
        3: "Regular",
        4: "Bueno",
        5: "Excelente",
      };
      return (
        descriptions[value as keyof typeof descriptions] || "Sin calificación"
      );
    }, [value]);

    return (
      <fieldset className="mb-6">
        <legend
          id="rating-label"
          className="block text-sm font-medium text-gray-300 mb-3"
        >
          Tu calificación
        </legend>

        <div className="flex items-center gap-4">
          <div
            className="flex space-x-2"
            role="radiogroup"
            aria-labelledby="rating-label"
            aria-describedby={error ? "rating-error" : undefined}
          >
            {stars.map((star) => {
              const isSelected = value === star;
              const StarIcon = value >= star ? Star : StarOff;

              return (
                <label key={star} className="cursor-pointer p-2 rounded-xl hover:bg-white/10 transition-all duration-200">
                  <input
                    type="radio"
                    name="rating"
                    value={star}
                    checked={value === star}
                    onChange={() => onChange(star)}
                    className="sr-only"
                    aria-checked={isSelected}
                  />
                  <StarIcon
                    className={`w-6 h-6 transition-all duration-200 hover:scale-110 ${
                      value >= star 
                        ? "text-yellow-400 hover:text-yellow-300" 
                        : "text-gray-500 hover:text-yellow-400"
                    }`}
                    fill={value >= star ? "currentColor" : "none"}
                    aria-hidden="true"
                  />
                </label>
              );
            })}
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {value > 0 ? `${value}/5` : "0/5"}
            </span>
            <span className="text-xs text-gray-400">{ratingText}</span>
          </div>
        </div>

        {errorMessage}
      </fieldset>
    );
  }
);

RatingInput.displayName = "RatingInput";
