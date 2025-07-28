// Mock server simple para probar las páginas
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Mock data responses
const mockGameResponse = {
  success: true,
  data: {
    game_id: "7caa31e4-f798-41c5-939b-4084b3cea0be",
    game_name: "Test Game",
    game_description: "This is a test game for debugging",
    game_img: "https://via.placeholder.com/400x300?text=Test+Game",
    game_url: "test-game",
    game_type: "offline",
    categories: [
      {
        category_id: "1",
        category_name: "Adventure"
      }
    ]
  }
};

const mockCategoryResponse = {
  success: true,
  data: {
    category_id: "e8a2377e-3682-431b-a428-4cf56e5e9a40",
    category_name: "Test Category", 
    category_description: "This is a test category for debugging",
    category_img: "https://via.placeholder.com/400x300?text=Test+Category",
    games: [
      {
        game_id: "1",
        game_name: "Sample Game",
        game_img: "https://via.placeholder.com/200x150?text=Game"
      }
    ]
  }
};

// Routes
app.get('/games/:id', (req, res) => {
  console.log(`📍 GET /games/${req.params.id}`);
  res.json(mockGameResponse);
});

app.get('/categories/:id', (req, res) => {
  console.log(`📍 GET /categories/${req.params.id}`);
  res.json(mockCategoryResponse);
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

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🚀 Mock server running on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('   - GET /games/:id');
  console.log('   - GET /categories/:id');
  console.log('   - GET /games');
  console.log('   - GET /categories');
});
