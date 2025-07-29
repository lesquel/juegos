import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/play/marketplace/squad-13')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/play/marketplace/squad-13"!</div>
}
