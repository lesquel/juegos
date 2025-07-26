import React, { memo, useMemo, useCallback } from "react";
import { QueryProvider } from "@providers/QueryProvider";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { AuthClientData } from "../services/authClientData";
import { MiddlewareAstroProtectUser } from "../middleware/middlewareAstroProtectUser";
import { authRoutesConfig } from "../config/auth.routes.config";
import { FormInput } from "@modules/auth/components/FormInputAuth";
import { LockIcon, Mail, User } from "lucide-react";

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
    <User className="w-12 h-12 text-white" />
  ), []);

  const emailIcon = useMemo(() => (
    <Mail className="h-5 w-5 text-gray-400" />
  ), []);

  const passwordIcon = useMemo(() => (
    <LockIcon className="h-5 w-5 text-gray-400" />
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
