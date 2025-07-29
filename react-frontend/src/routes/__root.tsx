import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Navbar } from '@components/Navbar'
import { SaveAuthProvider } from '@modules/auth/providers/SaveAuthProvider'
import { AuthDebugger } from '@modules/auth/components/AuthDebugger'
import "../styles/global.css"

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
        <Link 
          to="/"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

function RootErrorComponent({ error }: { readonly error: Error }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white max-w-2xl p-8">
        <h1 className="text-4xl font-bold mb-4 text-red-400">⚠️ Application Error</h1>
        <p className="text-gray-400 mb-6">Something went wrong with the application.</p>
        <div className="bg-red-900 bg-opacity-50 p-4 rounded-lg mb-6">
          <pre className="text-red-200 text-sm text-left overflow-auto">
            {error.message}
          </pre>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
          <Link 
            to="/"
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  component: () => (
    <>
      <SaveAuthProvider />
      <div className="min-h-screen bg-gray-800">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
})
