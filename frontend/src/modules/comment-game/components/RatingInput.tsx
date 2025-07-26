import { Star, StarOff } from "lucide-react";

interface RatingInputProps {
    value: number;
    onChange: (value: number) => void;
    error?: string[];
}

export const RatingInput = ({ value, onChange, error }: RatingInputProps) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">
            Tu calificación
        </label>
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const isSelected = value >= star;
                const StarIcon = isSelected ? Star : StarOff;
                return (
                    <button
                        type="button"
                        key={star}
                        onClick={() => onChange(star)}
                        className="text-yellow-400 hover:scale-110 transition"
                    >
                        <StarIcon
                            className="w-6 h-6"
                            fill={isSelected ? "currentColor" : "none"}
                        />
                    </button>
                );
            })}
        </div>
        {error && error.length > 0 && (
            <p className="text-red-500 text-sm mt-1">{error.join(", ")}</p>
        )}
    </div>
);
