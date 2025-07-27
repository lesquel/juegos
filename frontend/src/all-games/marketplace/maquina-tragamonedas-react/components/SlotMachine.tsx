import React from 'react';

interface SlotMachineProps {
  symbols: string[];
  isSpinning: boolean;
}

export function SlotMachine({ symbols, isSpinning }: SlotMachineProps) {
  return (
    <div className="slot-machine">
      <div className="slot-machine__frame">
        <div className="slot-machine__reels">
          {symbols.map((symbol, index) => (
            <div 
              key={`reel-${index}-${symbol}`}
              className={`slot-reel ${isSpinning ? 'spinning' : ''}`}
            >
              <div className="slot-reel__symbol">
                {symbol}
              </div>
            </div>
          ))}
        </div>
        
        <div className="slot-machine__line">
          <div className="win-line"></div>
        </div>
      </div>
      
      <div className="slot-machine__base">
        <div className="machine-light"></div>
        <div className="machine-light"></div>
        <div className="machine-light"></div>
      </div>
    </div>
  );
}
