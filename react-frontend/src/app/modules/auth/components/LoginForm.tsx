import React, { memo, useMemo, useCallback, useEffect } from "react";
import { QueryProvider } from "@providers/QueryProvider";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { AuthClientData } from "../services/authClientData";
import { MiddlewareAstroProtectUser } from "../middleware/middlewareAstroProtectUser";
import { authRoutesConfig } from "../config/auth.routes.config";
import { FormInput } from "@modules/auth/components/FormInputAuth";
import { LockIcon, Mail, User } from "lucide-react";

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm: React.FC = memo(() => {
  useEffect(() => {
    // Solo ejecutar en el cliente después del montaje
    MiddlewareAstroProtectUser.isNotLogged();
  }, []);

  return (
    <QueryProvider>
      <UseLoginForm />
    </QueryProvider>
  );
});

LoginForm.displayName = "LoginForm";

const UseLoginForm: React.FC = memo(() => {
  const { mutate, error } = AuthClientData.login();

  // Memoizar validadores
  const validators = useMemo(
    () => ({
      onChange: z.object({
        email: z.string().email("Correo electrónico inválido"),
        password: z.string(),
      }),
      onSubmit: z.object({
        email: z.string().email("Por favor, ingresa un correo válido."),
        password: z.string().min(1, "La contraseña es requerida."),
      }),
    }),
    []
  );

  // Memoizar valores por defecto
  const defaultValues = useMemo(
    (): LoginFormValues => ({
      email: "",
      password: "",
    }),
    []
  );

  // Memoizar función de submit
  const handleSubmit = useCallback(
    async ({ value }: { value: LoginFormValues }) => {
      mutate(value);
    },
    [mutate]
  );

  const form = useForm({
    defaultValues,
    validators,
    onSubmit: handleSubmit,
  });

  // Memoizar iconos
  const userIcon = useMemo(() => <User className="w-12 h-12 text-white" />, []);

  const emailIcon = useMemo(
    () => <Mail className="h-5 w-5 text-gray-400" />,
    []
  );

  const passwordIcon = useMemo(
    () => <LockIcon className="h-5 w-5 text-gray-400" />,
    []
  );

  // Memoizar URL de registro
  const registerUrl = useMemo(() => authRoutesConfig.children.register.url, []);

  // Memoizar mensaje de error
  const errorMessage = useMemo(() => {
    if (!error) return null;
    return error.errors.map((error) => error).join(", ");
  }, [error]);

  // Memoizar función de envío del formulario
  const onFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      void form.handleSubmit();
    },
    [form]
  );

  return (
    <main className="w-full max-w-md mx-auto bg-gray-900 bg-opacity-50 rounded-2xl p-8 shadow-lg backdrop-blur-lg backdrop-filter border border-gray-700">
      <header className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
          {userIcon}
        </div>
      </header>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Bienvenido de Nuevo
        </h1>
        <p className="text-gray-400">Inicia sesión para continuar</p>
      </div>

      <form
        onSubmit={onFormSubmit}
        className="w-full flex flex-col items-center gap-2"
      >
        {errorMessage && (
          <div
            role="alert"
            className="text-red-400 text-sm mb-4 text-center bg-red-900 bg-opacity-50 p-3 rounded-lg w-full"
          >
            {errorMessage}
          </div>
        )}

        <FormInput
          form={form}
          name="email"
          type="email"
          placeholder="Correo Electrónico"
          label="Correo Electrónico"
          icon={emailIcon}
        />

        <FormInput
          form={form}
          name="password"
          type="password"
          placeholder="Contraseña"
          label="Contraseña"
          icon={passwordIcon}
        />

        <button
          type="submit"
          className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out text-lg"
          aria-label="Iniciar sesión"
        >
          Acceder
        </button>
      </form>

      <footer className="text-sm text-gray-400 mt-6 text-center">
        ¿No tienes una cuenta?{" "}
        <a
          href={registerUrl}
          className="text-purple-400 hover:text-purple-300 font-semibold"
        >
          Regístrate aquí
        </a>
      </footer>
    </main>
  );
});

UseLoginForm.displayName = "UseLoginForm";
