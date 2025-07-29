import { createLazyFileRoute } from '@tanstack/react-router'
import { SlotGame } from '../../../all-games/marketplace/maquina-tragamonedas-react/SlotGame'

export const Route = createLazyFileRoute(
  '/play/marketplace/maquina-tragamonedas-react',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gray-900">
      <SlotGame />
    </div>
  )
}
