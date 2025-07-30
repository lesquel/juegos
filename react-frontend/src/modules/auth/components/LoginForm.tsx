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
    <main className="relative w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>
      
      <div className="relative">
        <header className="flex justify-center mb-8">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl p-1">
            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              {userIcon}
            </div>
          </div>
        </header>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Bienvenido de Nuevo
          </h1>
          <p className="text-gray-300 text-lg">Inicia sesión para continuar</p>
        </div>

        <form
          onSubmit={onFormSubmit}
          className="w-full flex flex-col items-center gap-6"
        >
          {errorMessage && (
            <div
              role="alert"
              className="w-full text-red-300 text-sm text-center bg-red-500/10 backdrop-blur-sm border border-red-400/30 p-4 rounded-xl"
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
            className="relative w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-500 text-lg group overflow-hidden"
            aria-label="Iniciar sesión"
          >
            {/* Efecto de brillo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative z-10">Acceder</span>
          </button>
        </form>

        <footer className="text-sm text-gray-300 mt-8 text-center">
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
