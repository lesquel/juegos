import React from "react";

const GamesLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-900">
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  </div>
);

export default GamesLayout;
