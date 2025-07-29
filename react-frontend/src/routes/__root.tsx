import { createRootRoute, } from '@tanstack/react-router'
import "../styles/global.css"
import { NotFoundComponent } from '@/components/NotFoundComponent'
import { RootErrorComponent } from '@/components/ErrorComponent'
import { RootLayoutComponent } from '@/components/RootLayoutComponent'







export const Route = createRootRoute({
  component: RootLayoutComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: RootErrorComponent,
})
