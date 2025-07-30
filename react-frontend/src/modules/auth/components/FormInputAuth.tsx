import React, { memo, useState, useCallback, useMemo } from "react";
import { EyeClosedIcon, EyeIcon } from "lucide-react";

interface FormInputProps {
  form: any; // Tu tipo de form de TanStack
  name: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  label?: string;
  showLabel?: boolean;
}

export const FormInput: React.FC<FormInputProps> = memo(
  ({
    form,
    name,
    type = "text",
    placeholder,
    icon,
    className = "",
    label,
    showLabel = false,
  }) => {
    const [showPassword, setShowPassword] = useState(false);

    // Memoizar si es campo de contraseña
    const isPasswordField = useMemo(() => type === "password", [type]);

    // Memoizar función para cambiar visibilidad de contraseña
    const togglePasswordVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    // Memoizar tipo de input
    const inputType = useMemo(() => {
      if (isPasswordField) {
        return showPassword ? "text" : "password";
      }
      return type;
    }, [isPasswordField, showPassword, type]);

    // Memoizar clases CSS
    const containerClasses = useMemo(
      () => `mb-6 relative w-full ${className}`,
      [className]
    );

    const inputClasses = useMemo(
      () =>
        `w-full ${icon ? "pl-12" : "pl-4"} ${isPasswordField ? "pr-14" : "pr-4"
        } py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:bg-white/15`,
      [icon, isPasswordField]
    );

    // Memoizar aria-label para el botón de contraseña
    const passwordToggleLabel = useMemo(
      () => (showPassword ? "Ocultar contraseña" : "Mostrar contraseña"),
      [showPassword]
    );

    return (
      <form.Field name={name}>
        {(field: any) => {
          // Simplemente calculamos variables normales
          const errorMessage =
            field.state.meta.errors.length === 0
              ? null
              : field.state.meta.errors
                .map((error: any) => error.message)
                .join(", ");

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            field.handleChange(e.target.value);
          };

          const handleBlur = () => {
            field.handleBlur();
          };

          return (
            <div className={containerClasses}>
              {showLabel && label && (
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2"
                >
                  {label}
                </label>
              )}
              {!showLabel && label && (
                <label htmlFor={field.name} className="sr-only">
                  {label}
                </label>
              )}

              <div className="relative group">
                {icon && (
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <div className="text-gray-400 group-focus-within:text-cyan-400 transition-colors duration-300">
                      {icon}
                    </div>
                  </div>
                )}

                <input
                  id={field.name}
                  type={inputType}
                  name={field.name}
                  value={field.state.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={placeholder}
                  className={inputClasses}
                  aria-describedby={
                    errorMessage ? `${field.name}-error` : undefined
                  }
                />

                {isPasswordField && (
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-cyan-400 transition-colors duration-300 group-focus-within:text-cyan-400"
                    aria-label={passwordToggleLabel}
                  >
                    {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                  </button>
                )}
              </div>

              {errorMessage && (
                <span
                  id={`${field.name}-error`}
                  className="text-red-300 text-sm mt-2 block bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-lg p-2"
                  role="alert"
                >
                  {errorMessage}
                </span>
              )}
            </div>
          );
        }}
      </form.Field>
    );
  }
);

FormInput.displayName = "FormInput";
