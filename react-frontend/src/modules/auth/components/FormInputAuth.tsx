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
      () => `mb-8 sm:mb-10 lg:mb-12 xl:mb-14 relative w-full ${className}`,
      [className]
    );

    const inputClasses = useMemo(
      () =>
        `w-full ${icon ? "pl-14 sm:pl-16 lg:pl-18 xl:pl-20" : "pl-6 sm:pl-7 lg:pl-8 xl:pl-10"} ${isPasswordField ? "pr-16 sm:pr-18 lg:pr-20 xl:pr-22" : "pr-6 sm:pr-7 lg:pr-8 xl:pr-10"
        } py-6 sm:py-7 lg:py-8 xl:py-10 rounded-2xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:bg-white/15 text-lg sm:text-xl lg:text-2xl xl:text-3xl`,
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
                  className="block text-lg sm:text-xl lg:text-2xl xl:text-3xl font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 sm:mb-5 lg:mb-6 xl:mb-7"
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
                  <div className="absolute inset-y-0 left-0 pl-6 sm:pl-7 lg:pl-8 xl:pl-10 flex items-center pointer-events-none">
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
                    className="absolute inset-y-0 right-0 pr-6 sm:pr-7 lg:pr-8 xl:pr-10 flex items-center text-gray-400 hover:text-cyan-400 transition-colors duration-300 group-focus-within:text-cyan-400 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl"
                    aria-label={passwordToggleLabel}
                  >
                    {showPassword ? <EyeIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10" /> : <EyeClosedIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />}
                  </button>
                )}
              </div>

              {errorMessage && (
                <span
                  id={`${field.name}-error`}
                  className="text-red-300 text-lg sm:text-xl lg:text-2xl xl:text-3xl mt-4 sm:mt-5 lg:mt-6 xl:mt-7 block bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-2xl p-4 sm:p-5 lg:p-6 xl:p-7"
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
