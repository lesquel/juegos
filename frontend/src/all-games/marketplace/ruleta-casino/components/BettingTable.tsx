import React from 'react';
import { RouletteGameLogic } from '../logic/RouletteGameLogic';

interface BettingTableProps {
  bets: Map<string, number>;
  onPlaceBet: (betId: string) => void;
  disabled: boolean;
  selectedChip: number;
  lastWinningNumber: number | null;
}

export function BettingTable({ 
  bets, 
  onPlaceBet, 
  disabled, 
  selectedChip, 
  lastWinningNumber 
}: BettingTableProps) {
  
  const renderNumbersGrid = () => {
    const numbers: React.ReactElement[] = [];
    
    // Agregar 0
    numbers.push(
      <button
        key="0"
        className={`number-btn zero ${lastWinningNumber === 0 ? 'last-winner' : ''}`}
        onClick={() => onPlaceBet('0')}
        disabled={disabled}
        title={`Apostar ${RouletteGameLogic.formatCurrency(selectedChip)} al 0`}
      >
        <span className="number">0</span>
        {bets.has('0') && (
          <span className="bet-chip" style={{ background: RouletteGameLogic.getChipColor(selectedChip) }}>
            {RouletteGameLogic.formatCurrency(bets.get('0') || 0)}
          </span>
        )}
      </button>
    );

    // Agregar números 1-36
    for (let i = 1; i <= 36; i++) {
      const color = RouletteGameLogic.getNumberColor(i);
      const colorClass = color === 'red' ? 'red' : 'black';
      
      numbers.push(
        <button
          key={i}
          className={`number-btn ${colorClass} ${lastWinningNumber === i ? 'last-winner' : ''}`}
          onClick={() => onPlaceBet(i.toString())}
          disabled={disabled}
          title={`Apostar ${RouletteGameLogic.formatCurrency(selectedChip)} al ${i}`}
        >
          <span className="number">{i}</span>
          {bets.has(i.toString()) && (
            <span className="bet-chip" style={{ background: RouletteGameLogic.getChipColor(selectedChip) }}>
              {RouletteGameLogic.formatCurrency(bets.get(i.toString()) || 0)}
            </span>
          )}
        </button>
      );
    }

    return numbers;
  };

  const renderOutsideBets = () => {
    const outsideBets = [
      { id: 'red', name: 'ROJO', className: 'red' },
      { id: 'black', name: 'NEGRO', className: 'black' },
      { id: 'even', name: 'PAR', className: 'even' },
      { id: 'odd', name: 'IMPAR', className: 'odd' },
      { id: 'low', name: '1-18', className: 'low' },
      { id: 'high', name: '19-36', className: 'high' },
      { id: 'dozen1', name: '1er 12', className: 'dozen' },
      { id: 'dozen2', name: '2do 12', className: 'dozen' },
      { id: 'dozen3', name: '3er 12', className: 'dozen' },
      { id: 'column1', name: 'Col 1', className: 'column' },
      { id: 'column2', name: 'Col 2', className: 'column' },
      { id: 'column3', name: 'Col 3', className: 'column' }
    ];

    return outsideBets.map(bet => {
      const isWinning = lastWinningNumber !== null && 
        RouletteGameLogic.isBetWinning(bet.id, lastWinningNumber);

      return (
        <button
          key={bet.id}
          className={`outside-bet ${bet.className} ${isWinning ? 'last-winner' : ''}`}
          onClick={() => onPlaceBet(bet.id)}
          disabled={disabled}
          title={`Apostar ${RouletteGameLogic.formatCurrency(selectedChip)} en ${bet.name}`}
        >
          <span className="bet-label">{bet.name}</span>
          <span className="bet-payout">
            {RouletteGameLogic.getBetPayout(bet.id)}:1
          </span>
          {bets.has(bet.id) && (
            <span className="bet-chip" style={{ background: RouletteGameLogic.getChipColor(selectedChip) }}>
              {RouletteGameLogic.formatCurrency(bets.get(bet.id) || 0)}
            </span>
          )}
        </button>
      );
    });
  };

  return (
    <div className="betting-table">
      <h3>Mesa de Apuestas</h3>
      
      <div className="numbers-section">
        <h4>Números Directos (35:1)</h4>
        <div className="numbers-grid">
          {renderNumbersGrid()}
        </div>
      </div>

      <div className="outside-bets-section">
        <h4>Apuestas Externas</h4>
        <div className="outside-bets">
          {renderOutsideBets()}
        </div>
      </div>

      <div className="betting-help">
        <p className="help-text">
          💡 <strong>Cómo apostar:</strong> Selecciona una ficha y haz clic en el número o área donde quieres apostar.
        </p>
        <div className="payout-info">
          <span>🎯 Pleno: 35:1</span>
          <span>🔴 Color/Par/Impar: 1:1</span>
          <span>📊 Docenas/Columnas: 2:1</span>
        </div>
      </div>
    </div>
  );
}
