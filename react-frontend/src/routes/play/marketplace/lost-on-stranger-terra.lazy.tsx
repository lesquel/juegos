import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/play/marketplace/lost-on-stranger-terra',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/play/marketplace/lost-on-stranger-terra"!</div>
}
