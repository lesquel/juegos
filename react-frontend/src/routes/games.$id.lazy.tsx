import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/games/$id')({
  component: GameDetailsPage,
})

function GameDetailsPage() {
  const { id } = Route.useParams()
  
  console.log('🎮 GameDetailsPage loaded with ID:', id);
  console.log('🎮 PÁGINA CARGANDO - SI VES ESTO, EL ROUTING FUNCIONA');
  
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
        🎮 GAME PAGE WORKS!
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Game ID: {id}
      </p>
      <p style={{ color: '#10b981' }}>
        ✅ Esta página está cargando correctamente
      </p>
      <p style={{ color: '#f59e0b', marginTop: '1rem' }}>
        Si ves esto, el problema no es el routing
      </p>
    </div>
  )
}
