import React from 'react';

export const GridComponent: React.FC = () => {
  return (
    <div className="grid-background">
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="grid-cell"></div>
      ))}
    </div>
  );
};
