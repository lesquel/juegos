import { createFileRoute, Outlet } from '@tanstack/react-router'
import { z } from 'zod'

// Schema para validar los search params
const categoryGamesSearchSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  category_name: z.string().optional(),
  category_description: z.string().optional(),
  status: z.string().optional(),
})

export const Route = createFileRoute('/category-games')({
  validateSearch: categoryGamesSearchSchema,
  component: () => <Outlet />,
})
