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
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <LoginForm />
    </div>
  );
}
