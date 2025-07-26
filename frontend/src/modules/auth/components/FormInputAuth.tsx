import { EyeClosedIcon, EyeIcon } from "lucide-react";
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

  let inputType: string;
  if (isPasswordField) {
    inputType = showPassword ? "text" : "password";
  } else {
    inputType = type;
  }

  return (
    <form.Field name={name}>
      {(field: any) => (
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
            className={`w-full ${icon ? "pl-10" : "pl-4"} ${
              isPasswordField ? "pr-12" : "pr-4"
            } py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200`}
          />

          {isPasswordField && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
            </button>
          )}

          {field.state.meta.errors.length > 0 && (
            <span className="text-red-400 text-xs mt-1 block absolute">
              {field.state.meta.errors.map((error: any) => error.message).join(", ")}
            </span>
          )}
        </div>
      )}
    </form.Field>
  );
};
