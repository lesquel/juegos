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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
