import React, { memo, useState, useCallback, useMemo } from "react";
import { EyeClosedIcon, EyeIcon } from "lucide-react";

interface FormInputProps {
  form: any;
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

    const isPasswordField = useMemo(() => type === "password", [type]);

    const togglePasswordVisibility = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    const inputType = useMemo(() => {
      if (isPasswordField) return showPassword ? "text" : "password";
      return type;
    }, [isPasswordField, showPassword, type]);

    const containerClasses = useMemo(
      () => `w-full mb-6 ${className}`,
      [className]
    );

    const inputClasses = useMemo(
      () =>
        `w-full py-3 pl-${icon ? "12" : "4"} pr-${isPasswordField ? "12" : "4"} 
         text-base sm:text-lg lg:text-xl rounded-xl border 
         bg-white/10 backdrop-blur-md text-white placeholder-gray-300 
         border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 
         focus:border-cyan-400/50 transition duration-200 hover:bg-white/20`,
      [icon, isPasswordField]
    );

    const passwordToggleLabel = useMemo(
      () => (showPassword ? "Ocultar contraseña" : "Mostrar contraseña"),
      [showPassword]
    );

    return (
      <form.Field name={name}>
        {(field: any) => {
          const errorMessage =
            field.state.meta.errors.length === 0
              ? null
              : field.state.meta.errors.map((e: any) => e.message).join(", ");

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            field.handleChange(e.target.value);
          };

          const handleBlur = () => {
            field.handleBlur();
          };

          return (
            <div className={containerClasses}>
              {label && (
                <label
                  htmlFor={field.name}
                  className={`block font-semibold mb-2 text-white ${
                    showLabel ? "text-base sm:text-lg lg:text-xl" : "sr-only"
                  }`}
                >
                  {label}
                </label>
              )}

              <div className="relative">
                {icon && (
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    {icon}
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
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-cyan-400 transition"
                    aria-label={passwordToggleLabel}
                  >
                    {showPassword ? (
                      <EyeIcon className="w-5 h-5" />
                    ) : (
                      <EyeClosedIcon className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>

              {errorMessage && (
                <p
                  id={`${field.name}-error`}
                  className="mt-2 text-sm text-red-300 bg-red-500/10 border border-red-500/30 p-2 rounded-lg"
                  role="alert"
                >
                  {errorMessage}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>
    );
  }
);

FormInput.displayName = "FormInput";
