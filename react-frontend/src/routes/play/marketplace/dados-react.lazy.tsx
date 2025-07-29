import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/play/marketplace/dados-react')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/play/marketplace/dados-react"!</div>
}
