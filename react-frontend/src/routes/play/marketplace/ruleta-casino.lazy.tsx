import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/play/marketplace/ruleta-casino')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/play/marketplace/ruleta-casino"!</div>
}
