import { createLazyFileRoute } from '@tanstack/react-router'
import { SingleTransfer } from '@modules/transfers/components/SingleTransfer'

export const Route = createLazyFileRoute('/transfers/$id')({
  component: TransferDetailsPage,
})

function TransferDetailsPage() {
  const { id } = Route.useParams()
  
  return (
    <main className="h-full flex-grow">
      <SingleTransfer id={id} />
    </main>
  )
}
