import { QueryProvider } from "@providers/QueryProvider";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { AuthClientData } from "../services/authClientData";
import { MiddlewareAstroProtectUser } from "../middleware/middlewareAstroProtectUser";
import { authRoutesConfig } from "../config/auth.routes.config";

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
      confirmPassword: "", // aca falto uno para confirmar la contraseña
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
          password: z.string(), // .min(VALIDADOR, "La contraseña debe de tener blah blah blah para que sirva")
          confirmPassword: z.string().min(1, "Confirma tu contraseña."), /// minimo un caracter en el de confirmar la contraseña
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Las contraseñas no coinciden",
          path: ["confirmPassword"], // Campo al que se asocia el error
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
    <div className="w-full px-4 max-w-sm sm:max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ¡Regístrate!
      </h1>

      <div className="relative w-36 h-36 rounded-full bg-green-500 flex items-center justify-center overflow-hidden mb-8 mx-auto">
        <img
          src="/placeholder-avatar-welder.png"
          alt="Avatar ese tambien que estaba en figma"
          className="w-full h-full object-cover"
        />
      </div>

      <p className="text-sm text-gray-500 mb-6 border-b border-gray-300 pb-1 text-center">
        ¿Ya tienes una cuenta?{" "}
        <a
          href={authRoutesConfig.children.login.url}
          className="text-blue-600 hover:underline"
        >
          Inicia sesión
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
                className="block text-base font-medium text-gray-800 mb-3"
              >
                Correo electrónico
              </label>
              <input
                id={field.name}
                type="email"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Ingresa tu correo electrónico"
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-sm"
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
                className="block text-base font-medium text-gray-800 mb-3"
              >
                Ingresa tu nueva contraseña
              </label>
              <input
                id={field.name}
                type="password"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-sm"
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
          name="confirmPassword"
          children={(field) => (
            <div className="mb-6">
              <label
                htmlFor={field.name}
                className="block text-base font-medium text-gray-800 mb-3"
              >
                Confirma tu contraseña
              </label>
              <input
                id={field.name}
                type="password"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Confirma tu contraseña"
                className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-sm"
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

        <button
          type="submit"
          className="w-full bg-gray-800 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition duration-300 ease-in-out text-base cursor-pointer"
        >
          Regístrate!
        </button>
      </form>
    </div>
  );
};
