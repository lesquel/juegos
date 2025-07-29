import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/play/online/pong')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/play/online/pong"!</div>
}
