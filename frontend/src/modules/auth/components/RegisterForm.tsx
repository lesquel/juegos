import React, { memo, useMemo, useCallback } from "react";
import { QueryProvider } from "@providers/QueryProvider";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { AuthClientData } from "../services/authClientData";
import { MiddlewareAstroProtectUser } from "../middleware/middlewareAstroProtectUser";
import { authRoutesConfig } from "../config/auth.routes.config";
import { FormInput } from "@modules/auth/components/FormInputAuth";

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = memo(() => {
  MiddlewareAstroProtectUser.isLogged();
  return (
    <QueryProvider>
      <UseRegisterForm />
    </QueryProvider>
  );
});

RegisterForm.displayName = "RegisterForm";

const UseRegisterForm: React.FC = memo(() => {
  const { mutate, error } = AuthClientData.register();

  // Memoizar validadores
  const validators = useMemo(() => ({
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
  }), []);

  // Memoizar valores por defecto
  const defaultValues = useMemo((): RegisterFormValues => ({
    email: "",
    password: "",
    confirmPassword: "",
  }), []);

  // Memoizar función de submit
  const handleSubmit = useCallback(async ({ value }: { value: RegisterFormValues }) => {
    mutate({
      email: value.email,
      password: value.password,
    });
  }, [mutate]);

  const form = useForm({
    defaultValues,
    validators,
    onSubmit: handleSubmit,
  });

  // Memoizar iconos SVG
  const userIcon = useMemo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    </svg>
  ), []);

  const emailIcon = useMemo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
      />
    </svg>
  ), []);

  const passwordIcon = useMemo(() => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  ), []);

  // Memoizar URL de login
  const loginUrl = useMemo(() => authRoutesConfig.children.login.url, []);

  // Memoizar mensaje de error
  const errorMessage = useMemo(() => {
    if (!error) return null;
    return error.errors.map((error) => error).join(", ");
  }, [error]);

  // Memoizar función de envío del formulario
  const onFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  }, [form]);

  return (
    <main className="w-full max-w-md mx-auto bg-gray-900 bg-opacity-50 rounded-2xl p-8 shadow-lg backdrop-blur-lg backdrop-filter border border-gray-700">
      <header className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 flex items-center justify-center">
          {userIcon}
        </div>
      </header>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Crea tu Cuenta
        </h1>
        <p className="text-gray-400">
          Únete a la comunidad y empieza a jugar.
        </p>
      </div>

      <form
        onSubmit={onFormSubmit}
        className="w-full"
      >
        {errorMessage && (
          <div 
            role="alert"
            className="text-red-400 text-sm mb-4 text-center bg-red-900 bg-opacity-50 p-3 rounded-lg"
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

        <FormInput
          form={form}
          name="confirmPassword"
          type="password"
          placeholder="Confirmar Contraseña"
          label="Confirmar Contraseña"
          className="mb-6"
          icon={passwordIcon}
        />

        <button
          type="submit"
          className="w-full cursor-pointer bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold py-3 rounded-lg shadow-lg hover:from-teal-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 ease-in-out text-lg"
          aria-label="Crear cuenta"
        >
          Registrarse
        </button>
      </form>
      
      <footer className="text-sm text-gray-400 mt-6 text-center">
        ¿Ya tienes una cuenta?{" "}
        <a
          href={loginUrl}
          className="text-teal-400 hover:text-teal-300 font-semibold"
        >
          Inicia sesión aquí
        </a>
      </footer>
    </main>
  );
});

UseRegisterForm.displayName = "UseRegisterForm";
