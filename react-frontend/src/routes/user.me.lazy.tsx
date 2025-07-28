import { createLazyFileRoute } from '@tanstack/react-router'
import { ListTransfer } from '@modules/transfers/components/ListTransfer'
import { MeComponent } from '@modules/user/components/MeComponent'

export const Route = createLazyFileRoute('/user/me')({
  component: UserMePage,
})

function UserMePage() {
  return (
    <>
      <MeComponent />
      <ListTransfer />
    </>
  )
}
