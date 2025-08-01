import React, { memo, useMemo, useCallback, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { AuthClientData } from "../services/authClientData";
import { useAuth } from "../middleware/authMiddleware";
import { authRoutesConfig } from "../config/auth.routes.config";
import { FormInput } from "@modules/auth/components/FormInputAuth";
import { LockIcon, Mail, User } from "lucide-react";

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = memo(() => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Si el usuario ya está autenticado, no debería estar aquí
    // TanStack Router manejará la redirección automáticamente
    if (typeof window !== 'undefined' && isAuthenticated()) {
      console.log('Usuario ya autenticado, será redirigido');
    }
  }, [isAuthenticated]);

  return (
    <UseRegisterForm />
  );
});

RegisterForm.displayName = "RegisterForm";

const UseRegisterForm: React.FC = memo(() => {
  const { mutate, error } = AuthClientData.register();

  // Memoizar validadores
  const validators = useMemo(
    () => ({
      onChange: z.object({
        email: z.string().email("Correo electrónico inválido"),
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
    }),
    []
  );

  // Memoizar valores por defecto
  const defaultValues = useMemo(
    (): RegisterFormValues => ({
      email: "",
      password: "",
      confirmPassword: "",
    }),
    []
  );

  // Memoizar función de submit
  const handleSubmit = useCallback(
    async ({ value }: { value: RegisterFormValues }) => {
      mutate({
        email: value.email,
        password: value.password,
      });
    },
    [mutate]
  );

  const form = useForm({
    defaultValues,
    validators,
    onSubmit: handleSubmit,
  });

  // Memoizar URL de login
  const loginUrl = useMemo(() => authRoutesConfig.children.login.url, []);

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

        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 lg:mb-10 xl:mb-12 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Crea tu Cuenta
          </h1>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl xl:text-2xl">Únete a la comunidad y empieza a jugar.</p>
        </div>

        <form onSubmit={onFormSubmit} className="w-full flex flex-col items-center gap-10 sm:gap-12 lg:gap-14 xl:gap-16">
          {errorMessage && (
            <div
              role="alert"
              className="w-full text-red-300 text-sm sm:text-base lg:text-lg text-center bg-red-500/10 backdrop-blur-sm border border-red-400/30 p-6 sm:p-7 lg:p-8 xl:p-10 rounded-2xl"
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

            <FormInput
              form={form}
              name="confirmPassword"
              type="password"
              placeholder="Confirmar Contraseña"
              label="Confirmar Contraseña"
              icon={<LockIcon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-gray-400" />}
            />
          </div>

          <button
            type="submit"
            className="relative w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold py-6 sm:py-7 lg:py-8 xl:py-10 rounded-3xl shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-500 text-base sm:text-lg lg:text-xl xl:text-2xl group overflow-hidden"
            aria-label="Crear cuenta"
          >
            {/* Efecto de brillo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative z-10">Registrarse</span>
          </button>
        </form>

        <footer className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 mt-12 sm:mt-16 lg:mt-20 xl:mt-24 text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to={loginUrl}
            className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold hover:from-cyan-300 hover:to-purple-300 transition-all duration-300"
          >
            Inicia sesión aquí
          </Link>
        </footer>
      </div>
    </main>
  );
});

UseRegisterForm.displayName = "UseRegisterForm";
