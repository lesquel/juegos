import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: () => (
    <div className="w-full flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  ),
})
