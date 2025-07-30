import React, { memo, useMemo, useCallback, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { AuthClientData } from "../services/authClientData";
import { useAuth } from "../middleware/authMiddleware";
import { authRoutesConfig } from "../config/auth.routes.config";
import { FormInput } from "@modules/auth/components/FormInputAuth";
import { LockIcon, Mail, User } from "lucide-react";


interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm: React.FC = memo(() => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Si el usuario ya está autenticado, no debería estar aquí
    if (typeof window !== 'undefined' && isAuthenticated()) {
      console.log('Usuario ya autenticado, será redirigido');
    }
  }, [isAuthenticated]);

  return (
      <UseLoginForm />
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
    <main className="relative w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 sm:p-16 lg:p-20 xl:p-24 shadow-2xl">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>
      
      <div className="relative">
        <header className="flex justify-center mb-12 sm:mb-16 lg:mb-20">
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl p-2">
            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <User className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-white" />
            </div>
          </div>
        </header>

        <div className="text-center mb-12 sm:mb-14 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Bienvenido de Nuevo
          </h1>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl">Inicia sesión para continuar</p>
        </div>

        <form
          onSubmit={onFormSubmit}
          className="w-full flex flex-col items-center gap-10 sm:gap-12 lg:gap-14 xl:gap-16"
        >
          {errorMessage && (
            <div
              role="alert"
              className="w-full text-red-300 text-lg sm:text-xl lg:text-2xl text-center bg-red-500/10 backdrop-blur-sm border border-red-400/30 p-6 sm:p-7 lg:p-8 xl:p-10 rounded-2xl"
            >
              {errorMessage}
            </div>
          )}

          <div className="w-full space-y-8 sm:space-y-10 lg:space-y-12 xl:space-y-14">
            <FormInput
              form={form}
              name="email"
              type="email"
              placeholder="Correo Electrónico"
              label="Correo Electrónico"
              icon={<Mail className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-gray-400" />}
            />

            <FormInput
              form={form}
              name="password"
              type="password"
              placeholder="Contraseña"
              label="Contraseña"
              icon={<LockIcon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-gray-400" />}
            />
          </div>

          <button
            type="submit"
            className="relative w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold py-4 sm:py-5 lg:py-6 rounded-3xl shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-500 text-base sm:text-lg lg:text-xl group overflow-hidden"
            aria-label="Iniciar sesión"
          >
            {/* Efecto de brillo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative z-10">Acceder</span>
          </button>
        </form>

        <footer className="text-sm sm:text-base lg:text-lg text-gray-300 mt-8 sm:mt-10 lg:mt-12 text-center">
          ¿No tienes una cuenta?{" "}
          <Link
            to={registerUrl}
            className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold hover:from-cyan-300 hover:to-purple-300 transition-all duration-300"
          >
            Regístrate aquí
          </Link>
        </footer>
      </div>
    </main>
  );
});

UseLoginForm.displayName = "UseLoginForm";
