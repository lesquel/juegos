import { QueryProvider } from "@providers/QueryProvider";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { AuthClientData } from "../services/authClientData";
import { MiddlewareAstroProtectUser } from "../middleware/middlewareAstroProtectUser";

export const RegisterForm = () => {
  MiddlewareAstroProtectUser.isLogged();
  return (
    <QueryProvider>
      <UseRegisterForm />
    </QueryProvider>
  );
};

const UseRegisterForm = () => {
  const { mutate } = AuthClientData.register();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="email"
        children={(field) => (
          <div>
            <h1>Register</h1>
            <label>Email</label>
            <input
              type="email"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Email"
            />
            {field.state.meta.errors.length > 0 && (
              <span>
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
          <div>
            <label>Password</label>
            <input
              type="password"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Password"
            />
            {field.state.meta.errors.length > 0 && (
              <span>
                {field.state.meta.errors
                  .map((error) => error?.message)
                  .join(", ")}
              </span>
            )}
          </div>
        )}
      />

      <button type="submit">Login</button>
    </form>
  );
};
