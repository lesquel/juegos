import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameLogic } from '../logic/GameLogic';
import { GameProps } from '../types/GameTypes';
import '../styles/LostCity.css';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const LostCityGame: React.FC<GameProps> = ({ 
  onGameEnd,
  width = CANVAS_WIDTH, 
  height = CANVAS_HEIGHT 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLogicRef = useRef<GameLogic | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Input state
  const keysDownRef = useRef<boolean[]>([]);
  const pointersRef = useRef<number>(0);
  const pointersXRef = useRef<number[]>([]);
  const pointersYRef = useRef<number[]>([]);
  const stickXRef = useRef<number | undefined>(undefined);
  const stickYRef = useRef<number | undefined>(undefined);

  // WebGL context and shaders
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const shaderProgramRef = useRef<WebGLProgram | null>(null);

  // Initialize WebGL shaders
  const initWebGL = useCallback((canvas: HTMLCanvasElement) => {
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return null;
    }

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      uniform mat3 u_matrix;
      varying vec2 v_texCoord;
      
      void main() {
        vec2 position = (u_matrix * vec3(a_position, 1)).xy;
        gl_Position = vec4(position, 0, 1);
        v_texCoord = a_texCoord;
      }
    `;

    // Fragment shader source
    const fragmentShaderSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_alpha;
      varying vec2 v_texCoord;
      
      void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
        gl_FragColor.a *= u_alpha;
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return null;

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) return null;

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Shader program linking error:', gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    gl.useProgram(shaderProgram);
    shaderProgramRef.current = shaderProgram;
    glRef.current = gl;

    return gl;
  }, []);

  // Say function for displaying messages
  const say = useCallback((messages: string[], after?: () => void) => {
    if (messages.length === 0) {
      setShowMessage(false);
      after?.();
      return;
    }

    const text = messages[0];
    setMessage(text);
    setShowMessage(true);

    setTimeout(() => {
      say(messages.slice(1), after);
    }, 1000 + 200 * text.split(' ').length);
  }, []);

  // Handle input events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysDownRef.current[event.keyCode] = true;
    event.preventDefault();
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysDownRef.current[event.keyCode] = false;
    event.preventDefault();
  }, []);

  const setPointer = useCallback((event: React.MouseEvent | React.TouchEvent, down: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touches = (event as React.TouchEvent).touches;

    if (touches) {
      pointersRef.current = touches.length;
      for (let i = pointersRef.current; i--; ) {
        const t = touches[i];
        pointersXRef.current[i] = (2 * (t.clientX - rect.left)) / canvas.width - 1;
        pointersYRef.current[i] = 1 - (2 * (t.clientY - rect.top)) / canvas.height;
      }
    } else if (!down) {
      pointersRef.current = 0;
    } else {
      pointersRef.current = 1;
      const mouseEvent = event as React.MouseEvent;
      pointersXRef.current[0] = (2 * (mouseEvent.clientX - rect.left)) / canvas.width - 1;
      pointersYRef.current[0] = 1 - (2 * (mouseEvent.clientY - rect.top)) / canvas.height;
    }

    event.stopPropagation();
    event.preventDefault();
  }, []);

  const handlePointerDown = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    setPointer(event, true);
    if (pointersXRef.current[0] !== undefined) {
      stickXRef.current = pointersXRef.current[0];
      stickYRef.current = pointersYRef.current[0];
    }
  }, [setPointer]);

  const handlePointerMove = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    setPointer(event, pointersRef.current > 0);
  }, [setPointer]);

  const handlePointerUp = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    setPointer(event, false);
  }, [setPointer]);

  const handlePointerCancel = useCallback(() => {
    pointersRef.current = 0;
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    const gameLogic = gameLogicRef.current;
    const canvas = canvasRef.current;
    const gl = glRef.current;
    
    if (!gameLogic || !canvas || !gl) return;

    const currentTime = Date.now();
    gameLogic.updateTime(currentTime);

    // Handle input
    const input = gameLogic.handleInput(
      keysDownRef.current,
      pointersRef.current,
      pointersXRef.current,
      pointersYRef.current,
      stickXRef.current,
      stickYRef.current
    );

    const player = gameLogic.getPlayer();
    if (player) {
      gameLogic.moveTo(player, player.x + input.x, player.y + input.y, (player as any).speed);
    }

    // Clear canvas
    gl.clearColor(0.2, 0.4, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Render game (simplified for now)
    const state = gameLogic.getState();
    
    // Check for game end conditions
    if (player && (player as any).life <= 0 && state.finish === 0) {
      onGameEnd?.(0);
      return;
    }

    animationIdRef.current = requestAnimationFrame(gameLoop);
  }, [onGameEnd]);

  // Initialize game
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const gl = initWebGL(canvas);
    if (!gl) return;

    const gameLogic = new GameLogic();
    gameLogic.initializeMap();
    
    // Create player
    const state = gameLogic.getState();
    const player = {
      x: state.lookX,
      y: state.lookY,
      dx: 1,
      speed: 0.05,
      lastSpawn: 0,
      moving: false,
      life: 100,
      stunned: 0,
      isPlayer: true,
      sprite: '0',
      alive: Date.now() + 999999999 // Player stays alive
    };
    
    state.entities.push(player);
    gameLogicRef.current = gameLogic;

    // Start game loop
    animationIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [gameStarted, width, height, initWebGL, gameLoop]);

  // Event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Start game with intro message
  useEffect(() => {
    if (!gameStarted) {
      say([
        "In search of the lost city of S,",
        "S for superstition,",
        "where exactly that was invented,",
        "as legend has it. And to this day,",
        "a mishap happens here every 13 seconds.",
        "Head north and be careful!"
      ], () => {
        setGameStarted(true);
      });
    }
  }, [gameStarted, say]);

  return (
    <div className="lost-city-game" style={{ position: 'relative', width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerCancel}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerCancel}
        style={{ 
          border: '2px solid #8B4513',
          backgroundColor: '#2F4F2F',
          cursor: 'none'
        }}
      />
      
      {showMessage && (
        <div className="lost-city-message">
          {message}
        </div>
      )}
    </div>
  );
};

export default LostCityGame;
