import { QueryProvider } from "@providers/QueryProvider";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { AuthClientData } from "../services/authClientData";
import { MiddlewareAstroProtectUser } from "../middleware/middlewareAstroProtectUser";
import { authRoutesConfig } from "../config/auth.routes.config";
import { FormInput } from "@modules/auth/components/FormInputAuth";

export const RegisterForm = () => {
  MiddlewareAstroProtectUser.isLogged();
  return (
    <QueryProvider>
      <UseRegisterForm />
    </QueryProvider>
  );
};

const UseRegisterForm = () => {
  const { mutate, error } = AuthClientData.register();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: z.object({
        email: z.string().email(),
        password: z.string(),
        confirmPassword: z.string(),
      }),
      onSubmit: z
        .object({
          email: z.string().email("Por favor, ingresa un correo válido."),
          password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres."),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Las contraseñas no coinciden",
          path: ["confirmPassword"],
        }),
    },
    onSubmit: async ({ value }) => {
      mutate({
        email: value.email,
        password: value.password,
      });
    },
  });

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 bg-opacity-50 rounded-2xl p-8 shadow-lg backdrop-blur-lg backdrop-filter border border-gray-700">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 flex items-center justify-center">
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-center text-white">
        Crea tu Cuenta
      </h1>
      <p className="text-gray-400 mb-8 text-center">
        Únete a la comunidad y empieza a jugar.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="w-full"
      >
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center bg-red-900 bg-opacity-50 p-3 rounded-lg">
            {error.errors.map((error) => error).join(", ")}
          </p>
        )}

        {/* Input de Email usando el componente compartido */}
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

        {/* Input de Password usando el componente compartido */}
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

        {/* Input de Confirmar Password usando el componente compartido */}
        <FormInput
          form={form}
          name="confirmPassword"
          type="password"
          placeholder="Confirmar Contraseña"
          label="Confirmar Contraseña"
          className="mb-6"
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
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold py-3 rounded-lg shadow-lg hover:from-teal-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 ease-in-out text-lg"
        >
          Registrarse
        </button>
      </form>
      <p className="text-sm text-gray-400 mt-6 text-center">
        ¿Ya tienes una cuenta?{" "}
        <a
          href={authRoutesConfig.children.login.url}
          className="text-teal-400 hover:text-teal-300 font-semibold"
        >
          Inicia sesión aquí
        </a>
      </p>
    </div>
  );
};
