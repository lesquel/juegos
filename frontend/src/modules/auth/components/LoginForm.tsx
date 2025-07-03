import { QueryProvider } from "@providers/QueryProvider";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { AuthClientData } from "../services/authClientData";
import { MiddlewareAstroProtectUser } from "../middleware/middlewareAstroProtectUser";
import { authRoutesConfig } from "../config/auth.routes.config";

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

  console.log(error);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        email: z.string().email("Correo electrónico inválido"),
        password: z.string(), // .min(VALIDADOR, "La contraseña debe de tener blah blah blah para que sirva")
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
    <div className="w-full max-w-sm sm:max-w-md mx-auto">
      <h1 className="text-3xl   font-bold mb-6 mt-4 text-center">
        Bienvenido/a de nuevo
      </h1>

      <div className="relative w-36 h-36 rounded-full bg-red-500 flex items-center justify-center overflow-hidden mb-8 mx-auto">
        <img
          src="/placeholder-avatar.png"
          alt="Avatar ese de figma"
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4 text-center">
        Inicia tu Sesión
      </h2>

      <p className="text-sm text-gray-500 mb-6 border-b border-gray-300 pb-1 text-center">
        ¿Aun no tienes una?{" "}
        <a
          href={authRoutesConfig.children.register.url}
          className="text-blue-600 hover:underline"
        >
          Creala!
        </a>
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
          <p className="text-red-500 text-sm mt-2 block">
            {error.errors.map((error) => error).join(", ")}
          </p>
        )}
        <form.Field
          name="email"
          children={(field) => (
            <div className="mb-6">
              <label
                htmlFor={field.name}
                className="block text-lg font-medium text-gray-800 mb-3"
              >
                ¿Cual es tu usuario?
              </label>
              <input
                id={field.name}
                type="email"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Ingresa tu correo electrónico"
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base"
              />
              {field.state.meta.errors.length > 0 && (
                <span className="text-red-500 text-sm mt-2 block">
                  {field.state.meta.errors
                    .map((error) => error?.message)
                    .join(", ")}
                </span>
              )}
            </div>
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <div className="mb-6">
              <label
                htmlFor={field.name}
                className="block text-lg font-medium text-gray-800 mb-3"
              >
                ¿Cual es tu contraseña?
              </label>
              <input
                id={field.name}
                type="password"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-base"
              />
              {field.state.meta.errors.length > 0 && (
                <span className="text-red-500 text-sm mt-2 block">
                  {field.state.meta.errors
                    .map((error) => error?.message)
                    .join(", ")}
                </span>
              )}
            </div>
          )}
        />

        {/* En caso que quieran poner lo de olvidaste la motherfucking password, aunque no creo porque como es que dice Bryan "keep it simple" */}

        {/* <p className="text-sm text-gray-500 mb-8 border-b border-gray-300 pb-1 text-center">
          <a href="#" className="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </p> */}

        <button
          type="submit"
          className="w-full bg-gray-800 text-white font-semibold py-3 lg:py-4 rounded-xl shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition duration-300 ease-in-out text-base lg:text-xl cursor-pointer"
        >
          Accede!
        </button>
      </form>
    </div>
  );
};
