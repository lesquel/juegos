import React, { useState } from "react";

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

export const FormInput = ({
  form,
  name,
  type = "text",
  placeholder,
  icon,
  className = "",
  label,
  showLabel = false,
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = isPasswordField ? (showPassword ? "text" : "password") : type;

  return (
    <form.Field
      name={name}
      children={(field: any) => (
        <div className={`mb-4 relative w-full ${className}`}>
          {showLabel && label && (
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {label}
            </label>
          )}
          {!showLabel && label && (
            <label htmlFor={field.name} className="sr-only">
              {label}
            </label>
          )}

          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}

          <input
            id={field.name}
            type={inputType}
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            placeholder={placeholder}
            className={`w-full ${
              icon ? "pl-10" : "pl-4"
            } ${
              isPasswordField ? "pr-12" : "pr-4"
            } py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200`}
          />

          {isPasswordField && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}

          {field.state.meta.errors.length > 0 && (
            <span className="text-red-400 text-xs mt-1 block absolute">
              {field.state.meta.errors.join(", ")}
            </span>
          )}
        </div>
      )}
    />
  );
};
