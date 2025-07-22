let soke = new WebSocket(
  "ws://localhost:8000/ws/games/38d658fd-e44f-4320-a065-e3dfcdd61345?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMzdlNmRmMC01M2MyLTQwNTctOGMyZC1mZTVlZDA4Y2UyYjEiLCJleHAiOjE3NTMzNDQwODAsImlhdCI6MTc1MzEyODA4MCwidHlwZSI6ImFjY2Vzc190b2tlbiJ9.luN_aZf2415othPORb6GF7rXa3hl0fHl18AdgJ-_pww"
);

soke.onopen = function (event) {
  console.log("WebSocket connection opened:", event);

  soke.send(JSON.stringify({
    "type": "join_game",
    "match_id": "38d658fd-e44f-4320-a065-e3dfcdd61345",
    "player_id": "b37e6df0-53c2-4057-8c2d-fe5ed08ce2b1",
    "game_type": "connect4"
  }

  )); // Example message to send
}

soke.onmessage = function (event) {
  console.log("Message received from server:", event.data);
}
