import { createLazyFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@modules/auth/components/LoginForm'

export const Route = createLazyFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
