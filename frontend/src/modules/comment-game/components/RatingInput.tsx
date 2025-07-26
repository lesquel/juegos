import React, { memo, useMemo, useCallback } from "react";
import { Star, StarOff } from "lucide-react";

interface RatingInputProps {
    value: number;
    onChange: (value: number) => void;
    error?: string[];
}

export const RatingInput: React.FC<RatingInputProps> = memo(({ value, onChange, error }) => {
    // Memoizar array de estrellas
    const stars = useMemo(() => [1, 2, 3, 4, 5], []);

    // Memoizar función de cambio de rating
    const handleStarClick = useCallback((star: number) => {
        onChange(star);
    }, [onChange]);

    // Memoizar mensaje de error
    const errorMessage = useMemo(() => {
        if (!error || error.length === 0) return null;
        return (
            <p className="text-red-400 text-sm mt-2" role="alert" id="rating-error">
                {error.join(", ")}
            </p>
        );
    }, [error]);

    // Memoizar texto descriptivo del rating
    const ratingText = useMemo(() => {
        const descriptions = {
            0: "Sin calificación",
            1: "Muy malo",
            2: "Malo", 
            3: "Regular",
            4: "Bueno",
            5: "Excelente"
        };
        return descriptions[value as keyof typeof descriptions] || "Sin calificación";
    }, [value]);

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Tu calificación
            </label>
            
            <div className="flex items-center gap-4">
                <div 
                    className="flex space-x-1"
                    role="radiogroup"
                    aria-labelledby="rating-label"
                    aria-describedby={error && error.length > 0 ? "rating-error" : undefined}
                >
                    {stars.map((star) => {
                        const isSelected = value >= star;
                        const StarIcon = isSelected ? Star : StarOff;
                        
                        return (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleStarClick(star)}
                                className="text-yellow-400 hover:text-yellow-300 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded p-1"
                                aria-label={`Calificar con ${star} estrella${star > 1 ? 's' : ''}`}
                                aria-pressed={isSelected}
                                role="radio"
                                aria-checked={isSelected}
                            >
                                <StarIcon
                                    className="w-6 h-6"
                                    fill={isSelected ? "currentColor" : "none"}
                                    aria-hidden="true"
                                />
                            </button>
                        );
                    })}
                </div>
                
                <div className="flex flex-col">
                    <span className="text-sm text-gray-400">
                        {value > 0 ? `${value}/5` : "0/5"}
                    </span>
                    <span className="text-xs text-gray-500">
                        {ratingText}
                    </span>
                </div>
            </div>
            
            {errorMessage}
        </div>
    );
});

RatingInput.displayName = "RatingInput";
