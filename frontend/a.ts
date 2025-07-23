const soket = new WebSocket(
  "ws://localhost:8000/ws/games/3bb28c84-500c-43b8-afcb-9072e87a9dbf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MDk0NjBlNC01MDRiLTRkMjUtYTUxMy1jNDZkZDFhOGEzNWYiLCJleHAiOjE3NTM0NTEzMTksImlhdCI6MTc1MzIzNTMxOSwidHlwZSI6ImFjY2Vzc190b2tlbiJ9.rniyu2s1rDSVKsIaRm9v7MudMcGcqdY7yZWNRWQKyB8"
);

// ws://localhost:8000/ws/games/3bb28c84-500c-43b8-afcb-9072e87a9dbf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MDk0NjBlNC01MDRiLTRkMjUtYTUxMy1jNDZkZDFhOGEzNWYiLCJleHAiOjE3NTM0NTEzMTksImlhdCI6MTc1MzIzNTMxOSwidHlwZSI6ImFjY2Vzc190b2tlbiJ9.rniyu2s1rDSVKsIaRm9v7MudMcGcqdY7yZWNRWQKyB8
soket.onopen = function (event) {
  console.log("Conectado al servidor");
  soket.send(
    JSON.stringify({
      type: "join_game",
      match_id: "4ae8b602-018b-4272-8be6-0b0b5d3c35ba",
      player_id: "809460e4-504b-4d25-a513-c46dd1a8a35f",
      game_type: "connect4",
    })
  );
};

soket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log(data);
};

soket.onclose = function (event) {
  console.log("Desconectado del servidor");
};

soket.onerror = function (error) {
  console.error("Error WebSocket:", error);
};
