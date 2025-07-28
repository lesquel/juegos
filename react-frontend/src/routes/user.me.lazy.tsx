import { createLazyFileRoute } from '@tanstack/react-router'
import { ListTransfer } from '@modules/transfers/components/ListTransfer'
import { MeComponent } from '@modules/user/components/MeComponent'
import { useAuthProtection } from '@modules/auth/middleware/authHOC'

export const Route = createLazyFileRoute('/user/me')({
  component: UserMePage,
})

function UserMePage() {
  // Proteger esta ruta para usuarios autenticados únicamente
  useAuthProtection(true)

  return (
    <>
      <MeComponent />
      <ListTransfer />
    </>
  )
}
