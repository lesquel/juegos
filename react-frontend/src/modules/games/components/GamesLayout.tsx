import React from "react";

const GamesLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full">
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  </div>
);

export default GamesLayout;
