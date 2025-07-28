import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Mock responses
const mockGameResponse = {
  success: true,
  data: {
    game_id: "7caa31e4-f798-41c5-939b-4084b3cea0be",
    game_name: "Aventura Épica",
    game_description: "Un juego increíble lleno de aventuras y desafíos emocionantes.",
    game_img: "https://via.placeholder.com/400x300/6366f1/ffffff?text=Aventura+Épica",
    game_url: "aventura-epica",
    game_type: "offline",
    categories: [
      {
        category_id: "1",
        category_name: "Aventura"
      }
    ]
  }
};

const mockCategoryResponse = {
  success: true,
  data: {
    category_id: "e8a2377e-3682-431b-a428-4cf56e5e9a40",
    category_name: "Categoría de Prueba",
    category_description: "Esta es una categoría de prueba para debugging.",
    category_img: "https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Categoría+Prueba"
  }
};

// API Routes
app.get('/games/:id', (req, res) => {
  const gameId = req.params.id;
  console.log(`📍 GET /games/${gameId}`);
  
  // Simulate some delay
  setTimeout(() => {
    res.json(mockGameResponse);
  }, 500);
});

app.get('/categories/:id', (req, res) => {
  const categoryId = req.params.id;
  console.log(`📍 GET /categories/${categoryId}`);
  
  // Simulate some delay
  setTimeout(() => {
    res.json(mockCategoryResponse);
  }, 500);
});

app.get('/games', (req, res) => {
  console.log('📍 GET /games');
  res.json({
    success: true,
    data: [mockGameResponse.data],
    pagination: { page: 1, size: 10, total: 1 }
  });
});

app.get('/categories', (req, res) => {
  console.log('📍 GET /categories');
  res.json({
    success: true,
    data: [mockCategoryResponse.data],
    pagination: { page: 1, size: 10, total: 1 }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock server is running' });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock server running on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log(`   - GET /games/:id`);
  console.log(`   - GET /categories/:id`);
  console.log(`   - GET /games`);
  console.log(`   - GET /categories`);
  console.log(`   - GET /health`);
  console.log('');
  console.log('🔗 Test URLs:');
  console.log(`   - http://localhost:${PORT}/games/7caa31e4-f798-41c5-939b-4084b3cea0be`);
  console.log(`   - http://localhost:${PORT}/categories/e8a2377e-3682-431b-a428-4cf56e5e9a40`);
});
