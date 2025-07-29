import React, { useState, useCallback, useEffect } from 'react';
import { HorseRacingLogic } from './logic/HorseRacingLogic';
import type { HorseRacingState, RaceResult, BetType, RaceHistoryEntry } from './types/HorseRacingTypes';
import { RaceTrack } from './components/RaceTrack';
import { BettingPanel } from './components/BettingPanel';
import { GameStatsDisplay } from './components/GameStats';
import { RaceHistory } from './components/RaceHistory';
import { WinDisplay } from './components/WinDisplay';
import { CountdownDisplay } from './components/CountdownDisplay';
import './styles/HorseRacingGame.css';

export function HorseRacingGame() {
  const [gameState, setGameState] = useState<HorseRacingState>(() => 
    HorseRacingLogic.createInitialState()
  );
  const [raceHistory, setRaceHistory] = useState<RaceHistoryEntry[]>([]);
  const [raceTimeouts, setRaceTimeouts] = useState<NodeJS.Timeout[]>([]);
  const [raceStartTime, setRaceStartTime] = useState<number | null>(null);
  const animationFrameId = React.useRef<number | null>(null);

  // Limpiar timeouts y animation frames al desmontar
  useEffect(() => {
    return () => {
      raceTimeouts.forEach(timeout => clearTimeout(timeout));
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [raceTimeouts]);

  const clearAllTimeouts = useCallback(() => {
    raceTimeouts.forEach(timeout => clearTimeout(timeout));
    setRaceTimeouts([]);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  }, [raceTimeouts]);

  // Animación de la carrera
  useEffect(() => {
    if (!gameState.isRacing || raceStartTime === null) {
      return;
    }

    const animateRace = (currentTime: DOMHighResTimeStamp) => {
      const elapsedTime = currentTime - raceStartTime;
      const raceProgress = Math.min(elapsedTime / HorseRacingLogic.CONFIG.RACE_DURATION, 1);

      setGameState(prev => {
        const newHorses = prev.horses.map(horse => {
          // Simular el avance basado en el progreso de la carrera
          // Esto es una simplificación, la lógica real de velocidad debería estar en HorseRacingLogic
          const newPosition = raceProgress * HorseRacingLogic.CONFIG.TRACK_LENGTH;

          // If race results are available, ensure horses reach their final positions
          if (prev.currentRaceResults) {
            const finalPosition = prev.currentRaceResults.find(r => r.horse.id === horse.id)?.position;
            if (finalPosition === 1) {
              // Winner always reaches the end
              return { ...horse, currentPosition: newPosition };
            } else if (finalPosition) {
              // Non-winners reach a position proportional to their final rank
              const proportionalPosition = newPosition * (1 - (finalPosition - 1) * 0.1); // Adjust as needed
              return { ...horse, currentPosition: Math.min(proportionalPosition, HorseRacingLogic.CONFIG.TRACK_LENGTH) };
            }
          }
          return { ...horse, currentPosition: newPosition };
        });
        return { ...prev, horses: newHorses };
      });

      if (raceProgress < 1) {
        animationFrameId.current = requestAnimationFrame(animateRace);
      } else {
        // La animación ha terminado, la carrera ha llegado a su fin visualmente
        // La lógica de isRacing se maneja en processRaceResult
      }
    };

    animationFrameId.current = requestAnimationFrame(animateRace);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState.isRacing, raceStartTime, setGameState]);

  const handleSelectHorse = useCallback((horseId: number) => {
    setGameState(prev => HorseRacingLogic.selectHorse(prev, horseId));
  }, []);

  const handleChangeBetAmount = useCallback((amount: number) => {
    setGameState(prev => HorseRacingLogic.changeBetAmount(prev, amount));
  }, []);

  const handleChangeBetType = useCallback((betType: BetType) => {
    setGameState(prev => HorseRacingLogic.changeBetType(prev, betType));
  }, []);

  const handleCountdownComplete = useCallback((results: RaceResult[]) => {
    // Procesar resultados de la carrera
    setGameState(prev => HorseRacingLogic.processRaceResult(prev, results));

    // Programar ocultado de animación de victoria y fin de carrera
    const winTimeout = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        showWinAnimation: false,
        winMessage: '',
        isRacing: false, // La carrera termina oficialmente aquí
      }));
    }, HorseRacingLogic.CONFIG.CELEBRATION_DURATION);

    setRaceTimeouts(prev => [...prev, winTimeout]);
  }, []);

  const handleStartRace = useCallback(async () => {
    if (!HorseRacingLogic.canStartRace(gameState)) {
      return;
    }

    clearAllTimeouts();

    // Deducir apuesta del balance y marcar como corriendo
    setGameState(prev => ({
      ...prev,
      balance: prev.balance - prev.selectedAmount,
      isRacing: true,
      winMessage: '',
      showWinAnimation: false,
      horses: HorseRacingLogic.resetPositions(prev.horses),
      currentRaceResults: null, // Clear previous results
    }));

    setRaceStartTime(performance.now());

    // Generar resultados de la carrera
    const raceResults = HorseRacingLogic.generateRiggedRaceResults(gameState);

    // Iniciar countdown que manejará la carrera completa
    setGameState(prev => ({
      ...prev,
      countdownActive: true,
      countdownNumber: 3,
      currentRaceResults: raceResults, // Store race results in gameState
    }));

    // El countdown se encargará de llamar a handleCountdownComplete con los resultados
    // Asegurarse de que handleCountdownComplete se llama DESPUÉS de que la animación haya terminado
    setTimeout(() => {
      handleCountdownComplete(raceResults);
      setRaceStartTime(null); // Reset race start time
    }, HorseRacingLogic.CONFIG.RACE_DURATION);

  }, [gameState, clearAllTimeouts, handleCountdownComplete]);

  const handleReset = useCallback(() => {
    if (gameState.isRacing) return;

    clearAllTimeouts();
    setGameState(HorseRacingLogic.createInitialState());
  }, [gameState.isRacing, clearAllTimeouts]);

  const canStartRace = HorseRacingLogic.canStartRace(gameState);
  const isLowBalance = HorseRacingLogic.isLowBalance(gameState.balance);

  return (
    <div className="horse-racing-game">
      <div className="horse-racing-game__header">
        <h1>🏇 HIPÓDROMO CASINO 🏇</h1>
        <p className="subtitle">¡Apuesta por tu caballo favorito y gana a lo grande!</p>
      </div>

      <div className="horse-racing-game__main">
        <div className="game-section race-section">
          <RaceTrack 
            horses={gameState.horses}
            isRacing={gameState.isRacing}
            raceResults={gameState.currentRaceResults}
            raceNumber={gameState.raceNumber}
            trackLength={HorseRacingLogic.CONFIG.TRACK_LENGTH}
            raceDuration={HorseRacingLogic.CONFIG.RACE_DURATION}
          />

          <div className="race-controls">
            <button
              className={`start-race-btn ${gameState.isRacing ? 'racing' : ''} ${!canStartRace ? 'disabled' : ''}`}
              onClick={handleStartRace}
              disabled={!canStartRace}
              title={(() => {
                if (!gameState.selectedHorse) return 'Selecciona un caballo primero';
                if (gameState.balance < gameState.selectedAmount) return 'Saldo insuficiente';
                return 'Iniciar carrera';
              })()}
            >
              {gameState.isRacing ? (
                <>
                  <span className="racing-icon">🏁</span>
                  {' '}CARRERA EN CURSO...
                </>
              ) : (
                <>
                  <span>🏁</span>
                  {' '}¡INICIAR CARRERA!
                </>
              )}
            </button>

            <button
              className="reset-btn"
              onClick={handleReset}
              disabled={gameState.isRacing}
              title="Reiniciar juego"
            >
              🔄 Reiniciar
            </button>
          </div>
        </div>

        <div className="game-section betting-section">
          <BettingPanel
            balance={gameState.balance}
            selectedHorse={gameState.selectedHorse}
            selectedAmount={gameState.selectedAmount}
            selectedBetType={gameState.selectedBetType}
            horses={gameState.horses}
            disabled={gameState.isRacing}
            onSelectHorse={handleSelectHorse}
            onChangeBetAmount={handleChangeBetAmount}
            onChangeBetType={handleChangeBetType}
          />
        </div>
      </div>

      <div className="horse-racing-game__info">
        <div className="info-section">
          <GameStatsDisplay
            stats={gameState.stats}
            horses={HorseRacingLogic.HORSES}
            currentRace={gameState.raceNumber}
            history={gameState.raceHistory}
            balance={gameState.balance}
          />
        </div>

        <div className="info-section">
          <RaceHistory 
            history={raceHistory}
          />
        </div>
      </div>

      <CountdownDisplay 
        isVisible={gameState.countdownActive}
        startNumber={gameState.countdownNumber || 3}
        onComplete={() => {
          setGameState(prev => ({
            ...prev,
            countdownActive: false,
            countdownNumber: 0
          }));
        }}
      />

      <WinDisplay
        isVisible={gameState.showWinAnimation}
        winAmount={gameState.balance > HorseRacingLogic.CONFIG.INITIAL_BALANCE ? gameState.selectedAmount * 2 : 0}
        selectedHorse={gameState.selectedHorse ? HorseRacingLogic.HORSES.find(h => h.id === gameState.selectedHorse) || null : null}
        betAmount={gameState.selectedAmount}
        betType={gameState.selectedBetType}
        raceResults={gameState.currentRaceResults || []}
        onClose={() => {
          setGameState(prev => ({
            ...prev,
            showWinAnimation: false,
            winMessage: ''
          }));
        }}
      />

      <div className="horse-racing-game__footer">
        <div className="game-tips">
          <h3>💡 Consejos de Apuesta:</h3>
          <ul>
            <li><strong>Ganar (5:1):</strong> Mayor pago, pero tu caballo debe quedar 1°</li>
            <li><strong>Lugar (2.5:1):</strong> Pago moderado, tu caballo debe quedar 1° o 2°</li>
            <li><strong>Show (1.5:1):</strong> Menor pago, pero mayor probabilidad (1°, 2° o 3°)</li>
          </ul>
        </div>
        
        {isLowBalance && !gameState.isRacing && (
          <div className="warning">
            ⚠️ Saldo bajo. Considera apostar menos o reiniciar el juego.
          </div>
        )}
        
        {gameState.balance < HorseRacingLogic.CONFIG.BET_AMOUNTS[0] && (
          <div className="critical-warning">
            🚨 Sin fondos suficientes. ¡Reinicia el juego para continuar!
          </div>
        )}
      </div>
    </div>
  );
}
