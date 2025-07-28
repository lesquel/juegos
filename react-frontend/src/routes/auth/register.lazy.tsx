import { createLazyFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '@modules/auth/components/RegisterForm'

export const Route = createLazyFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-4">
      <RegisterForm />
    </div>
  )
}
