import { QueryProvider } from "@providers/QueryProvider";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { AuthClientData } from "../services/authClientData";
import { MiddlewareAstroProtectUser } from "../middleware/middlewareAstroProtectUser";
import { authRoutesConfig } from "../config/auth.routes.config";
import { FormInput } from "@modules/auth/components/FormInputAuth";

export const LoginForm = () => {
  MiddlewareAstroProtectUser.isLogged();
  return (
    <QueryProvider>
      <UseLoginForm />
    </QueryProvider>
  );
};

const UseLoginForm = () => {
  const { mutate, error } = AuthClientData.login();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        email: z.string().email("Correo electrónico inválido"),
        password: z.string(),
      }),
      onSubmit: z.object({
        email: z.string().email("Por favor, ingresa un correo válido."),
        password: z.string().min(1, "La contraseña es requerida."),
      }),
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 bg-opacity-50 rounded-2xl p-8 shadow-lg backdrop-blur-lg backdrop-filter border border-gray-700">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-center text-white">
        Bienvenido de Nuevo
      </h1>
      <p className="text-gray-400 mb-8 text-center">
        Inicia sesión para continuar
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="w-full flex flex-col items-center gap-2"
      >
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center bg-red-900 bg-opacity-50 p-3 rounded-lg">
            {error.errors.map((error) => error).join(", ")}
          </p>
        )}
        <FormInput
          form={form}
          name="email"
          type="email"
          placeholder="Correo Electrónico"
          label="Correo Electrónico"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          }
        />
        <FormInput
          form={form}
          name="password"
          type="password"
          placeholder="Contraseña"
          label="Contraseña"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out text-lg"
        >
          Acceder
        </button>
      </form>
      <p className="text-sm text-gray-400 mt-6 text-center">
        ¿No tienes una cuenta?{" "}
        <a
          href={authRoutesConfig.children.register.url}
          className="text-purple-400 hover:text-purple-300 font-semibold"
        >
          Regístrate aquí
        </a>
      </p>
    </div>
  );
};
