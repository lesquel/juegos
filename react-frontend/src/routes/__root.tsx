import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Navbar } from '@components/Navbar'
import { SaveAuthProvider } from '@modules/auth/providers/SaveAuthProvider'
import { AuthDebugger } from '@modules/auth/components/AuthDebugger'

export const Route = createRootRoute({
  component: () => (
    <>
      <SaveAuthProvider />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
      <AuthDebugger />
      <TanStackRouterDevtools />
    </>
  ),
})
