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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <RegisterForm />
    </div>
  );
}
