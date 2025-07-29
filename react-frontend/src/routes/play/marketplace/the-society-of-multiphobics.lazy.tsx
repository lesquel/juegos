import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/play/marketplace/the-society-of-multiphobics',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/play/marketplace/the-society-of-multiphobics"!</div>
}
