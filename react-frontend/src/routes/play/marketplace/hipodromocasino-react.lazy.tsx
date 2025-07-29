import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/play/marketplace/hipodromocasino-react',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/play/marketplace/hipodromocasino-react"!</div>
}
