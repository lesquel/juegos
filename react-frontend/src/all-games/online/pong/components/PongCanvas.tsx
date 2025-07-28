import React, { useRef, useEffect } from 'react';
import type { GameState } from '../types/PongTypes';

interface PongCanvasProps {
  gameState: GameState;
}

export const PongCanvas: React.FC<PongCanvasProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, gameState.canvasWidth, gameState.canvasHeight);

    // Set canvas background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, gameState.canvasWidth, gameState.canvasHeight);

    // Draw center line
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gameState.canvasWidth / 2, 0);
    ctx.lineTo(gameState.canvasWidth / 2, gameState.canvasHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#fff';
    
    // Paddle 1 (left)
    ctx.fillRect(
      gameState.paddle1.x,
      gameState.paddle1.y,
      gameState.paddle1.width,
      gameState.paddle1.height
    );

    // Paddle 2 (right)
    ctx.fillRect(
      gameState.paddle2.x,
      gameState.paddle2.y,
      gameState.paddle2.width,
      gameState.paddle2.height
    );

    // Draw ball
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    
    // Player 1 score (left)
    ctx.fillText(
      gameState.score.player1.toString(),
      gameState.canvasWidth / 4,
      60
    );

    // Player 2 score (right)
    ctx.fillText(
      gameState.score.player2.toString(),
      (gameState.canvasWidth * 3) / 4,
      60
    );

  }, [gameState]);

  return (
    <div className="pong-canvas-container">
      <canvas
        ref={canvasRef}
        width={gameState.canvasWidth}
        height={gameState.canvasHeight}
        className="pong-canvas"
      />
    </div>
  );
};
