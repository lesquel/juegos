import { createLazyFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@modules/auth/components/LoginForm'
import { useAuthProtection } from '@modules/auth/middleware/authHOC'

export const Route = createLazyFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  // Proteger esta ruta para invitados únicamente
  const { isChecking } = useAuthProtection(false);

  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center">
      <div>Loading...</div>
    </div>;
  }

  return (
      <LoginForm />
  );
}
