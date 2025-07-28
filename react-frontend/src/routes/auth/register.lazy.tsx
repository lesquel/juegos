import { createLazyFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '@modules/auth/components/RegisterForm'
import { useAuthProtection } from '@modules/auth/middleware/authHOC'

export const Route = createLazyFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  // Proteger esta ruta para invitados únicamente
  useAuthProtection(false)

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-4">
      <RegisterForm />
    </div>
  )
}
