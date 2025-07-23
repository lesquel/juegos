let soke = new WebSocket(
  "ws://localhost:8000/ws/games/3bb28c84-500c-43b8-afcb-9072e87a9dbf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MmUyNjVmMy1lZWIyLTRkMzEtOGEwNy0zZjE0ZDViMTMzMTEiLCJleHAiOjE3NTM0NTEzNjAsImlhdCI6MTc1MzIzNTM2MCwidHlwZSI6ImFjY2Vzc190b2tlbiJ9.tcIdwV92qO7U7dWkiu_14b6Vhi7_3a6WX29AbDvm7L"
);

soke.onopen = function (event) {
  console.log("WebSocket connection opened:", event);

  soke.send(JSON.stringify({
    "type": "join_game",
    "match_id": "3bb28c84-500c-43b8-afcb-9072e87a9dbf",
    "player_id": "42e265f3-eeb2-4d31-8a07-3f14d5b13311",
    "game_type": "connect4"
  }

  )); // Example message to send
}

soke.onmessage = function (event) {
  console.log("Message received from server:", event.data);
}
