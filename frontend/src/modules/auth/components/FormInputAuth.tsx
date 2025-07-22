import React from "react";

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
            type={type}
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            placeholder={placeholder}
            className={`w-full ${
              icon ? "pl-10" : "pl-4"
            } pr-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200`}
          />

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
