import { createLazyFileRoute } from '@tanstack/react-router'
import { TransferForm } from '@modules/transfers/components/TransferForm'

export const Route = createLazyFileRoute('/transfers/new')({
  component: NewTransferPage,
})

function NewTransferPage() {
  return (
    <main className="h-full flex-grow">
      <TransferForm />
    </main>
  )
}
