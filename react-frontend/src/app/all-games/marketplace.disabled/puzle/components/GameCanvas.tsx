import React, { useRef, useEffect } from 'react';
import type { GameState } from '../types/GameTypes';
import { PuzleGameLogic } from '../logic/PuzleGameLogic';
import '../styles/GameCanvas.css';

interface GameCanvasProps {
  gameState: GameState;
  width: number;
  height: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  width,
  height
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = PuzleGameLogic.COLORS.background;
    ctx.fillRect(0, 0, width, height);

    // Draw grid (optional)
    drawGrid(ctx, width, height);

    // Draw finish
    if (gameState.finish.isVisible) {
      drawRect(ctx, gameState.finish, PuzleGameLogic.COLORS.finish);
    }

    // Draw walls
    gameState.walls.forEach(wall => {
      if (wall.isVisible) {
        drawRect(ctx, wall, PuzleGameLogic.COLORS.wall);
      }
    });

    // Draw lavas
    gameState.lavas.forEach(lava => {
      if (lava.isVisible) {
        drawRect(ctx, lava, PuzleGameLogic.COLORS.lava);
        // Add lava effect
        drawLavaEffect(ctx, lava);
      }
    });

    // Draw portals
    gameState.portals.forEach(portal => {
      if (portal.isVisible && portal.isActive) {
        drawRect(ctx, portal, PuzleGameLogic.COLORS.portal);
        // Add portal effect
        drawPortalEffect(ctx, portal);
      }
    });

    // Draw coins
    gameState.coins.forEach(coin => {
      if (coin.isVisible && !coin.isCollected) {
        drawCoin(ctx, coin);
      }
    });

    // Draw hero
    if (gameState.hero.isVisible) {
      drawHero(ctx, gameState.hero);
    }

  }, [gameState, width, height]);

  const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= w; x += PuzleGameLogic.CONFIG.TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= h; y += PuzleGameLogic.CONFIG.TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  };

  const drawRect = (ctx: CanvasRenderingContext2D, obj: any, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(obj.position.x, obj.position.y, obj.size.width, obj.size.height);
    
    // Add border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(obj.position.x, obj.position.y, obj.size.width, obj.size.height);
  };

  const drawHero = (ctx: CanvasRenderingContext2D, hero: any) => {
    // Hero body
    ctx.fillStyle = hero.color;
    const heroX = hero.position.x;
    const heroY = hero.position.y;
    const heroSize = hero.size.width;
    
    ctx.fillRect(heroX, heroY, heroSize, heroSize);
    
    // Hero border
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(heroX, heroY, heroSize, heroSize);
    
    // Hero face (simple dots for eyes)
    ctx.fillStyle = '#000000';
    const eyeSize = 1;
    ctx.fillRect(heroX + 2, heroY + 2, eyeSize, eyeSize);
    ctx.fillRect(heroX + 5, heroY + 2, eyeSize, eyeSize);
    
    // Movement indicator
    if (hero.isMoving) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(heroX - 2, heroY - 2, heroSize + 4, heroSize + 4);
    }
  };

  const drawCoin = (ctx: CanvasRenderingContext2D, coin: any) => {
    const centerX = coin.position.x + coin.size.width / 2;
    const centerY = coin.position.y + coin.size.height / 2;
    const radius = coin.size.width / 2;
    
    // Coin body
    ctx.fillStyle = coin.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Coin border
    ctx.strokeStyle = '#ffa500';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Coin symbol ($)
    ctx.fillStyle = '#000000';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', centerX, centerY);
  };

  const drawLavaEffect = (ctx: CanvasRenderingContext2D, lava: any) => {
    // Add animated bubbles effect
    const time = Date.now() * 0.005;
    for (let i = 0; i < 3; i++) {
      const bubbleX = lava.position.x + (Math.sin(time + i) + 1) * 8;
      const bubbleY = lava.position.y + (Math.cos(time + i * 0.7) + 1) * 8;
      const bubbleRadius = 2 + Math.sin(time + i * 2);
      
      ctx.fillStyle = 'rgba(255, 100, 100, 0.6)';
      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, bubbleRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawPortalEffect = (ctx: CanvasRenderingContext2D, portal: any) => {
    // Add swirling effect
    const time = Date.now() * 0.01;
    const centerX = portal.position.x + portal.size.width / 2;
    const centerY = portal.position.y + portal.size.height / 2;
    
    for (let i = 0; i < 5; i++) {
      const angle = time + i * Math.PI * 0.4;
      const radius = 3 + i * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.fillStyle = `rgba(247, 140, 107, ${0.8 - i * 0.15})`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return (
    <div className="game-canvas-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="game-canvas"
      />
    </div>
  );
};
