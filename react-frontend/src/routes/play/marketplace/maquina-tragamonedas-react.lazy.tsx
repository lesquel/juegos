import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/play/marketplace/maquina-tragamonedas-react',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/play/marketplace/maquina-tragamonedas-react"!</div>
}
