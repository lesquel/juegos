import { createLazyFileRoute } from '@tanstack/react-router'
import { ListTransfer } from '@modules/transfers/components/ListTransfer'
import { MeComponent } from '@modules/user/components/MeComponent'
import { useAuthProtection } from '@modules/auth/middleware/authHOC'

export const Route = createLazyFileRoute('/user/me')({
  component: UserMePage,
})

function UserMePage() {
  // Proteger esta ruta para usuarios autenticados únicamente
  const { isChecking } = useAuthProtection(true);

  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center">
      <div>Loading...</div>
    </div>;
  }

  return (
    <div className='w-full flex justify-center items-center flex-col gap-6'>

      <MeComponent />
      <ListTransfer />
    </div>
  );
}
