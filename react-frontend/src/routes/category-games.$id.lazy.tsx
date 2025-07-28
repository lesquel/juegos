import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/category-games/$id')({
  component: CategoryGameDetailsPage,
})

function CategoryGameDetailsPage() {
  const { id } = Route.useParams()
  
  console.log('🏷️ CategoryGameDetailsPage loaded with ID:', id);
  console.log('🏷️ PÁGINA CATEGORY CARGANDO - SI VES ESTO, EL ROUTING FUNCIONA');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1f2937', 
      color: 'white', 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        🏷️ CATEGORY PAGE WORKS!
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Category ID: {id}
      </p>
      <p style={{ color: '#8b5cf6' }}>
        ✅ Esta página está cargando correctamente
      </p>
      <p style={{ color: '#f59e0b', marginTop: '1rem' }}>
        Si ves esto, el problema no es el routing
      </p>
    </div>
  )
}
