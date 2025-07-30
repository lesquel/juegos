import { createLazyFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '@modules/auth/components/RegisterForm'
import { useAuthProtection } from '@modules/auth/middleware/authHOC'

export const Route = createLazyFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
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
      <RegisterForm />
    </div>
  );
}
