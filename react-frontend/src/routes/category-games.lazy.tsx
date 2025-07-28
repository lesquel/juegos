import { createLazyFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/category-games')({
  component: () => <Outlet />,
})

