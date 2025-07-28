const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock data for games
const mockGame = {
  game_id: "1",
  game_name: "Test Game",
  game_description: "This is a test game",
  game_img: "https://via.placeholder.com/300",
  game_url: "test-game",
  game_type: "offline",
  categories: [
    {
      category_id: "1",
      category_name: "Test Category"
    }
  ]
};

const mockCategory = {
  category_id: "1",
  category_name: "Test Category",
  category_description: "This is a test category",
  category_img: "https://via.placeholder.com/300",
  games: [mockGame]
};

// Mock endpoints
app.get('/games/:id', (req, res) => {
  console.log('GET /games/' + req.params.id);
  res.json({
    success: true,
    data: mockGame
  });
});

app.get('/categories/:id', (req, res) => {
  console.log('GET /categories/' + req.params.id);
  res.json({
    success: true,
    data: mockCategory
  });
});

app.get('/games', (req, res) => {
  console.log('GET /games');
  res.json({
    success: true,
    data: [mockGame],
    pagination: {
      page: 1,
      size: 10,
      total: 1
    }
  });
});

app.get('/categories', (req, res) => {
  console.log('GET /categories');
  res.json({
    success: true,
    data: [mockCategory],
    pagination: {
      page: 1,
      size: 10,
      total: 1
    }
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /games/:id');
  console.log('- GET /categories/:id');
  console.log('- GET /games');
  console.log('- GET /categories');
});
