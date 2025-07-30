import { createFileRoute, Outlet } from '@tanstack/react-router'
import { z } from 'zod'

// Schema para validar los search params de juegos
const gamesSearchSchema = z.object({
  tab: z.enum(['offline', 'online', 'luck']).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  game_name: z.string().optional(),
  game_description: z.string().optional(),
  category_name: z.string().optional(),
})

export const Route = createFileRoute('/games')({
  validateSearch: gamesSearchSchema,
  component: () => <Outlet />,
})
